import i18n from "@/plugins/i18n/i18n";
import { useUserStore } from "@/stores/user";

const { notify } = useUtilities();
const userStore = useUserStore();

const { t } = i18n.global;
const { eventBus } = useUtilities();

export function useTopUpInput() {
  async function claimFreePoints(): Promise<boolean> {
    const memberId = parseInt(userStore.userId);
    return await axios
      .post(`/Points/RequestFreePoints?memberId=${memberId}`)
      .then(async () => {
        const successMessage = t("more.message.claimedFreePointsSuccessfully");
        successCallback(successMessage);
        eventBus.emit("refresh-transaction-data");
        return true;
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 400 && err.response?.data === "have_enough_points") {
            notify(t("more.message.enoughPoints"), "negative");
          } else {
            notify(err.message, "negative");
          }
        } else {
          notify(err.message, "negative");
        }
        return false;
      });
  }
  async function creditCardCheckout(creditCardInfo: any, selectedPackage: any): Promise<boolean> {
    const memberId = parseInt(userStore.userId);
    const [month, year] = creditCardInfo.expiryDate.split("/");
    creditCardInfo["expMonth"] = month;
    creditCardInfo["expYear"] = `20${year}`;

    creditCardInfo["totalCost"] = selectedPackage.amount * 100;
    creditCardInfo["subscriberId"] = memberId;
    creditCardInfo["purchasedPoints"] = selectedPackage.points;

    return await axios
      .post("/Points/PurchasePoints", creditCardInfo)
      .then(() => {
        eventBus.emit("refresh-transaction-data");
        successCallback(t("more.message.purchasePointSuccessfully"));
        return true;
      })
      .catch(err => {
        notify(err.message, "negative");
        return false;
      });
  }
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
  }

  return {
    claimFreePoints,
    creditCardCheckout,
    useTopUpInput
  };
}
