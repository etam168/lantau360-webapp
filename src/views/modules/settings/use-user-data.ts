import { ref, Ref } from "vue";
import { StaffInput } from "@/interfaces/input/staff-input";
import { useUserStore } from "@/stores/user";
import { BASE_URL } from "@/constants";
import axios, { AxiosError } from "axios";
import { useUtilities } from "@/composable/use-utilities";
import { Content } from "@/interfaces/content";

const { notify } = useUtilities();

const error = ref<string | null>(null);

const staffInput: Ref<StaffInput> = ref({} as StaffInput);
const contentInput: Ref<Content> = ref({} as Content);

function resetUser(): void {
  staffInput.value = {} as StaffInput;
}

export function useUserData() {
  const userStore = useUserStore();
  const userId = ref(userStore.userId);
  const STAFF_URL = `/Staff/${userId.value}`;

  async function handleUpdateAvatar(newAvatar: any) {
    const url = `${BASE_URL}/Staff/Image/${staffInput.value.staffId}`;

    const formData = new FormData();
    formData.append("image", newAvatar);

    await axios
      .put(url, formData, {
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

  function handleUpdateLanguage(newLocale: any) {
    // Check if user.value exists
    if (staffInput.value) {
      // Initialize user.value.meta if it doesn't exist
      staffInput.value.meta = staffInput.value.meta || {};

      // Save the original image value
      const originalLang = staffInput.value.meta.lang;

      // Update the image with the new avatar
      staffInput.value.meta.lang = newLocale;

      axios
        .put(STAFF_URL, staffInput.value)
        .then(() => {
          //
        })
        .catch(err => {
          // Restore the original image value if the Axios call fails
          staffInput.value.meta = { ...staffInput.value.meta, lang: originalLang };

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
  }

  async function updatePassword(password: string, oldPassword: string): Promise<boolean> {
    return await axios
      .put(
        `/StaffAuth/ResetPassword/${userStore.user}?password=${password}&oldPassword=${oldPassword}`
      )
      .then(() => {
        notify("Password udpate successfully", "positive");
        return true;
      })
      .catch(() => {
        notify("Password udpate failed", "negative");
        return false;
      });
  }

  return {
    handleUpdateAvatar,
    handleUpdateLanguage,

    staffInput,
    contentInput,
    resetUser,
    STAFF_URL,
    updatePassword
  };
}
