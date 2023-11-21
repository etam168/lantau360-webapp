<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        {{ formUpdates(values) }}

        <q-card-section>
          <input-content />

          <!-- <building-facilities /> -->
        </q-card-section>

        <!-- <q-card-section>
          <image-input
            class="q-mx-md"
            @uploadCallback="onUploadImage"
            :img-source="row?.imagePath"
          />
        </q-card-section> -->
      </q-scroll-area>

      <q-card-actions class="q-pa-lg">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
        <q-space />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { PropType, Ref, inject, onMounted, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  //.ts
  import { useWeatherInput } from "../shared/use-weather-input";
  import { WeatherDatatable } from "@/interfaces/datatable/weather-datatable";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  //import BuildingFacilities from "../shared/building-facilities.vue";
  import InputContent from "../shared/input-content.vue";
  // import ImageInput from "@/components/custom/image-input.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<WeatherDatatable>,
      required: true
    }
  });

  const { schema, setWeatherInput, setValidatedInput, updateWeather } = useWeatherInput();

  const initialValues = ref({});

  const form = ref();

  const previewWeather = inject("previewWeather") as Ref<WeatherDatatable>;
  const emit = defineEmits(["on-save", "on-change", "on-dialog-cancel"]);

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        await updateWeather();
        eventBus.emit("LoadData");
        emit("on-save");
      }
    });
  }

  onMounted(() => {
    setWeatherInput(props.row);

    previewWeather.value = props.row;

    initialValues.value = {
      caption: props.row.caption,
      iconNo: props?.row?.iconNo,
      captionCn: props.row?.meta?.i18n?.["cn"]?.caption ?? null,
      captionHk: props.row?.meta?.i18n?.["hk"]?.caption ?? null
    };
  });

  function formUpdates(data: any) {
    previewWeather.value.caption = data.caption;
    previewWeather.value.iconNo = data.iconNo;
    previewWeather.value.meta ??= {};
    previewWeather.value.meta.i18n ??= {};
    previewWeather.value.meta.i18n["hk"] ??= {};
    previewWeather.value.meta.i18n["cn"] ??= {};
    previewWeather.value.meta.i18n["cn"]["caption"] = data.captionCn;
    previewWeather.value.meta.i18n["hk"]["caption"] = data.captionHk;
  }
</script>
