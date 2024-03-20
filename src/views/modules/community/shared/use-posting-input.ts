import axios from "axios";

// Interface files
import { Posting } from "@/interfaces/models/entities/posting";
import { PostingImages } from "@/interfaces/models/custom-models/gallery";
import { PostingImage } from "@/interfaces/models/entities/posting-image";

import i18n from "@/plugins/i18n/i18n";

// .ts files
import { BLOB_URL, PLACEHOLDER_THUMBNAIL, URL } from "@/constants";
import { useUserStore } from "@/stores/user";
import { useUtilities } from "@/composable/use-utilities";

const { notify, eventBus } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as Posting;
};

const { t } = i18n.global;

const [bannerPath, imagePath, iconPath] = [ref(), ref(), ref()];

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);
const toolTipCreate = ref("posting.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

const metaDescription = ref<string>("");

export function usePostingInput() {
  const postingInput = ref<Posting>(newInput());
  const postingImages = ref<PostingImages>({} as PostingImages);

  function setPostingInput(val: Posting) {
    postingInput.value.postingId = val.postingId;
    postingInput.value.postingName = val.postingName;
    postingInput.value.buttonText = val.buttonText;
    postingInput.value.title = val.title;
    postingInput.value.subtitle1 = val.subtitle1;
    postingInput.value.subtitle2 = val.subtitle2;
    postingInput.value.subtitle3 = val.subtitle3;
    postingInput.value.displayMask = val.displayMask;
    postingInput.value.description = val.description;
    postingInput.value.directoryId = val.directoryId;
    postingInput.value.imagePath = val.imagePath;
    postingInput.value.iconPath = val.iconPath;
    postingInput.value.bannerPath = val.bannerPath;
    postingInput.value.hashKey = val.hashKey;
    postingInput.value.latitude = val.latitude;
    postingInput.value.longitude = val.longitude;
    postingInput.value.status = val.status;
    postingInput.value.createdAt = val.createdAt;
    postingInput.value.createdBy = val.createdBy;
    postingInput.value.modifiedAt = val.modifiedAt;
    postingInput.value.modifiedBy = val.modifiedBy;
    postingInput.value.meta = val.meta;
    postingInput.value.rank = val.rank;
    postingInput.value.contactWhatsApp = val.contactWhatsApp;
    postingInput.value.contactPhone = val.contactPhone;
    postingInput.value.contactOther = val.contactOther;
  }
  function setValidateInput(val: any) {
    postingInput.value.postingName = val.postingName;
    postingInput.value.buttonText = val.buttonText;
    postingInput.value.title = val.title;
    postingInput.value.subtitle1 = val.subtitle1;
    postingInput.value.subtitle2 = val.subtitle2;
    postingInput.value.subtitle3 = val.subtitle3;
    postingInput.value.displayMask = val.displayMask;
    postingInput.value.description = val.description;
    postingInput.value.directoryId = val.directoryId;
    postingInput.value.imagePath = val.imagePath;
    postingInput.value.iconPath = val.iconPath;
    postingInput.value.bannerPath = val.bannerPath;
    postingInput.value.hashKey = val.hashKey;
    postingInput.value.latitude = val.latitude;
    postingInput.value.longitude = val.longitude;
    postingInput.value.status = val.status;
    postingInput.value.createdAt = val.createdAt;
    postingInput.value.createdBy = val.createdBy;
    postingInput.value.modifiedAt = val.modifiedAt;
    postingInput.value.modifiedBy = val.modifiedBy;
    postingInput.value.meta = val.meta;
    postingInput.value.rank = val.rank;
    postingInput.value.contactWhatsApp = val.contactWhatsApp;
    postingInput.value.contactPhone = val.contactPhone;
    postingInput.value.contactOther = val.contactOther;
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    // loading.value = false;
  }

  function loadDescription() {
    axios
      .get(`/Posting/${postingInput.value.postingId}`)
      .then(response => {
        const data = response.data;
        locale.value = "en";
        metaDescription.value = data.description;
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function updatePosting() {
    postingInput.value.bannerPath = postingInput.value.iconPath = postingInput.value.imagePath = "";

    postingInput.value.modifiedBy = parseInt(userStore.userId);
    axios
      .put(`/Posting/${postingInput.value.postingId}`, postingInput.value)
      .then(async () => {
        getPostingsByDirectoryId();

        const successMessage = t("posting.message.updated");

        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function createPosting() {
    postingInput.value.bannerPath = postingInput.value.iconPath = postingInput.value.imagePath = "";

    postingInput.value.createdBy = parseInt(userStore.userId);
    postingInput.value.memberId = parseInt(userStore.userId);

    const requestData = postingInput.value;

    requestData.status = 1;
    axios
      .post(`/Posting`, requestData)
      .then(async response => {
        // assign postingId value back to postingInput
        const postingId = response.data.postingId;
        postingInput.value.postingId = postingId;
        await uploadImages();
        getPostingsByDirectoryId();
        const successMessage = t("posting.message.created");
        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  const getPostingsByDirectoryId = async () => {
    const directoryListUrl = `${URL.DIRECTORY_LIST.POSTING}/${postingInput.value.directoryId}`;

    try {
      const response = await axios.get(directoryListUrl);
      if (response.status === 200) {
        const directoryItems = response.data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        eventBus.emit("ItemListUpdate", directoryItems);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  async function uploadImages() {
    const images = [];
    if (postingImages?.value?.galleryImages == null || postingImages.value.galleryImages.length < 1)
      return;

    for (const [index, gImage] of postingImages.value.galleryImages.entries()) {
      if (gImage.image != null)
        images.push({ index: index, ranking: index + 1, image: gImage.image });
    }

    const promises = images.map((i: any) => uploadImage(i.index, i.ranking, i.image));

    Promise.all(promises).catch(errors => {
      notify(errors.message, "negative");
    });

    Promise.all(promises).catch(errors => {
      notify(errors.message, "negative");
    });
  }

  async function uploadImage(imageIndex: number = 1, ranking: number, imageFile: any) {
    const formData = new FormData();
    formData.append("image", imageFile);

    await axios
      .post(`/PostingImage/${postingInput.value.postingId}`, formData, {
        params: { ranking: ranking, createdBy: 0 },
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        postingImages.value.galleryImages[imageIndex].imageId = response.data.imageId;
        eventBus.emit("on-gallery-image-updates");
        // onRefresh();
      })
      .catch(() => {});
  }

  function deleteImage(id: number) {
    const url = `/PostingImage/${id}`;
    // loading.value = true;
    axios.delete(url).then(
      () => {
        const successMessage = t("posting.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        // loading.value = false;
      }
    );
  }

  function loadGalleryImages() {
    const postingId = postingInput.value.postingId;
    const url = `/PostingImage/GalleryImages/${postingId}`;

    axios.get(url).then(response => {
      const rec = response.data as Array<PostingImage>;

      const gImages = rec.slice(0, 9).sort(function (x, y) {
        return x.ranking - y.ranking;
      });

      postingImages.value.galleryImages = [];

      for (const [index, gImage] of gImages.entries()) {
        postingImages.value.galleryImages.push({
          imageId: gImage.imageId,
          index: index + 2,
          imagePath: getImageURL(gImage.imagePath),
          isAddCard: false
        });
      }
      postingImages.value.galleryImages.push({
        index: 1,
        imagePath: "",
        isAddCard: true
      });
    });
  }

  function updateRanking() {
    const list = [];
    for (const [index, image] of postingImages.value.galleryImages.entries()) {
      if (image.imageId != null) list.push({ ranking: index + 1, imageId: image.imageId });
    }
    const rankingDto = {
      rankingData: list
    };

    axios
      .post(`/PostingImage/UpdateRanking`, rankingDto)
      .then(() => {
        eventBus.emit("on-gallery-image-updates");
        // onRefresh();
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function getImageURL(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  return {
    postingInput,
    createPosting,
    updatePosting,
    uploadImage,
    deleteImage,
    updateRanking,
    bannerPath,
    iconPath,
    imagePath,

    bannerRef,
    iconRef,
    imageRef,

    toolTipCreate,

    locale,
    lang,
    usePostingInput,
    metaDescription,
    loadDescription,
    postingImages,
    loadGalleryImages,
    setValidateInput,
    setPostingInput
  };
}
