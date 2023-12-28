import axios from "axios";
import { ref } from "vue";
import { Posting } from "@/interfaces/models/entities/posting";

import i18n from "@/plugins/i18n/i18n";
import { useUserStore } from "@/stores/user";

import { useUtilities } from "@/composable/use-utilities";
import { PostingImages } from "@/interfaces/models/gallery";
import { PostingImage } from "@/interfaces/models/entities/posting-image";
import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
import eventBus from "@/utils/event-bus";
import { Description } from "@/interfaces/models/description";

const { notify } = useUtilities();
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

  // function setPostingInput(val: PostingDatatable) {
  //   //postingInput.value = extend(true, {}, val);

  //   postingInput.value.postingId = val.postingId;
  //   postingInput.value.postingName = val.postingName;
  //   postingInput.value.buttonText = val.buttonText;
  //   postingInput.value.title = val.title;
  //   postingInput.value.subtitle1 = val.subtitle1;
  //   postingInput.value.subtitle2 = val.subtitle2;
  //   postingInput.value.subtitle3 = val.subtitle3;
  //   postingInput.value.displayMask = val.displayMask;
  //   postingInput.value.description = val.description;
  //   postingInput.value.directoryId = val.directoryId;
  //   postingInput.value.imagePath = val.imagePath;
  //   postingInput.value.iconPath = val.iconPath;
  //   postingInput.value.bannerPath = val.bannerPath;
  //   postingInput.value.hashKey = val.hashKey;
  //   postingInput.value.latitude = val.latitude;
  //   postingInput.value.longitude = val.longitude;
  //   postingInput.value.status = val.status;
  //   postingInput.value.createdAt = val.createdAt;
  //   postingInput.value.createdBy = val.createdBy;
  //   postingInput.value.modifiedAt = val.modifiedAt;
  //   postingInput.value.modifiedBy = val.modifiedBy;
  //   postingInput.value.meta = val.meta;
  //   postingInput.value.rank = val.rank;
  //   postingInput.value.contactWhatsApp = val.contactWhatsApp;
  //   postingInput.value.contactPhone = val.contactPhone;
  //   postingInput.value.contactOther = val.contactOther;

  //   bannerPath.value = null;
  //   imagePath.value = null;
  //   iconPath.value = null;
  // }

  function setValidateInput(values: any, description: Description) {
    postingInput.value.postingName = values.postingName;
    postingInput.value.contactWhatsApp = values.contactWhatsApp;
    postingInput.value.contactPhone = values.contactPhone;
    postingInput.value.contactOther = values.contactOther;
    postingInput.value.rank = values.rank;
    postingInput.value.buttonText = values.buttonText;

    postingInput.value.title = values.title;
    postingInput.value.subtitle1 = values.subtitle1;
    postingInput.value.subtitle2 = values.subtitle2;
    postingInput.value.subtitle3 = values.subtitle3;
    postingInput.value.displayMask = values.displayMask;
    // postingInput.value.description = values.description;
    postingInput.value.directoryId = values.directoryId;
    postingInput.value.latitude = values.latitude;
    postingInput.value.longitude = values.longitude;

    postingInput.value.status = values.status;

    postingInput.value.meta ??= {};
    postingInput.value.meta.i18n ??= {};

    postingInput.value.meta.i18n["hk"] ??= {};
    postingInput.value.meta.i18n["cn"] ??= {};
    postingInput.value.meta.i18n["hk"]["postingName"] = values.postingNameHk;
    postingInput.value.meta.i18n["cn"]["postingName"] = values.postingNameCn;

    postingInput.value.meta.i18n["hk"]["title"] = values.titleHk;
    postingInput.value.meta.i18n["cn"]["title"] = values.titleCn;

    postingInput.value.meta.i18n["hk"]["subtitle1"] = values.subtitle1Hk;
    postingInput.value.meta.i18n["cn"]["subtitle1"] = values.subtitle1Cn;

    postingInput.value.description = description.enDescription;
    postingInput.value.meta.i18n["hk"]["description"] = description?.hkDescription ?? "";
    postingInput.value.meta.i18n["cn"]["description"] = description?.cnDescription ?? "";
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
        // onRefresh();

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

    const requestData = postingInput.value;

    requestData.status = 1;
    axios
      .post(`/Posting`, requestData)
      .then(async response => {
        // assign postingId value back to postingInput
        const postingId = response.data.postingId;
        postingInput.value.postingId = postingId;
        await uploadImages();
        const successMessage = t("posting.message.updated");
        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  async function uploadImages() {
    const images = [];

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
    setValidateInput
    // setPostingInput
  };
}
