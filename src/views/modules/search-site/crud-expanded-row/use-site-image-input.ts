import { ref } from "vue";

import { SiteImage } from "@/interfaces/siteImage";
import { useUtilities } from "@/composable/use-utilities";
import axios from "axios";
import { onRefresh, loading } from "../use-table-options";

const { notify } = useUtilities();

const newInput = () =>
  ({
    modifiedAt: new Date()
  }) as SiteImage;

const siteInput = ref<SiteImage>(newInput());

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

export default function useSiteInput() {
  function resetSiteInput(val: SiteImage) {
    Object.assign(siteInput.value, val);

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  function updateSite(data: SiteImage) {
    const headers = {
      "Content-Type": "multipart/form-data"
    };

    const updateSiteUrl = `/Site/${data.siteId}`;
    const updateImageUrl = `/SiteImage/${data.siteId}`;

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

    requestList.push(axios.put(updateSiteUrl, data));

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
    const url = `/SiteImage/DeleteBySiteIdAndRanking?siteId=${siteInput.value.siteId}&ranking=${ranking}`;
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
      // siteInput.value.bannerPath = null;
      bannerPath.value = null;
    } else if (ranking == 3) {
      siteInput.value.imagePath = null;
      imagePath.value = null;
    }
  }

  return {
    siteInput,
    updateSite,
    deleteImage,
    bannerPath,
    imagePath,
    iconPath,

    bannerRef,
    iconRef,

    locale,
    toolbar,
    resetSiteInput
  };
}
