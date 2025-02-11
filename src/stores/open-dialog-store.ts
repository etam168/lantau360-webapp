// stores/open-dialog-store.ts
import { defineStore } from "pinia";

export const useOpenDialogStore = defineStore("openDialog", () => {
  const router = useRouter();

  const homePageStack = ref<string[]>([]);
  const businessPageStack = ref<string[]>([]);
  const communityPageStack = ref<string[]>([]);
  const favouritePageStack = ref<string[]>([]);
  const morePageStack = ref<string[]>([]);
  const emailConfirmationPageStack = ref<string[]>([]);

  function dialogStackPop(dialogId: string) {
    const currentStackValue = getCurrentStackValue();

    if (currentStackValue === dialogId) {
      const currentRouteName = router.currentRoute.value.name as string;
      switch (currentRouteName) {
        case "home":
          return homePageStack.value.pop();
        case "business":
          return businessPageStack.value.pop();
        case "community":
          return communityPageStack.value.pop();
        case "favourite":
          return favouritePageStack.value.pop();
        case "more":
          return morePageStack.value.pop();
        case "email-confirmation":
          return emailConfirmationPageStack.value.pop();
        default:
          return undefined;
      }
    }

    return undefined;
  }

  function dialogStackPush(dialogId: string) {
    const currentRouteName = router.currentRoute.value.name as string;

    switch (currentRouteName) {
      case "home":
        homePageStack.value.push(dialogId);
        break;
      case "business":
        businessPageStack.value.push(dialogId);
        break;
      case "community":
        communityPageStack.value.push(dialogId);
        break;
      case "favourite":
        favouritePageStack.value.push(dialogId);
        break;
      case "more":
        morePageStack.value.push(dialogId);
        break;
      case "email-confirmation":
        emailConfirmationPageStack.value.push(dialogId);
        break;
      default:
        break;
    }
  }

  function dialogStackReset() {
    const currentRouteName = router.currentRoute.value.name as string;

    switch (currentRouteName) {
      case "home":
        homePageStack.value = [];
        break;
      case "business":
        businessPageStack.value = [];
        break;
      case "community":
        communityPageStack.value = [];
        break;
      case "favourite":
        favouritePageStack.value = [];
        break;
      case "more":
        morePageStack.value = [];
        break;
      case "email-confirmation":
        emailConfirmationPageStack.value = [];
        break;
      default:
        break;
    }
  }

  function getCurrentStackValue() {
    const currentRouteName = router.currentRoute.value.name as string;

    switch (currentRouteName) {
      case "home":
        return homePageStack.value.at(-1);
      case "business":
        return businessPageStack.value.at(-1);
      case "community":
        return communityPageStack.value.at(-1);
      case "favourite":
        return favouritePageStack.value.at(-1);
      case "more":
        return morePageStack.value.at(-1);
      case "email-confirmation":
        return emailConfirmationPageStack.value.at(-1);
      default:
        return undefined;
    }
  }

  function hasStackValue() {
    return getCurrentStackValue() !== undefined;
  }

  return {
    homePageStack,
    businessPageStack,
    communityPageStack,
    favouritePageStack,
    morePageStack,
    emailConfirmationPageStack,
    dialogStackPop,
    dialogStackPush,
    dialogStackReset,
    getCurrentStackValue,
    hasStackValue
  };
});