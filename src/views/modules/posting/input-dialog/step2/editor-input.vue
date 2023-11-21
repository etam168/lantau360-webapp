<template>
  <q-card flat class="q-ml-none column">
    <q-scroll-area style="height: calc(100vh - 250px)" class="q-ma-none q-pr-lg">
      <div class="q-gutter-none q-ml-none q-mb-sm">
        <q-radio v-model="locale" val="en" label="en" color="green" />
        <q-radio v-model="locale" val="hk" label="hk" color="green" />
        <q-radio v-model="locale" val="zh" label="zh" color="green" />
      </div>

      <q-card-section class="q-pa-none q-ma-none">
        <app-text-editor ref="tiptap" v-model="metaDescription" :contentHeight="contentHeight" />
      </q-card-section>

      <q-card-section class="q-pa-none q-ma-none">
        <q-toggle v-model="visible" color="green" label="Show JSON" class="q-ma-none" />

        <q-slide-transition>
          <q-card v-show="visible">
            <q-card-section>
              <q-scroll-area style="height: 200px">
                <vue-json-pretty :data="metaValue" />
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </q-slide-transition>
      </q-card-section>
    </q-scroll-area>
  </q-card>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, defineAsyncComponent, watch, computed } from "vue";
  import VueJsonPretty from "vue-json-pretty";
  import "vue-json-pretty/lib/styles.css";

  import axios from "axios";

  // Composable
  import usePostingInput from "../use-posting-input";
  import { useUtilities } from "@/composable/use-utilities";

  export default defineComponent({
    name: "InputDialogStep1Localization",

    components: {
      AppTextEditor: defineAsyncComponent(() => import("@/components/widgets/app-text-editor.vue")),
      VueJsonPretty
    },

    setup() {
      const { postingInput, locale } = usePostingInput();
      const { notify } = useUtilities();

      const contentHeight = ref("calc(77vh - 300px)");
      const tiptap = ref(null);

      const metaDescription = ref<string>("");

      const visible = ref(false);

      watch(locale, newValue => {
        if (locale.value == "en") {
          metaDescription.value = postingInput.value.description;
        } else if (locale.value == "zh" || locale.value == "hk") {
          postingInput.value.meta ??= {};
          postingInput.value.meta.i18n ??= {};
          postingInput.value.meta.i18n[newValue] ??= {};
          metaDescription.value = postingInput.value.meta?.i18n?.[newValue]?.description ?? null;
        }
      });

      watch(metaDescription, () => {
        if (locale.value == "en") {
          postingInput.value.description = metaDescription.value;
        } else if (locale.value == "zh" || locale.value == "hk") {
          postingInput.value.meta.i18n ??= {};
          postingInput.value.meta.i18n[locale.value] ??= {};
          postingInput.value.meta.i18n[locale.value]["description"] = metaDescription.value;
        }
      });

      onMounted(() => {
        // Initialize localization values for input
        if (locale.value == "en") {
          metaDescription.value = postingInput.value.description;
        } else if (locale.value == "zh" || locale.value == "hk") {
          postingInput.value.meta = postingInput.value.meta ?? {};
          metaDescription.value = postingInput.value.meta?.i18n?.[locale.value]?.description ?? "";
        }
      });

      const metaValue = computed(() => {
        return {
          description: postingInput.value.meta?.i18n?.[locale.value]?.description ?? {}
        } as Record<string, unknown>;
      });

      function loadDescription() {
        axios
          .get(`/Posting/PostingById/${postingInput.value.postingId}`)
          .then(response => {
            const data = response.data;
            locale.value = "en";
            metaDescription.value = data.description;
            // alert(JSON.stringify(metaDescription.value));
          })
          .catch(errors => {
            notify(errors.message, "negative");
          });
      }

      onMounted(() => {
        loadDescription();
      });

      return {
        contentHeight,
        locale,
        visible,
        tiptap,

        metaValue,
        metaDescription
      };
    }
  });
</script>
