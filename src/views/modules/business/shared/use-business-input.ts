import axios from "axios";
import { ref } from "vue";
import { BusinessInput } from "@/interfaces/input/business-input";

import i18n from "@/plugins/i18n/i18n";
import { onRefresh, loading } from "../use-table-options";
import { useUserStore } from "@/stores/user";
import eventBus from "@/utils/event-bus";

import { useUtilities } from "@/composable/use-utilities";
import { BusinessImages } from "@/interfaces/models/gallery";
import { BusinessImage } from "@/interfaces/models/entities/businessImage";
import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
import { BusinessDatatable } from "@/interfaces/datatable/business-datatable";

const { notify } = useUtilities();
const userStore = useUserStore();

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as BusinessInput;
};

const { t } = i18n.global;

const [bannerPath, imagePath, iconPath] = [ref(), ref(), ref()];

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);
const toolTipCreate = ref("business.gallery.uploadNewImage");

const locale = ref("hk");
const lang = ref("hk");

const metaDescription = ref<string>("");

export function useBusinessInput() {
  const businessInput = ref<BusinessInput>(newInput());
  const businessImages = ref<BusinessImages>({} as BusinessImages);
  const businessDescritiion = ref({ enDescription: "", hkDescription: "", cnDescription: "" });

  //Assign values from rowdata (Initial Value)
  function setBusinessInput(val: BusinessDatatable) {
    //businessInput.value = extend(true, {}, val);

    businessInput.value.businessId = val.businessId;
    businessInput.value.businessName = val.businessName;
    businessInput.value.buttonText = val.buttonText;
    businessInput.value.title = val.title;
    businessInput.value.subtitle1 = val.subtitle1;
    businessInput.value.subtitle2 = val.subtitle2;
    businessInput.value.subtitle3 = val.subtitle3;
    businessInput.value.displayMask = val.displayMask;
    businessInput.value.description = val.description;
    businessInput.value.directoryId = val.directoryId;
    businessInput.value.imagePath = val.imagePath;
    businessInput.value.iconPath = val.iconPath;
    businessInput.value.bannerPath = val.bannerPath;
    businessInput.value.hashKey = val.hashKey;
    businessInput.value.latitude = val.latitude;
    businessInput.value.longitude = val.longitude;
    businessInput.value.openTime = val.openTime;
    businessInput.value.closeTime = val.closeTime;
    businessInput.value.status = val.status;
    businessInput.value.createdAt = val.createdAt;
    businessInput.value.createdBy = val.createdBy;
    businessInput.value.modifiedAt = val.modifiedAt;
    businessInput.value.modifiedBy = val.modifiedBy;
    businessInput.value.meta = val.meta;

    businessInput.value.contactWhatsApp = val.contactWhatsApp;
    businessInput.value.contactPhone = val.contactPhone;
    businessInput.value.contactOther = val.contactOther;

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  //Assign values back from Form
  function setValidateInput(values: any, description: any) {
    businessInput.value.description = description.enDescription;

    businessInput.value.businessName = values.businessName;
    businessInput.value.contactWhatsApp = values.contactWhatsApp;
    businessInput.value.contactPhone = values.contactPhone;
    businessInput.value.contactOther = values.contactOther;

    businessInput.value.buttonText = values.buttonText;

    businessInput.value.title = values.title;
    businessInput.value.subtitle1 = values.subtitle1;
    businessInput.value.subtitle2 = values.subtitle2;
    businessInput.value.subtitle3 = values.subtitle3;
    businessInput.value.displayMask = values.displayMask;

    businessInput.value.directoryId = values.directoryId;
    businessInput.value.latitude = values.latitude;
    businessInput.value.longitude = values.longitude;

    businessInput.value.openTime = values.openTime;
    businessInput.value.closeTime = values.closeTime;

    businessInput.value.status = values.status;

    businessInput.value.meta ??= {};
    businessInput.value.meta.i18n ??= {};

    businessInput.value.meta.i18n["hk"] ??= {};
    businessInput.value.meta.i18n["cn"] ??= {};
    businessInput.value.meta.i18n["hk"]["businessName"] = values.businessNameHk;
    businessInput.value.meta.i18n["cn"]["businessName"] = values.businessNameCn;

    businessInput.value.meta.i18n["hk"]["title"] = values.titleHk;
    businessInput.value.meta.i18n["cn"]["title"] = values.titleCn;

    businessInput.value.meta.i18n["hk"]["address"] = values.addressHk;
    businessInput.value.meta.i18n["cn"]["address"] = values.addressCn;

    businessInput.value.meta.i18n["hk"]["description"] = businessDescritiion.value.hkDescription;
    businessInput.value.meta.i18n["cn"]["description"] = businessDescritiion.value.cnDescription;
    debugger;
  }

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  function loadDescription() {
    axios
      .get(`/Business/${businessInput.value.businessId}`)
      .then(response => {
        const data = response.data;
        locale.value = "en";
        metaDescription.value = data.description;
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function updateBusiness() {
    businessInput.value.bannerPath =
      businessInput.value.iconPath =
      businessInput.value.imagePath =
        "";
    businessInput.value.modifiedBy = parseInt(userStore.userId);
    axios
      .put(`/Business/${businessInput.value.businessId}`, businessInput.value)
      .then(async () => {
        onRefresh();

        const successMessage = t("Business.message.updated");

        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  function createBusiness() {
    console.log(businessImages);
    businessInput.value.bannerPath =
      businessInput.value.iconPath =
      businessInput.value.imagePath =
        "";

    businessInput.value.createdBy = parseInt(userStore.userId);

    const requestData = businessInput.value;

    requestData.status = 1;
    axios
      .post(`/Business`, requestData)
      .then(async response => {
        const businessId = response.data.businessId;
        businessInput.value.businessId = businessId;
        await uploadImages();
        const successMessage = t("business.message.updated");
        successCallback(successMessage);
      })
      .catch(errors => {
        notify(errors.message, "negative");
      });
  }

  async function uploadImages() {
    const images = [];

    for (const [index, gImage] of businessImages.value.galleryImages.entries()) {
      if (gImage.image != null)
        images.push({ index: index, ranking: index + 1, image: gImage.image });
    }
    debugger;

    const promises = images.map(i => uploadImage(i.index, i.ranking, i.image));

    Promise.all(promises).catch(errors => {
      notify(errors.message, "negative");
    });
  }

  async function uploadImage(imageIndex: number = 1, ranking: number, imageFile: any) {
    const formData = new FormData();
    formData.append("image", imageFile);

    await axios
      .post(`/BusinessImage/${businessInput.value.businessId}`, formData, {
        params: { ranking: ranking, createdBy: 0 },
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        debugger;
        businessImages.value.galleryImages[imageIndex].imageId = response.data.imageId;
        eventBus.emit("on-gallery-image-updates");
        onRefresh();
      })
      .catch(() => {
        alert("updload failed");
      });
  }

  function deleteImage(id: number) {
    const url = `/BusinessImage/${id}`;

    loading.value = true;
    axios.delete(url).then(
      () => {
        updateRanking();
        const successMessage = t("business.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        loading.value = false;
      }
    );
  }

  function deleteGalleryImage(id: number, ranking: number) {
    const url = `/BusinessImage/DeleteByBusinessIdAndRanking?businessId=${id}&ranking=${ranking}`;
    loading.value = true;
    axios.delete(url).then(
      () => {
        onRefresh();
        const successMessage = t("business.message.deleteImage");
        successCallback(successMessage);
      },
      error => {
        notify(error.message, "negative");
        loading.value = false;
      }
    );

    if (ranking === 1) {
      businessInput.value.bannerPath = "";
      bannerPath.value = "";
    } else if (ranking == 2) {
      businessInput.value.iconPath = "";
      iconPath.value = null;
    } else if (ranking === 3) {
      businessInput.value.imagePath = "";
      imagePath.value = "";
    }
  }

  function loadGalleryImages() {
    const businessId = businessInput.value.businessId;
    const url = `/BusinessImage/GalleryImages/${businessId}`;

    axios.get(url).then(response => {
      const rec = response.data as Array<BusinessImage>;
      const gImages = rec.slice(0, 9).sort(function (x, y) {
        return x.ranking - y.ranking;
      });

      businessImages.value.galleryImages = [];

      for (const [index, gImage] of gImages.entries()) {
        businessImages.value.galleryImages.push({
          imageId: gImage.imageId,
          index: index + 2,
          imagePath: getImageURL(gImage.imagePath),
          isAddCard: false
        });
      }
      businessImages.value.galleryImages.push({
        index: 1,
        imagePath: "",
        isAddCard: true
      });
    });
  }

  function updateRanking() {
    const list = [];
    for (const [index, image] of businessImages.value.galleryImages.entries()) {
      if (image.imageId != null) list.push({ ranking: index + 1, imageId: image.imageId });
    }
    const rankingDto = {
      BusinessId: businessInput.value.businessId,
      rankingData: list
    };
    debugger;
    axios
      .post(`/BusinessImage/UpdateRanking`, rankingDto)
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
    businessInput,
    createBusiness,
    updateBusiness,
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
    useBusinessInput,

    metaDescription,
    loadDescription,
    businessImages,
    loadGalleryImages,
    setValidateInput,
    setBusinessInput,
    businessDescritiion
  };
}
