<template>
  <q-card-actions class="q-pt-md justify-center">
    <q-btn v-bind="$attrs" round padding="1px" color="white" style="cursor: auto">
      <q-avatar size="128px">
        <q-img :src="imageSrc || ''">
          <template v-slot:error>
            <img :src="imageSrc" />
          </template>

          <template v-slot:loading>
            <div class="absolute-full flex flex-center bg-gray text-white">
              <q-inner-loading showing class="spinner-card row justify-center items-center">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>
            </div>
          </template>
        </q-img>

        <q-badge class="absolute-bottom-left" color="transparent">
          <app-button
            v-if="localImages.length > 0"
            round
            color="black"
            :icon="fasCamera"
            size="sm"
            @click="handleEditImage(0)"
          />
          <app-button-rounded
            v-else
            color="black"
            :icon="fasCamera"
            @click="selectAndUploadNewImage"
          />
        </q-badge>
      </q-avatar>

      <q-file
        ref="image"
        accept="image/*"
        max-file-size="3000000"
        v-show="false"
        v-model="imagePath"
        :max-files="isInEdit ? 1 : maxImages - localImages.length"
        :multiple="!isInEdit"
        @update:model-value="onFileSelected"
      />
    </q-btn>
  </q-card-actions>
</template>

<script setup lang="ts">
  // Types
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // Composables
  import { useField } from "vee-validate";
  import { useTemplateRef } from "vue";
  import { useUtilities } from "@/composable/use-utilities";

  // Constants
  import { fasCamera } from "@quasar/extras/fontawesome-v6";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const { name, options = [] } = defineProps<{
    name: string;
    options?: GalleryImageType[];
  }>();

  const { getImageURL, notify } = useUtilities();

  const currentEditingIndex = ref<number | null>(null);
  const imageRef = useTemplateRef("image");
  const imagePath = ref();
  const isInEdit = ref(false);
  const maxImages = 27;

  const { compressImage } = useImageFunctions();
  const { value, handleChange } = useField<(GalleryImageType | File)[]>(name);

  const localImages = ref<(GalleryImageType | File)[]>([...options]);

  // Sync the field value with localImages initially
  handleChange([...localImages.value]);

  const imageSrc = computed(() => {
    const firstImage = localImages.value[0];
    if (firstImage instanceof File) {
      return URL.createObjectURL(firstImage);
    } else if (typeof firstImage === "object" && "imagePath" in firstImage) {
      return getImageURL(firstImage.imagePath);
    } else {
      return PLACEHOLDER_THUMBNAIL;
    }
  });

  function selectAndUploadNewImage() {
    if (localImages.value.length >= maxImages) {
      notify("You have reached the maximum number of photos.", "negative");
      return;
    }
    resetEditMode();
    (imageRef.value as any).pickFiles();
  }

  function handleEditImage(index: number) {
    currentEditingIndex.value = index;
    isInEdit.value = true;
    imagePath.value = null; // Reset the file input
    nextTick(() => {
      (imageRef.value as any).pickFiles();
    });
  }

  async function onFileSelected(filesOrFile: File[] | File) {
    const files: File[] = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];

    if (files && files.length > 0) {
      try {
        const compressedFiles = await Promise.all(
          files.map(file => compressImage(file, 1920 * 1080, 0.7))
        );

        if (isInEdit.value && currentEditingIndex.value !== null) {
          console.log("Editing image at index:", currentEditingIndex.value);
          localImages.value.splice(currentEditingIndex.value, 1, compressedFiles[0]);
          resetEditMode();
        } else {
          const availableSlots = maxImages - localImages.value.length;
          const filesToAdd = compressedFiles.slice(0, availableSlots);

          filesToAdd.forEach(file => {
            localImages.value.push(file);
          });

          if (files.length > availableSlots) {
            notify(`Only ${availableSlots} image(s) were added due to the limit.`, "warning");
          }
        }

        updateFieldValue();
      } catch (error) {
        console.error("Error compressing images:", error);
        notify("An error occurred while processing the images.", "negative");
      }
    }
  }

  function resetEditMode() {
    isInEdit.value = false;
    currentEditingIndex.value = null;
    imagePath.value = null;
  }

  function updateFieldValue() {
    handleChange([...localImages.value]);
  }

  watch(
    () => value.value,
    newValue => {
      if (JSON.stringify(newValue) !== JSON.stringify(localImages.value)) {
        localImages.value = [...newValue];
      }
    },
    { deep: true }
  );
</script>

<style scoped>
  .add-photo-card {
    width: 136px;
    height: 142.8px;
  }
</style>
