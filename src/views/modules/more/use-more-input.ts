import i18n from "@/plugins/i18n/i18n";
// Interface files
import { Member } from "@/interfaces/models/entities/member";

// .ts files
import { useUserStore } from "@/stores/user";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Member;
};

const { t } = i18n.global;

const toolTipCreate = ref("member.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

export function useMoreInput() {
  const memberInput = ref<Member>(newInput());

  function setMemberInput(val: Member) {
    //areaInput.value = extend(true, {}, val);
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

  return {
    memberInput,
    updateMember,
    toolTipCreate,
    locale,
    lang,
    useMoreInput,
    setValidatedInput,
    setMemberInput
  };
}
