<template>
  <q-card flat bordered>
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

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";

  defineProps({
    label: {
      type: String,
      default: "Add Photos"
    }
  });

  const imagePath = ref();
  const imageRef = ref();

  const emits = defineEmits(["uploadCallback"]);

  async function onUploadImage() {
    try {
      emits("uploadCallback", imagePath.value);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
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
    text-align: center; /* Optional: Center the text within the badge */
  }
</style>
