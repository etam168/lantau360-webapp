import axios from "axios";
import { ref } from "vue";
import { SiteInput } from "@/interfaces/input/site-input";

import i18n from "@/plugins/i18n/i18n";
import { onRefresh, loading } from "../use-table-options";
import { useUserStore } from "@/stores/user";

import { useUtilities } from "@/composable/use-utilities";
import { SiteImages } from "@/interfaces/models/gallery";
import { SiteImage } from "@/interfaces/models/entities/siteImage";
import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
import { SiteDatatable } from "@/interfaces/datatable/site-datatable";
import eventBus from "@/utils/event-bus";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as SiteInput;
};

const { t } = i18n.global;

const [bannerPath, imagePath, iconPath] = [ref(), ref(), ref()];

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);
const toolTipCreate = ref("site.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

const metaDescription = ref<string>("");

export function useSiteInput() {
  const siteInput = ref<SiteInput>(newInput());
  const siteImages = ref<SiteImages>({} as SiteImages);
  const siteDescription = ref({ enDescription: "", hkDescription: "", cnDescription: "" });

  function setSiteInput(val: SiteDatatable) {
    //siteInput.value = extend(true, {}, val);

    siteInput.value.siteId = val.siteId;
    siteInput.value.siteName = val.siteName;
    siteInput.value.buttonText = val.buttonText;
    siteInput.value.title = val.title;
    siteInput.value.subtitle1 = val.subtitle1;
    siteInput.value.subtitle2 = val.subtitle2;
    siteInput.value.subtitle3 = val.subtitle3;
    siteInput.value.displayMask = val.displayMask;
    siteInput.value.description = val.description;
    siteInput.value.directoryId = val.directoryId;
    siteInput.value.imagePath = val.imagePath;
    siteInput.value.iconPath = val.iconPath;
    siteInput.value.bannerPath = val.bannerPath;
    siteInput.value.hashKey = val.hashKey;
    siteInput.value.latitude = val.latitude;
    siteInput.value.longitude = val.longitude;
    siteInput.value.status = val.status;
    siteInput.value.createdAt = val.createdAt;
    siteInput.value.createdBy = val.createdBy;
    siteInput.value.modifiedAt = val.modifiedAt;
    siteInput.value.modifiedBy = val.modifiedBy;
    siteInput.value.meta = val.meta;

    siteInput.value.contactWhatsApp = val.contactWhatsApp;
    siteInput.value.contactPhone = val.contactPhone;
    siteInput.value.contactOther = val.contactOther;

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  function setValidateInput(values: any, description: any) {
    siteInput.value.description = description.enDescription;
    siteInput.value.siteName = values.siteName;
    siteInput.value.contactWhatsApp = values.contactWhatsApp;
    siteInput.value.contactPhone = values.contactPhone;
    siteInput.value.contactOther = values.contactOther;

    siteInput.value.buttonText = values.buttonText;

    siteInput.value.title = values.title;
    siteInput.value.subtitle1 = values.subtitle1;
    siteInput.value.subtitle2 = values.subtitle2;
    siteInput.value.subtitle3 = values.subtitle3;
    siteInput.value.displayMask = values.displayMask;

    // siteInput.value.description = values.description;
    siteInput.value.directoryId = values.directoryId;
    siteInput.value.latitude = values.latitude;
    siteInput.value.longitude = values.longitude;

    siteInput.value.status = values.status;

    siteInput.value.meta ??= {};
    siteInput.value.meta.i18n ??= {};

    siteInput.value.meta.i18n["hk"] ??= {};
    siteInput.value.meta.i18n["cn"] ??= {};
    siteInput.value.meta.i18n["hk"]["siteName"] = values.siteNameHk;
    siteInput.value.meta.i18n["cn"]["siteName"] = values.siteNameCn;

    siteInput.value.meta.i18n["hk"]["title"] = values.titleHk;
    siteInput.value.meta.i18n["cn"]["title"] = values.titleCn;

    siteInput.value.meta.i18n["hk"]["address"] = values.addressHk;
    siteInput.value.meta.i18n["cn"]["address"] = values.addressCn;

    siteInput.value.meta.i18n["hk"]["description"] = siteDescription.value.hkDescription;
    siteInput.value.meta.i18n["cn"]["description"] = siteDescription.value.cnDescription;
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  function loadDescription() {
    axios
      .get(`/Site/${siteInput.value.siteId}`)
      .then(response => {
        const data = response.data;
        locale.value = "en";
        metaDescription.value = data.description;
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function updateSite() {
    siteInput.value.bannerPath = siteInput.value.iconPath = siteInput.value.imagePath = "";

    siteInput.value.modifiedBy = parseInt(userStore.userId);

    axios
      .put(`/Site/${siteInput.value.siteId}`, siteInput.value)
      .then(async () => {
        onRefresh();

        const successMessage = t("site.message.updated");

        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function createSite() {
    siteInput.value.bannerPath = siteInput.value.iconPath = siteInput.value.imagePath = "";

    siteInput.value.createdBy = parseInt(userStore.userId);

    const requestData = siteInput.value;

    requestData.status = 1;
    axios
      .post(`/Site`, requestData)
      .then(async response => {
        // assign siteId value back to siteInput
        const siteId = response.data.siteId;
        siteInput.value.siteId = siteId;
        await uploadImages();
        const successMessage = t("site.message.updated");
        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  async function uploadImages() {
    const images = [];

    for (const [index, gImage] of siteImages.value.galleryImages.entries()) {
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
      .post(`/SiteImage/${siteInput.value.siteId}`, formData, {
        params: { ranking: ranking, createdBy: 0 },
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        debugger;
        siteImages.value.galleryImages[imageIndex].imageId = response.data.imageId;
        eventBus.emit("on-gallery-image-updates");
        onRefresh();
      })
      .catch(() => {
        alert("updload failed");
      });
  }

  function deleteImage(id: number) {
    const url = `/SiteImage/${id}`;
    loading.value = true;
    axios.delete(url).then(
      () => {
        updateRanking();
        const successMessage = t("site.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        loading.value = false;
      }
    );
  }

  function deleteGalleryImage(id: number, ranking: number) {
    const url = `/SiteImage/DeleteBySiteIdAndRanking?siteId=${id}&ranking=${ranking}`;
    loading.value = true;
    axios.delete(url).then(
      () => {
        onRefresh();
        const successMessage = t("site.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        loading.value = false;
      }
    );

    if (ranking === 1) {
      siteInput.value.bannerPath = "";
      bannerPath.value = "";
    } else if (ranking == 2) {
      siteInput.value.iconPath = "";
      iconPath.value = null;
    } else if (ranking === 3) {
      siteInput.value.imagePath = "";
      imagePath.value = "";
    }
  }

  function loadGalleryImages() {
    const siteId = siteInput.value.siteId;
    const url = `/SiteImage/GalleryImages/${siteId}`;

    axios.get(url).then(response => {
      const rec = response.data as Array<SiteImage>;

      const gImages = rec.slice(0, 9).sort(function (x, y) {
        return x.ranking - y.ranking;
      });

      siteImages.value.galleryImages = [];

      for (const [index, gImage] of gImages.entries()) {
        siteImages.value.galleryImages.push({
          imageId: gImage.imageId,
          index: index + 2,
          imagePath: getImageURL(gImage.imagePath),
          isAddCard: false
        });
      }
      siteImages.value.galleryImages.push({
        index: 1,
        imagePath: "",
        isAddCard: true
      });
    });
  }

  function updateRanking() {
    const list = [];
    for (const [index, image] of siteImages.value.galleryImages.entries()) {
      if (image.imageId != null) list.push({ ranking: index + 1, imageId: image.imageId });
    }
    const rankingDto = {
      rankingData: list
    };
    debugger;
    axios
      .post(`/SiteImage/UpdateRanking`, rankingDto)
      .then(() => {
        // eventBus.emit("on-gallery-image-updates");
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function getImageURL(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  return {
    siteInput,
    createSite,
    updateSite,
    uploadImage,
    deleteImage,
    deleteGalleryImage,
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
    useSiteInput,
    metaDescription,
    loadDescription,
    siteImages,
    loadGalleryImages,
    setValidateInput,
    setSiteInput,
    siteDescription
  };
}
