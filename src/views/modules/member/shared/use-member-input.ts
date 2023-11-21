/* eslint-disable @typescript-eslint/no-unused-vars */
// vue component import
import { ref } from "vue";

// 3rd Part import
import { is } from "quasar";
import axios from "axios";
import i18n from "@/plugins/i18n/i18n";
import * as yup from "yup";

// .ts file
import { MemberInput } from "@/interfaces/input/member-input";
import { onRefresh } from "../use-table-options";
import { useUtilities } from "@/composable/use-utilities";
import { useUserStore } from "@/stores/user";
import { MemberDatatable } from "@/interfaces/datatable/member-datatable";

const { notify } = useUtilities();
const userStore = useUserStore();

const newMemberInput = () => {
  return {
    modifiedAt: new Date()
  } as MemberInput;
};

const { t } = i18n.global;

export function useMemberInput() {
  const memberInput = ref<MemberInput>(newMemberInput());
  const imagePath = ref();

  const loading = ref(false);
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  async function updateMember(): Promise<boolean> {
    memberInput.value.modifiedBy = parseInt(userStore.userId);

    if (is.object(memberInput.value.meta) == false) {
      memberInput.value.meta = {};
    }

    // Update member record
    return axios
      .put(`/Member/${memberInput.value.memberId}`, memberInput.value)
      .then(async () => {
        onRefresh();
        const successMessage = t("member.message.updated");
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

  const initialValues = ref({
    status: 1
  });

  const schema = yup.object({
    firstName: yup.string().min(3).required().label(t("member.columns.firstName")),
    lastName: yup.string().min(3).required().label(t("member.columns.lastName")),
    alias: yup.string().min(3).required().label(t("member.columns.alias")),
    phone: yup.string().min(3).required().label(t("member.columns.phone")),
    email: yup.string().email().label(t("member.columns.email"))
  });

  function setMemberInput(val: MemberDatatable) {
    // Need to manually assign the values

    memberInput.value.memberId = val.memberId;
    memberInput.value.alias = val.alias;
    memberInput.value.firstName = val.firstName;
    memberInput.value.lastName = val.lastName;
    memberInput.value.userName = val.userName;
    memberInput.value.phone = val.phone;
    memberInput.value.email = val.email;

    memberInput.value.status = val.status;
    memberInput.value.createdBy = val.createdBy;
    memberInput.value.createdAt = val.createdAt;
    memberInput.value.modifiedBy = val.modifiedBy;
    memberInput.value.modifiedAt = val.modifiedAt;
    memberInput.value.meta = val.meta;
  }

  function setValidatedInput(values: any) {
    memberInput.value.alias = values.alias;
    memberInput.value.userName = values.userName;
    memberInput.value.phone = values.phone;
    memberInput.value.email = values.email;
    memberInput.value.status = values.status;

    memberInput.value.firstName = values.firstName;
    memberInput.value.meta ??= {};
    memberInput.value.meta.i18n ??= {};
    memberInput.value.meta.i18n["hk"] ??= {};
    memberInput.value.meta.i18n["cn"] ??= {};
    memberInput.value.meta.i18n["cn"]["firstName"] = values.firstNameCn;
    memberInput.value.meta.i18n["hk"]["firstName"] = values.firstNameHk;

    memberInput.value.lastName = values.lastName;
    memberInput.value.meta ??= {};
    memberInput.value.meta.i18n ??= {};
    memberInput.value.meta.i18n["hk"] ??= {};
    memberInput.value.meta.i18n["cn"] ??= {};
    memberInput.value.meta.i18n["cn"]["lastName"] = values.lastNameCn;
    memberInput.value.meta.i18n["hk"]["lastName"] = values.lastNameHk;
  }
  async function updatePassword(username: string, password: string) {
    await axios
      .put(`MemberAuth/ResetPassword?username=${username}&newPassword=${password}`)
      .then(() => {
        successCallback("Password udpate successfully");
      })
      .catch(error => {
        throw new Error(error.response.data || "Password not updated");
      });
  }
  return {
    memberInput,
    updateMember,
    setMemberInput,
    imagePath,
    setValidatedInput,
    schema,
    initialValues,
    updatePassword
  };
}
