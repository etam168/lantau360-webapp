<template>
  <q-card v-bind="$attrs" bordered v-if="imageSrc != null">
    <q-img :src="imageSrc" :ratio="16 / 9">
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-primary text-white">Cannot load image</div>
      </template>

      <template v-slot:loading>
        <div class="absolute-full flex flex-center bg-gray text-white">
          <q-inner-loading showing class="spinner-card row justify-center items-center">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </template>
    </q-img>

    <q-card-actions>
      <div class="text-subtitle1">{{ props.label }}</div>
      <q-space />
      <app-button round color="grey" icon="photo" size="xs" @click="onImageUpload" />
    </q-card-actions>
  </q-card>

  <q-card style="height: 180px" flat bordered v-else>
    <q-card-section>
      <q-badge color="transparent" class="center-badge q-mt-lg">
        <app-button round color="grey" icon="image" size="md" @click="onImageUpload()" />
      </q-badge>
      <div class="text-center text-subtitle2 q-mb-lg q-mt-sm">{{ label }}</div>
    </q-card-section>
  </q-card>

  <q-file
    ref="imageRef"
    accept="image/*"
    v-show="false"
    v-model="imagePath"
    @update:model-value="onUploadImage"
  />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import { BLOB_URL } from "@/constants";

  const emits = defineEmits(["uploadCallback"]);
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

  const { resizeImage } = useUtilities();

  const imagePath = ref();
  const imageRef = ref();
  const imageSrc = ref<any>(getImageURL(props.imgSource));

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
    if (imagePath !== null && imagePath.includes("localhost")) {
      return imagePath;
    }
    return imagePath ? `${BLOB_URL}/${imagePath}` : null;
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
</style>
