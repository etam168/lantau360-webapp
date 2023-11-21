<template>
  <q-card flat>
    <q-img :src="image" :ratio="16 / 9">
      <template #error>
        <div class="absolute-full flex flex-center bg-grey text-white">Cannot load image</div>
      </template>
    </q-img>

    <!-- <q-card-actions>
      <div class="text-subtitle1 text-weight-medium">{{ title }}</div>
      <q-space />
      <q-badge color="transparent">
        <app-button round color="primary" icon="photo_camera" size="sm" @click="uploadImage" />
      </q-badge>

      <q-badge color="transparent">
        <app-button round color="grey" icon="delete" size="sm" @click="deleteImage" />
      </q-badge>
    </q-card-actions> -->

    <q-card-actions align="center" class="bg-primary">
      <div class="text-subtitle1 text-white">{{ title }}</div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  //import AppButton from "@/components/widgets/app-button.vue";

  defineProps({
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  });

  //const emit = defineEmits(["upload", "delete"]);

  // const uploadImage = () => {
  //   emit("upload");
  // };

  // const deleteImage = () => {
  //   emit("delete");
  // };
</script>
