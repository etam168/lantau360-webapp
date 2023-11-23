import { ref } from "vue";

import { BusinessImage } from "@/interfaces/businessImage";
import { notify } from "@/utils/notify";
import axios from "axios";
import { onRefresh, loading } from "../use-table-options";

const newInput = () =>
  ({
    modifiedAt: new Date()
  }) as BusinessImage;

const businessInput = ref<BusinessImage>(newInput());

const bannerPath = ref(null);
const imagePath = ref(null);
const iconPath = ref(null);

const bannerRef = ref(null);
const iconRef = ref(null);

const locale = ref("hk");

const toolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }]
];

export default function useBusinessInput() {
  function resetBusinessInput(val: BusinessImage) {
    Object.assign(businessInput.value, val);

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  function updateBusiness(data: BusinessImage) {
    const headers = {
      "Content-Type": "multipart/form-data"
    };

    const updateBusinessUrl = `/Business/${data.businessId}`;
    const updateImageUrl = `/BusinessImage/${data.businessId}`;

    const requestList = [];

    const array = [
      { path: "bannerPath", ranking: 1 },
      { path: "iconPath", ranking: 2 },
      { path: "imagePath", ranking: 3 }
    ];
    array.forEach(function (item) {
      if (data[item.path] != null) {
        const formData = new FormData();
        formData.append("image", data[item.path]);
        const params = {
          ranking: item.ranking,
          createdBy: 0
        };
        const request = axios.post(updateImageUrl, formData, {
          params: params,
          headers: headers
        });

        requestList.push(request);
        data[item.path] = null;
      }
    });

    requestList.push(axios.put(updateBusinessUrl, data));

    loading.value = true;
    axios
      .all(requestList)
      .then(
        axios.spread((...responses) => {
          console.log(responses);
          onRefresh();
          loading.value = false;
        })
      )
      .catch(errors => {
        notify(errors.message, "negative");
        loading.value = false;
      });
  }
  async function deleteImage(ranking: number) {
    const url = `/BusinessImage/DeleteByBusinessIdAndRanking?businessId=${businessInput.value.businessId}&ranking=${ranking}`;
    loading.value = true;
    await axios.delete(url).then(
      response => {
        console.log(response);
        onRefresh();
        loading.value = false;
      },
      error => {
        console.log(error);
        notify(error.message, "negative");
        loading.value = false;
      }
    );

    if (ranking == 1) {
      // businessInput.value.bannerPath = null;
      bannerPath.value = null;
    } else if (ranking == 3) {
      businessInput.value.imagePath = null;
      imagePath.value = null;
    }
  }

  return {
    businessInput,
    updateBusiness,
    deleteImage,
    bannerPath,
    imagePath,
    iconPath,

    bannerRef,
    iconRef,

    locale,
    toolbar,
    resetBusinessInput
  };
}
