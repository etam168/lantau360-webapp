<template>
  <q-btn v-bind="$attrs" outline round>
    <q-avatar size="128px">
      <q-img :src="imageSrc">
        <template v-slot:error>
          <img :src="PLACEHOLDER_AVATAR" />
        </template>

        <template v-slot:loading>
          <div class="absolute-full flex flex-center bg-gray text-white">
            <q-inner-loading showing class="spinner-card row justify-center items-center">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </div> </template
      ></q-img>

      <q-badge class="absolute-bottom-left" color="transparent">
        <app-button round color="black" icon="photo_camera" size="sm" @click="onImageUpload" />
      </q-badge>
    </q-avatar>

    <q-file
      ref="imageRef"
      accept="image/*"
      v-show="false"
      v-model="imagePath"
      @update:model-value="onUploadImage"
    >
    </q-file>
  </q-btn>
  <!-- <div class="text-subtitle1 text-weight-medium">Upload Staff Profile Image</div> -->
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useUtilities } from "@/composable/use-utilities";

  // .ts files
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";

  const { resizeImage } = useUtilities();
  const props = defineProps({
    label: {
      type: String,
      default: "Add Photos"
    },
    imgSource: {
      type: String,
      default: ""
    }
  });

  const imagePath = ref();
  const imageRef = ref();
  const imageSrc = ref<any>(getImageURL(props.imgSource));

  const emits = defineEmits(["uploadCallback"]);

  async function onUploadImage() {
    try {
      try {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
        try {
          if (imagePath.value.size > MAX_FILE_SIZE) {
            imagePath.value = await resizeImage(imagePath.value as File, 400);
          }

          imageSrc.value = URL.createObjectURL(imagePath.value);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }

      emits("uploadCallback", imagePath.value);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  function getImageURL(imagePath: string) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_AVATAR;
  }

  function onImageUpload() {
    imageRef.value.pickFiles();
  }
</script>

<style scoped>
  .center-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .q-img__content > div {
    position: initial !important;
  }
</style>
