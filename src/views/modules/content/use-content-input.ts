import { ref } from "vue";
import axios, { AxiosError } from "axios";
import { useUtilities } from "@/composable/use-utilities";
import { Content } from "@/interfaces/content";
import { useUserStore } from "@/stores/user";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Content;
};

export function useContentInput() {
  const contentInput = ref<Content>(newInput());

  function setContentInput(val: Content) {
    //contentInput.value = extend(true, {}, val);
    contentInput.value.contentId = val?.contentId;
    contentInput.value.contentName = val?.contentName;
    contentInput.value.contentData = val?.contentData;
    contentInput.value.createdBy = val?.createdBy;
    contentInput.value.createdAt = val?.createdAt;
    contentInput.value.modifiedBy = val?.modifiedBy;
    contentInput.value.modifiedAt = val?.modifiedAt;
    contentInput.value.meta = val?.meta;
  }

  const loading = ref(false);
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  async function loadContentData(queryParam: string) {
    try {
      const response = await axios.get<Content>(`/Content/ContentByName/${queryParam}`);
      contentInput.value = { ...response.data };
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          notify("Not found", "negative");
        } else {
          notify("An error occurred", "negative");
        }
      } else {
        notify("An unexpected error occurred", "negative");
      }
    }
  }

  async function updateContent(): Promise<boolean> {
    // Update Content record
    contentInput.value.modifiedBy = parseInt(userStore.userId);
    const url = `/Content/CreateOrUpdateContent/${encodeURIComponent(
      contentInput.value.contentName
    )}`;

    return axios
      .put(url, contentInput.value)
      .then(() => {
        const successMessage = "Submitted";
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
  return {
    contentInput,
    loadContentData,
    updateContent,
    setContentInput
  };
}
