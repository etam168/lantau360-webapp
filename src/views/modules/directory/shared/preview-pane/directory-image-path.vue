<template>
  <q-card flat bordered>
    <q-item class="justify-center">
      <q-item-section avatar>
        <q-avatar size="228px">
          <q-img :src="imagePathValue" height="100%">
            <template #error>
              <div class="absolute-full flex flex-center bg-grey text-white">Cannot load image</div>
            </template>

            <template v-slot:loading>
              <div class="absolute-full flex flex-center bg-gray text-white">
                <q-inner-loading showing class="spinner-card row justify-center items-center">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </div>
            </template>
          </q-img>
        </q-avatar>
      </q-item-section>
    </q-item>

    <q-card-actions align="center" class="bg-primary">
      <div class="text-subtitle1 text-white">Image</div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const props = defineProps({
    imagePath: {
      type: String,
      required: false,
      default: null
    }
  });

  // const imagePathValue = computed(() => {
  //   if (props.imagePath) {
  //     return props?.imagePath;
  //   } else if (props.imagePath != null) {
  //     return props.imagePath;
  //   } else {
  //     return PLACEHOLDER_THUMBNAIL;
  //   }
  // });

  const imagePathValue = computed(() => {
    if (isImage(props.imagePath)) {
      return URL.createObjectURL(props?.imagePath as unknown as MediaSource);
    } else if (props.imagePath != null) {
      return `${props.imagePath}`;
    } else {
      return PLACEHOLDER_THUMBNAIL;
    }
  });

  const isImage = (value: any) => value && value.type && value.type.startsWith("image/");

  //const isImage = (value: any) => value && value.type && value.type.startsWith("image/");
</script>
