<template>
  <q-item class="q-px-lg q-py-md">
    <q-item-section top avatar>
      <q-avatar size="64px">
        <q-img :placeholder-src="PLACEHOLDER_AVATAR" ratio="1" :src="imageLink">
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

    <q-item-section>
      <q-item-label class="text-right">
        <q-badge color="green" :label="recId" />
      </q-item-label>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator inset color="green" />
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";

  import { PLACEHOLDER_AVATAR } from "@/constants";
  export default defineComponent({
    name: "CrudGridCardBanner2",

    props: {
      recId: {
        type: [String, Number]
      },
      imageLink: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      caption: {
        type: String
      }
    },

    emits: ["on-image-update"],

    // https://dev.to/onurelibol/creating-custom-components-with-vuetify-inheriting-props-events-slots-in-composition-api-56ef?utm_source=dormosheio&utm_campaign=dormosheio
    setup(_, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));
      return {
        parentSlots,
        PLACEHOLDER_AVATAR
      };
    }
  });
</script>
