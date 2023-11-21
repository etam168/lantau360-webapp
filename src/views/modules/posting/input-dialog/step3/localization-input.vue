<template>
  <q-card flat class="q-ml-none column">
    <q-scroll-area style="height: calc(100vh - 250px)" class="q-ma-none q-pr-lg">
      <div class="q-gutter-none q-ml-none q-mb-md">
        <q-radio v-model="lang" val="hk" label="hk" color="green" />
        <q-radio v-model="lang" val="zh" label="zh" color="green" />
      </div>

      <q-card-section class="q-pa-none q-ma-none">
        <div class="q-gutter-md column">
          <app-input-outlined
            counter
            maxlength="16"
            name="metaPostingName"
            v-model="metaPostingName"
            :label="$t('posting.columns.postingName')"
          />

          <app-input-outlined
            counter
            maxlength="16"
            name="metaTitle"
            v-model="metaTitle"
            :label="$t('posting.columns.title')"
          />

          <app-input-outlined
            counter
            maxlength="30"
            name="metaSubTitle1"
            v-model="metaSubTitle1"
            :label="$t('posting.columns.subtitle1')"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <q-toggle v-model="visible" color="green" label="Show JSON" class="q-ml-none q-mb-md" />

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
  import { computed, defineComponent, ref, onMounted, watch, defineAsyncComponent } from "vue";
  import VueJsonPretty from "vue-json-pretty";
  import "vue-json-pretty/lib/styles.css";

  // Composable
  import usePostingInput from "../use-posting-input";

  export default defineComponent({
    name: "InputDialogStep1Localization",

    components: {
      AppInputOutlined: defineAsyncComponent(
        () => import("@/components/widgets/app-input-outlined.vue")
      ),
      VueJsonPretty
    },

    setup() {
      const { postingInput, lang } = usePostingInput();

      const metaPostingName = ref(null);
      const metaTitle = ref(null);
      const metaSubTitle1 = ref(null);
      const visible = ref(false);

      watch(lang, newValue => {
        metaPostingName.value = postingInput.value.meta?.i18n?.[newValue]?.postingName ?? null;
        metaTitle.value = postingInput.value.meta?.i18n?.[newValue]?.title ?? null;
        metaSubTitle1.value = postingInput.value.meta?.i18n?.[newValue]?.subtitle1 ?? null;
      });

      watch([metaPostingName, metaTitle, metaSubTitle1], () => {
        postingInput.value.meta.i18n ??= {};
        postingInput.value.meta.i18n[lang.value] ??= {};
        postingInput.value.meta.i18n[lang.value]["postingName"] = metaPostingName.value;
        postingInput.value.meta.i18n[lang.value]["title"] = metaTitle.value;
        postingInput.value.meta.i18n[lang.value]["subtitle1"] = metaSubTitle1.value;
      });

      onMounted(() => {
        // Initialize localization values for input
        postingInput.value.meta = postingInput.value.meta ?? {};
        metaPostingName.value = postingInput.value.meta?.i18n?.[lang.value]?.postingName ?? null;
        metaTitle.value = postingInput.value.meta?.i18n?.[lang.value]?.title ?? null;
        metaSubTitle1.value = postingInput.value.meta?.i18n?.[lang.value]?.subtitle1 ?? null;
      });

      const metaValue = computed(() => {
        return { [lang.value]: postingInput.value.meta?.i18n?.[lang.value] ?? {} } as Record<
          string,
          unknown
        >;
      });

      return {
        lang,
        visible,

        metaValue,
        metaPostingName,
        metaTitle,
        metaSubTitle1
      };
    }
  });
</script>
