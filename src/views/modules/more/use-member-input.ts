import i18n from "@/plugins/i18n/i18n";
// Interface files
import { Member } from "@/interfaces/models/entities/member";

// .ts files
import { useUserStore } from "@/stores/user";
import { BASE_URL } from "@/constants";

const { notify } = useUtilities();
const userStore = useUserStore();
const error = ref<string | null>(null);
const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Member;
};

const { t } = i18n.global;

const toolTipCreate = ref("member.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

export function useMemberInput() {
  const memberInput = ref<Member>(newInput());

  function setMemberInput(val: Member) {
    memberInput.value.email = val.email;
    memberInput.value.firstName = val.firstName;
    memberInput.value.lastName = val.lastName;
    memberInput.value.phone = val.phone;
  }

  function setValidatedInput(values: any) {
    memberInput.value.email = values.email;
    memberInput.value.firstName = values.firstName;
    memberInput.value.lastName = values.lastName;
    memberInput.value.phone = values.phone;
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
  }

  function updateMember(onDialogCancel: any) {
    memberInput.value.modifiedBy = parseInt(userStore.userId);
    axios
      .put(`/Member/${memberInput.value.memberId}`, memberInput.value)
      .then(async () => {
        const successMessage = t("member.message.updated");

        successCallback(successMessage);

        setTimeout(() => {
          onDialogCancel();
        }, 1200);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }
  async function handleUpdateMemberAvatar(newAvatar: any) {
    const url = `${BASE_URL}/MemberImage/${userStore.userId}`;

    const formData = new FormData();
    formData.append("image", newAvatar);

    await axios
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        if (response.status == 200) {
          userStore.avatar = response.data;
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
  return {
    memberInput,
    handleUpdateMemberAvatar,
    updateMember,
    toolTipCreate,
    locale,
    lang,
    useMemberInput,
    setValidatedInput,
    setMemberInput
  };
}
