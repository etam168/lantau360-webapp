import axios from "axios";
import i18n from "@/plugins/i18n/i18n";

// .ts files
import { useUserStore } from "@/stores/user";

const { notify } = useUtilities();
const userStore = useUserStore();
const { t } = i18n.global;

export function useCheckInService() {
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
  }

  async function submitCheckIn(siteId: number, description: string): Promise<boolean> {
    const checkInDto = {
      siteId: siteId,
      memberId: parseInt(userStore.userId),
      checkInfo: {
        description: description,
        checkInAt: new Date()
      },
      createdAt: new Date(),
      createdBy: parseInt(userStore.userId)
    };

    return await axios
      .post("/CheckIn", checkInDto)
      .then(() => {
        successCallback(t("home.message.checkInDataSubmittedSuccessfully"));
        return true;
      })
      .catch(err => {
        notify(err.message, "negative");
        return false;
      });
  }

  return {
    submitCheckIn,
    useCheckInService
  };
}
