<template>
  <q-card flat bordered style="width: 320px; height: 180px">
    <q-img :placeholder-src="placeholderSrc" :ratio="16 / 9" :src="imgSrc">
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

    <q-badge class="absolute-bottom-left" color="transparent" v-if="isDelete">
      <app-button round color="grey" icon="delete" size="xs" @click="onDeleteImage" />
    </q-badge>
  </q-card>
</template>

<script setup lang="ts">
  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";

  defineProps({
    placeholderSrc: String,
    imgSrc: String,
    isDelete: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(["on-delete-gallery"]);

  function onDeleteImage() {
    emits("on-delete-gallery");
  }
</script>
