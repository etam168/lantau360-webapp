import axios from "axios";
import { ref } from "vue";
import { Member } from "@/interfaces/models/entities/member";

import i18n from "@/plugins/i18n/i18n";
import { useUserStore } from "@/stores/user";

import { useUtilities } from "@/composable/use-utilities";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Member;
};

const { t } = i18n.global;

const [bannerPath, imagePath, iconPath] = [ref(), ref(), ref()];

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);
const toolTipCreate = ref("member.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

export function useMoreInput() {
  const memberInput = ref<Member>(newInput());

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    // loading.value = false;
  }

  function getMember() {
    axios
      .get(`/Member/${userStore.userId}`)
      .then(response => {
        memberInput.value = response.data;
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
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
    bannerPath,
    iconPath,
    imagePath,

    bannerRef,
    iconRef,
    imageRef,

    toolTipCreate,

    locale,
    lang,
    useMoreInput,
    getMember
    // setMemberInput
  };
}
