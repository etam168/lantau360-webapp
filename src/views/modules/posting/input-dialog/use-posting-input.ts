import { ref } from "vue";

import { extend } from "quasar";
import { Posting } from "@/interfaces/posting";
import axios from "axios";
import i18n from "@/plugins/i18n/i18n";
import { onRefresh, loading } from "../use-table-options";
import { useUtilities } from "@/composable/use-utilities";

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Posting;
};

const { notify } = useUtilities();

const postingInput = ref<Posting>(newInput());
const { t } = i18n.global;

const [bannerPath, imagePath, iconPath] = [ref(), ref(), ref()];

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);
const toolTipCreate = ref("posting.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

export default function usePostingInput() {
  function resetPostingInput(val: Posting) {
    postingInput.value = extend(true, {}, val);

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  function uploadbannerPath() {
    if (bannerPath.value) {
      postingInput.value.bannerPath = window.URL.createObjectURL(bannerPath.value);
    }
  }

  function uploadIconPath() {
    if (iconPath.value && iconPath.value.size <= 300 * 300) {
      postingInput.value.iconPath = window.URL.createObjectURL(iconPath.value);
    } else {
      const message = `The Icon size should be less than or equal to 300 x 300 pixels`;
      notify(message, "negative");
    }
  }

  function uploadImagePath() {
    if (imagePath.value && imagePath.value.size <= 1600 * 900) {
      postingInput.value.imagePath = window.URL.createObjectURL(imagePath.value);
    } else {
      const message = `The Icon size should be less than or equal to 1600 x 900 pixels`;
      notify(message, "negative");
    }
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  function updatePosting(onDialogCancel: () => void) {
    const images = [
      postingInput.value.bannerPath,
      postingInput.value.iconPath,
      postingInput.value.imagePath
    ];

    const postingId = postingInput.value.postingId;
    saveImages(postingId, images, onDialogCancel);
    postingInput.value.bannerPath = postingInput.value.iconPath = postingInput.value.imagePath = "";

    // Update posting record
    axios
      .put(`/Posting/${postingInput.value.postingId}`, postingInput.value)
      .then(() => {
        onRefresh();
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function createPosting(onDialogCancel: () => void) {
    const images = [
      postingInput.value.bannerPath,
      postingInput.value.iconPath,
      postingInput.value.imagePath
    ];

    postingInput.value.postingId = 0;
    postingInput.value.bannerPath = postingInput.value.iconPath = postingInput.value.imagePath = "";

    // Create a new posting record
    axios
      .post(`/Posting`, postingInput.value)
      .then(response => {
        // assign postingId value back to postingInput
        const postingId = response.data.postingId;
        postingInput.value.postingId = postingId;

        // save images also
        saveImages(postingId, images, onDialogCancel);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function saveImages(postingId: number, images: any[], onDialogCancel: () => void) {
    const promises = images
      .map((val, index) => ({ path: val, ranking: index + 1 }))
      .filter(v => v.path != null)
      .map(i => upsertImage(postingId, i.path, i.ranking));

    Promise.all(promises)
      .catch(errors => {
        notify(errors.message, "negative");
      })
      .finally(() => {
        onRefresh();

        const successMessage = t("posting.message.updated");
        successCallback(successMessage);

        setTimeout(() => {
          onDialogCancel();
        }, 1200);
      });
  }

  function upsertImage(postingId: number, imagePath: any, ranking: number) {
    const PostingImageUrl = `/PostingImage/${postingId}`;

    const formData = new FormData();
    formData.append("image", imagePath);
    return axios
      .post(PostingImageUrl, formData, {
        params: { ranking: ranking, createdBy: 0 },
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => response.data);
  }

  // function updatePosting(onDialogCancel) {
  //   const headers = {
  //     "Content-Type": "multipart/form-data"
  //   };
  //   const updatePostingUrl = `/Posting/${postingInput.value.postingId}`;
  //   const updateImageUrl = `/PostingImage/${postingInput.value.postingId}`;

  //   const requestList = [];

  //   const array = [
  //     { path: "bannerPath", ranking: 1 },
  //     { path: "iconPath", ranking: 2 },
  //     { path: "imagePath", ranking: 3 }
  //   ];

  //   array.forEach(function (item) {
  //     if (postingInput.value[item.path] != null) {
  //       const formData = new FormData();
  //       formData.append("image", postingInput.value[item.path]);
  //       const params = {
  //         ranking: item.ranking,
  //         createdBy: 0
  //       };
  //       const request = axios.post(updateImageUrl, formData, {
  //         params: params,
  //         headers: headers
  //       });
  //       console.log("request", request), requestList.push(request);
  //       postingInput.value[item.path] = null;
  //     }
  //   });

  //   requestList.push(axios.put(updatePostingUrl, postingInput.value));
  //   loading.value = true;

  //   axios
  //     .all(requestList)
  //     .then(
  //       axios.spread(() => {
  //         //console.log(responses);
  //         onRefresh();
  //         const successMessage = t("posting.message.updated");
  //         successCallback(successMessage);
  //         setTimeout(() => {
  //           onDialogCancel();
  //         }, 1200);
  //       })
  //     )
  //     .catch(errors => {
  //       notify(errors.message, "negative");
  //       loading.value = false;
  //     });
  // }

  async function deleteImage(ranking: any) {
    const url = `/PostingImage/DeleteByPostingIdAndRanking?postingId=${postingInput.value.postingId}&ranking=${ranking}`;
    loading.value = true;
    await axios.delete(url).then(
      () => {
        onRefresh();
        const successMessage = t("posting.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        loading.value = false;
      }
    );

    if (ranking == 1) {
      postingInput.value.bannerPath = "";
      bannerPath.value = null;
    } else if (ranking == 2) {
      postingInput.value.iconPath = "";
      iconPath.value = null;
    } else if (ranking == 3) {
      postingInput.value.imagePath = "";
      imagePath.value = null;
    }
  }

  return {
    postingInput,
    createPosting,
    updatePosting,
    deleteImage,

    bannerPath,
    iconPath,
    imagePath,

    bannerRef,
    iconRef,
    imageRef,

    toolTipCreate,

    uploadbannerPath,
    uploadIconPath,
    uploadImagePath,

    locale,
    lang,
    resetPostingInput
  };
}
