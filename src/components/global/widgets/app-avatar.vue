<template>
  <q-avatar v-bind="$attrs" style="background: #e9f8e8">
    <q-img :src="getImageURL(imagePath)">
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          {{ $t("errors.cannotLoadImage") }}
        </div>
      </template>
    </q-img>
  </q-avatar>
</template>

<script setup lang="ts">
  const { imagePath } = defineProps<{
    imagePath: string | null;
  }>();

  const { getImageURL } = useUtilities();
</script>
