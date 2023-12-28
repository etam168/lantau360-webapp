<template>
  <q-item v-if="!isSmallSize">
    <q-item-section>
      <q-card flat bordered>
        <q-card-section
          Center
          style="height: 230px; display: flex; flex-direction: column; justify-content: center"
        >
          <div class="center-badge">
            <q-badge class="bg-transparent">
              <app-button round color="grey" icon="image" size="md" @click="onImageUpload()" />
            </q-badge>
          </div>
          <div class="text-center text-subtitle2 q-mb-lg q-mt-sm">{{ label }}</div>
        </q-card-section>
      </q-card>
    </q-item-section>
  </q-item>

  <q-item-section v-else-if="isSmallSize && galleryImages.length <= 10">
    <q-card flat bordered style="width: 133px; height: 100px">
      <q-card-section>
        <q-badge color="transparent" class="center-badge">
          <app-button round color="grey" icon="image" size="sm" @click="onImageUpload()" />
        </q-badge>
        <div class="text-center q-mt-sm text-weight-medium" style="font-size: 10px">
          {{ label }}
        </div>
      </q-card-section>
    </q-card>
  </q-item-section>

  <q-file
    v-if="isGallery"
    ref="imageRef"
    accept="image/*"
    v-show="false"
    v-model="imagePath"
    multiple
    @update:model-value="onUploadImage"
    :max-files="11 - galleryImages.length"
    @rejected="onRejected"
  />

  <q-file
    v-else
    ref="imageRef"
    accept="image/*"
    v-show="false"
    v-model="imagePath"
    @update:model-value="onUploadImage"
  />
</template>

<script setup lang="ts">
  // Vue Import

  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { Ref, inject, ref } from "vue";
  import { useUtilities } from "@/composable/use-utilities";

  const { notify } = useUtilities();

  //const { resizeImage } = useUtilities();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const prop = defineProps({
    label: {
      type: String,
      default: "Add Photos"
    },
    isSmallSize: {
      type: Boolean,
      default: false
    },
    isGallery: {
      type: Boolean,
      default: true
    }
  });
  const emits = defineEmits(["uploadCallback"]);

  const imagePath = ref();
  const imageRef = ref();
  function onImageUpload() {
    imageRef.value.pickFiles();
  }
  const galleryImages = inject("imageList") as Ref<GalleryImage[]>;

  async function onUploadImage() {
    try {
      emits("uploadCallback", imagePath.value);
    } catch (error) {
      // await updateProfileImage(imagePath.value);
      console.error("Error uploading image:", error);
    }
  }

  function onRejected() {
    notify("Total number images should not be greater then 10", "negative");
  }
</script>
<style scoped>
  .center-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center; /* Optional: Center the text within the badge */
  }
</style>
