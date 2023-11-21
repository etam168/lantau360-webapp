<template>
  <q-card flat class="bg-white">
    <q-item class="justify-center">
      <q-item-section avatar>
        <q-avatar size="128px">
          <q-img :src="imagePath" height="100%">
            <template v-slot:error>
              <q-img :src="PLACEHOLDER_AVATAR" />
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

    <q-card-actions align="center">
      <div class="text-subtitle1">Staff Profile Image</div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { PLACEHOLDER_AVATAR, PLACEHOLDER_THUMBNAIL } from "@/constants";

  const props = defineProps({
    imagePath: {
      type: String,
      required: false,
      default: null
    }
  });

  const imagePath = computed(() => {
    return props.imagePath ?? PLACEHOLDER_THUMBNAIL;
  });
</script>
