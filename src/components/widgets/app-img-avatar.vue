<template>
  <q-item-section top avatar>
    <q-card flat class="my-card q-pa-none" style="border-radius: 10px">
      <q-avatar v-bind="$attrs">
        <q-img
          :placeholder-src="PLACEHOLDER_THUMBNAIL"
          ratio="1"
          v-bind="$attrs"
          :src="imageLink == null ? PLACEHOLDER_THUMBNAIL : imageLink"
        >
          <template v-slot:error>
            <q-img :src="PLACEHOLDER_THUMBNAIL" ratio="1" />
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
    </q-card>
  </q-item-section>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  export default defineComponent({
    name: "AppImgAvatar",
    inheritAttrs: false,

    props: {
      imageLink: {
        type: String,
        required: true
      }
    },

    // https://dev.to/onurelibol/creating-custom-components-with-vuetify-inheriting-props-events-slots-in-composition-api-56ef?utm_source=dormosheio&utm_campaign=dormosheio
    setup(_, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));

      return {
        parentSlots,
        PLACEHOLDER_THUMBNAIL
      };
    }
  });
</script>
