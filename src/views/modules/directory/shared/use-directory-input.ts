/* eslint-disable @typescript-eslint/no-unused-vars */
// vue component import
import { ref } from "vue";

// 3rd Part import
import { is } from "quasar";
import axios from "axios";
import i18n from "@/plugins/i18n/i18n";
import * as yup from "yup";

// .ts file
import { DirectoryInput } from "@/interfaces/input/directory-input";
import { onRefresh } from "../use-table-options";
import { useUtilities } from "@/composable/use-utilities";
import { useUserStore } from "@/stores/user";
import { DirectoryDatatable } from "@/interfaces/datatable/directory-datatable";
import eventBus from "@/utils/event-bus";

const { notify } = useUtilities();
const userStore = useUserStore();

const newDirectoryInput = () => {
  return {
    modifiedAt: new Date()
  } as DirectoryInput;
};

const { t } = i18n.global;

export function useDirectoryInput() {
  const directoryInput = ref<DirectoryInput>(newDirectoryInput());
  const imagePath = ref();

  const loading = ref(false);
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  async function updateDirectory(): Promise<boolean> {
    directoryInput.value.modifiedBy = parseInt(userStore.userId);

    if (directoryInput.value.directoryId <= 8) {
      directoryInput.value.groupId = 1;
    } else if (directoryInput.value.directoryId <= 16) {
      directoryInput.value.groupId = 2;
    }

    if (is.object(directoryInput.value.meta) == false) {
      directoryInput.value.meta = {};
    }

    // Update directory record
    return axios
      .put(`/Directory/${directoryInput.value.directoryId}`, directoryInput.value)
      .then(async () => {
        const successMessage = t("directory.message.updated");
        successCallback(successMessage);
        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }
        return false;
      });
  }

  async function createDirectory(): Promise<boolean> {
    directoryInput.value.directoryId = 0;
    directoryInput.value.createdBy = parseInt(userStore.userId);

    if (is.object(directoryInput.value.meta) == false) {
      directoryInput.value.meta = {};
    }

    // Create a new directory record
    return axios
      .post(`/Directory`, directoryInput.value)
      .then(async response => {
        directoryInput.value.directoryId = response.data.directoryId;

        if (imagePath.value != null) {
          await uploadImage(directoryInput.value.directoryId, 1, imagePath.value, true);
        }
        onRefresh();
        eventBus.emit("onDirectoryCreate", directoryInput.value);

        const successMessage = t("directory.message.created");
        successCallback(successMessage);
        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }
        return false;
      });
  }

  async function deleteImage(id: number, ranking: number) {
    const url = `/DirectoryImage/DeleteByDirectoryIdAndRanking?buidlingId=${id}&ranking=${ranking}`;
    loading.value = true;
    return axios
      .delete(url)
      .then(() => {
        // onRefresh();
        const successMessage = t("propertyListing.message.deleteImage");
        successCallback(successMessage);

        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }

        return false;
      });
  }

  async function uploadImage(
    directoryId: number,
    ranking: number,
    imageFile: any,
    isCreateRequest: boolean = false
  ) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const isSuccess = axios
      .post(`/DirectoryImage/${directoryId}`, formData, {
        params: { ranking: ranking, createdBy: 0, modifiedBy: 0 },
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(() => {
        if (!isCreateRequest) {
          const successMessage = t("directory.message.uploadImage");
          successCallback(successMessage);
        }
        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }

        return false;
      });
    return isSuccess;
  }
  const initialValues = ref({
    status: 1
  });

  const schema = yup.object({
    directoryName: yup.string().min(3).required().label(t("directory.columns.directoryName")),
    shortName: yup.string().min(3).required().label(t("directory.columns.shortName")),
    groupId: yup.string().required()
  });

  function setDirectoryInput(val: DirectoryDatatable) {
    // Need to manually assign the values
    directoryInput.value.directoryId = val.directoryId;
    directoryInput.value.directoryName = val.directoryName;
    directoryInput.value.shortName = val.shortName;
    directoryInput.value.description = val.description;
    directoryInput.value.groupId = val.groupId;
    directoryInput.value.status = val.status;
    directoryInput.value.createdBy = val.createdBy;
    directoryInput.value.createdAt = val.createdAt;
    directoryInput.value.modifiedBy = val.modifiedBy;
    directoryInput.value.modifiedAt = val.modifiedAt;
    directoryInput.value.meta = val.meta;
  }

  function setValidatedInput(values: any) {
    directoryInput.value.status = values.status;

    directoryInput.value.directoryName = values.directoryName;
    directoryInput.value.meta ??= {};
    directoryInput.value.meta.i18n ??= {};
    directoryInput.value.meta.i18n["hk"] ??= {};
    directoryInput.value.meta.i18n["cn"] ??= {};
    directoryInput.value.meta.i18n["cn"]["directoryName"] = values.directoryNameCn;
    directoryInput.value.meta.i18n["hk"]["directoryName"] = values.directoryNameHk;

    directoryInput.value.shortName = values.shortName;
    directoryInput.value.meta ??= {};
    directoryInput.value.meta.i18n ??= {};
    directoryInput.value.meta.i18n["hk"] ??= {};
    directoryInput.value.meta.i18n["cn"] ??= {};
    directoryInput.value.meta.i18n["cn"]["shortName"] = values.shortNameCn;
    directoryInput.value.meta.i18n["hk"]["shortName"] = values.shortNameHk;
  }

  return {
    directoryInput,
    updateDirectory,
    createDirectory,
    setDirectoryInput,
    deleteImage,
    uploadImage,
    imagePath,
    setValidatedInput,
    schema,
    initialValues
  };
}
