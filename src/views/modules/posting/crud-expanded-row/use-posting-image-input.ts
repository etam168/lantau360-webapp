import { ref } from "vue";
import { PostingImage } from "@/interfaces/postingImage";
import { notify } from "@/utils/notify";
import axios from "axios";

import { onRefresh, loading } from "../use-table-options";

const newInput = () =>
  ({
    modifiedAt: new Date()
  }) as PostingImage;

const postingInput = ref<PostingImage>(newInput());

const bannerPath = ref(null);
const imagePath = ref(null);
const iconPath = ref(null);

const bannerRef = ref(null);
const iconRef = ref(null);
const imageRef = ref(null);

const locale = ref("hk");

export default function usePostingInput() {
  function resetPostingInput(val: PostingImage) {
    Object.assign(postingInput.value, val);

    bannerPath.value = null;
    imagePath.value = null;
    iconPath.value = null;
  }

  function updatePosting(data: PostingImage) {
    const headers = {
      "Content-Type": "multipart/form-data"
    };

    const updatePostingUrl = `/Posting/${data.postingId}`;
    const updateImageUrl = `/PostingImage/${postingInput.value.postingId}`;

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

    requestList.push(axios.put(updatePostingUrl, data));

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

  function deleteImage(ranking: number) {
    const url = `/PostingImage/DeleteByPostingIdAndRanking?postingId=${postingInput.value.postingId}&ranking=${ranking}`;
    loading.value = true;
    axios.delete(url).then(
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
      // postingInput.value.bannerPath = null;
      bannerPath.value = null;
    } else if (ranking == 3) {
      postingInput.value.imagePath = null;
      imagePath.value = null;
    }
  }

  return {
    postingInput,
    bannerPath,
    imagePath,
    iconPath,
    locale,
    resetPostingInput,
    toolbar,
    iconRef,
    imageRef,
    bannerRef,
    updatePosting,
    deleteImage
  };
}
