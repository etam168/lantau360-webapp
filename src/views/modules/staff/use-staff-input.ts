// vue component import
import { ref } from "vue";

// 3rd Part import
import axios, { AxiosError } from "axios";
import i18n from "@/plugins/i18n/i18n";
import * as yup from "yup";

// .ts file
import { StaffInput } from "@/interfaces/input/staff-input";
import { StaffDatatable } from "@/interfaces/datatable/staff-datatable";
import { onRefresh, loading } from "./use-table-options";
import { useUtilities } from "@/composable/use-utilities";
import { useUserStore } from "@/stores/user";

import { BASE_URL } from "@/constants";
const { notify } = useUtilities();
const userStore = useUserStore();
const error = ref<string | null>(null);

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as StaffInput;
};

const { t } = i18n.global;

export function useStaffInput() {
  const staffInput = ref<StaffInput>(newInput());
  const imagePath = ref();

  function setStaffInput(val: StaffDatatable) {
    staffInput.value.staffId = val.staffId;
    staffInput.value.staffAlias = val.staffAlias;
    staffInput.value.userName = val.userName;
    staffInput.value.firstName = val.firstName;
    staffInput.value.lastName = val.lastName;
    staffInput.value.email = val.email;
    staffInput.value.roleCode = val.roleCode;
    staffInput.value.status = val.status;
    staffInput.value.createdAt = val.createdAt;
    staffInput.value.createdBy = val.createdBy;
    staffInput.value.modifiedAt = val.modifiedAt;
    staffInput.value.modifiedBy = val.modifiedBy;
    staffInput.value.meta = val.meta;
    staffInput.value.staffAliasAlt = val.staffAliasAlt;
    staffInput.value.imagePath = val.imagePath;
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  function updateStaff(onDialogCancel: any) {
    try {
      loading.value = true;
      staffInput.value.meta ??= {};
      staffInput.value.modifiedBy = parseInt(userStore.userId);
      axios.put(`/Staff/${staffInput.value.staffId}`, staffInput.value).then(async () => {
        onRefresh();
        const successMessage = t("staff.message.updated");
        successCallback(successMessage);
        setTimeout(() => {
          onDialogCancel();
        }, 1200);
      });
    } catch (e: any) {
      notify(e.message, "negative");
      loading.value = false;
    }
  }

  async function createStaff(onDialogCancel: any, password: string) {
    try {
      staffInput.value.createdBy = parseInt(userStore.userId);
      staffInput.value.userName = staffInput.value.email;
      staffInput.value.status = 1;
      loading.value = true;
      axios
        .post(`/StaffAuth/CreateUser?password=${password}`, staffInput.value)
        .then(async response => {
          staffInput.value.staffId = response.data.staffId;
          if (imagePath.value != null) {
            await addOrUpdateProfileImage(imagePath.value, false);
          }

          onRefresh();
          const successMessage = t("staff.message.created");
          successCallback(successMessage);
          setTimeout(() => {
            onDialogCancel();
          }, 1200);
        });
    } catch (e: any) {
      notify(e.message, "negative");
      loading.value = false;
    }
  }

  async function addOrUpdateProfileImage(image: any, isUpdateRequest: boolean = true) {
    const url = `${BASE_URL}/Staff/Image/${staffInput.value.staffId}`;

    const formData = new FormData();
    formData.append("image", image);

    await axios
      .put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        if (isUpdateRequest) {
          if (parseInt(userStore.userId) == staffInput.value.staffId) {
            userStore.avatar = response.data;
          }
          onRefresh();
          const successMessage = t("staff.message.updated");
          successCallback(successMessage);
        }
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = "Not found";
          } else {
            error.value = "An error occurred";
          }
        } else {
          error.value = "An unexpected error occurred";
        }
      });
  }

  const createschema = yup.object({
    firstName: yup.string().required().min(3),
    lastName: yup.string().required().min(3),
    password: yup.string().required().min(3),
    staffAlias: yup.string().min(3).required().label(t("staff.columns.staffAlias")),
    email: yup.string().required().email().label(t("staff.columns.email"))
  });
  const editschema = yup.object({
    firstName: yup.string().required().min(3),
    lastName: yup.string().required().min(3),
    staffAlias: yup.string().min(3).required().label(t("staff.columns.staffAlias")),
    email: yup.string().required().email().label(t("staff.columns.email"))
  });

  function setValidatedInput(val: any) {
    staffInput.value.firstName = val.firstName;
    staffInput.value.lastName = val.lastName;
    staffInput.value.email = val.email;
    staffInput.value.roleCode = val.roleCode;

    staffInput.value.staffAlias = val.staffAlias;
    staffInput.value.staffAliasAlt ??= {};
    staffInput.value.staffAliasAlt.i18n ??= {};
    staffInput.value.staffAliasAlt.i18n["hk"] ??= {};
    staffInput.value.staffAliasAlt.i18n["cn"] ??= {};
    staffInput.value.staffAliasAlt.i18n["cn"]["staffAlias"] = val.metaStaffAliasCn;
    staffInput.value.staffAliasAlt.i18n["hk"]["staffAlias"] = val.metaStaffAliasHk;
    // staffInput.value.meta ??= {};
    // staffInput.value.meta.i18n ??= {};
    staffInput.value.status = val.status;
  }

  async function updatePassword(username: string, password: string) {
    axios
      .put(`StaffAuth/ResetPassword/${username}?password=${password}`)
      .then(() => {
        successCallback("Password udpate successfully");
      })
      .catch(error => {
        throw new Error(error.response.data || "Password not updated");
      });
  }

  return {
    staffInput,
    createschema,
    editschema,
    setValidatedInput,
    imagePath,
    createStaff,
    updateStaff,
    successCallback,
    setStaffInput,
    addOrUpdateProfileImage,
    updatePassword
  };
}
