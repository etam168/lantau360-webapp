<template>
  <q-card class="bg-transparent full-width" style="margin-bottom: 21px">
    <q-bar dense class="bg-primary text-white">
      <div class="col text-weight-bold">
        {{ $t("errors.photosRemaining", { count: localImages.length, limit: maxImages }) }}
      </div>
      <q-space />
    </q-bar>

    <div class="grid-container">
      <vue-draggable v-model="localImages" style="display: contents" @end="onDragEnd">
        <div
          v-for="(img, index) in localImages"
          :key="index"
          class="flex justify-center items-center"
        >
          <gallery-image-card
            :image="img"
            @delete="handleDelete(index)"
            @edit="handleEditImage(index)"
          />
        </div>
      </vue-draggable>

      <q-card
        flat
        bordered
        v-if="localImages.length < maxImages"
        class="cursor-pointer"
        style="width: 136px; height: 142.8px"
        @click="selectAndUploadNewImage"
      >
        <q-card-section class="column items-center justify-center">
          <q-icon :name="fasUpload" size="md" color="grey" />
          <div class="text-caption q-mt-sm">{{ $t("action.addPhoto") }}</div>
        </q-card-section>
      </q-card>
    </div>

    <q-file
      ref="image"
      accept="image/*"
      max-file-size="3000000"
      v-show="false"
      v-model="imagePath"
      :max-files="isInEdit ? 1 : maxImages - localImages.length"
      :multiple="!isInEdit"
      @update:model-value="onFileSelected"
      @rejected="onRejected"
    />
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasUpload } from "@quasar/extras/fontawesome-v6";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // Composables
  import { useField } from "vee-validate";
  import { useTemplateRef } from "vue";
  import { useUtilities } from "@/composable/use-utilities";
  import { VueDraggable } from "vue-draggable-plus";
  import { useImageFunctions } from "@/composable/use-image-functions";

  const { name, options = [] } = defineProps<{
    name: string;
    options?: GalleryImageType[];
  }>();

  const { notify } = useUtilities();

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

  async function processImage(file: File) {
    return await compressImage(file, 1920 * 1080, 0.7);
  }

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

  function handleDelete(index: number) {
    localImages.value.splice(index, 1);
    updateFieldValue();
  }

  async function onFileSelected(filesOrFile: File[] | File) {
    const files: File[] = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];

    if (files && files.length > 0) {
      try {
        const processedFiles = await Promise.all(files.map(file => processImage(file)));

        if (isInEdit.value && currentEditingIndex.value !== null) {
          localImages.value.splice(currentEditingIndex.value, 1, processedFiles[0]);
          resetEditMode();
        } else {
          const availableSlots = maxImages - localImages.value.length;
          const filesToAdd = processedFiles.slice(0, availableSlots);

          filesToAdd.forEach(file => {
            localImages.value.push(file);
          });

          if (files.length > availableSlots) {
            notify(`Only ${availableSlots} image(s) were added due to the limit.`, "warning");
          }
        }

        updateFieldValue();
      } catch (error) {
        console.error("Error processing images:", error);
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

  function onRejected(rejectedFiles: any) {
    if (Array.isArray(rejectedFiles) && rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejectedFile: any) => {
        const fileName = rejectedFile.file ? rejectedFile.file.name : "Unknown File";
        notify(
          `File upload rejected: ${rejectedFile.failedPropValidation} - ${fileName}`,
          "negative"
        );
      });
    }
    resetEditMode();
  }

  function onDragEnd() {
    updateFieldValue();
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
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
    gap: 10px;
    padding: 10px;
  }
</style>
