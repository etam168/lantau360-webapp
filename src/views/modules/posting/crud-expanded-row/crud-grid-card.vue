<template>
  <q-card class="q-ma-sm" style="width: 320px">
    <q-img :placeholder-src="PLACEHOLDER_THUMBNAIL" :ratio="16 / 9" :src="imagePath">
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

    <q-card-actions align="right">
      <q-btn flat round color="red" icon="delete" @click="handleDelete"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType } from "vue";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { SiteImage } from "@/interfaces/siteImage";

  export default defineComponent({
    name: "CrudGridCard",

    props: {
      row: Object as PropType<SiteImage>
    },

    emits: ["on-delete"],

    setup(props, { emit }) {
      const imagePath = computed(() => `${props.row.imagePath}`);

      function handleDelete() {
        emit("on-delete");
      }

      return {
        imagePath,
        PLACEHOLDER_THUMBNAIL,
        handleDelete
      };
    }
  });
</script>
