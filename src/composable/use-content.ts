import { Content } from "@/interfaces/models/entities/content";
import { useUserStore } from "@/stores/user";
import { BASE_URL } from "@/constants";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Content;
};

const error = ref<string | null>(null);

export function useContentInput() {
  const contentInput = ref<Content>(newInput());

  function setContentInput(val: Content) {
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
    contentInput,
    loadContentData,
    updateContent,
    setContentInput,
    handleUpdateMemberAvatar
  };
}
