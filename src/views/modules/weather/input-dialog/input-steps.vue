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
        <!-- input content here -->
        {{ formUpdates(values) }}

        <q-card-section>
          <input-content />

          <!-- <building-facilities /> -->
        </q-card-section>

        <!-- <q-card-section>
          <image-input @uploadCallback="onUploadImage" class="q-mx-md" label="Image Path" />
        </q-card-section> -->
      </q-scroll-area>

      <q-card-actions class="q-pa-md">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
        <q-space />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { Ref, inject, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  //.ts
  import { WeatherInput } from "@/interfaces/input/weather-input";
  import { useWeatherInput } from "../shared/use-weather-input";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  //import BuildingFacilities from "../shared/building-facilities.vue";
  import InputContent from "../shared/input-content.vue";
  //import ImageInput from "@/components/custom/image-input.vue";

  const { schema, initialValues, setValidatedInput, createWeather } = useWeatherInput();
  const form = ref();

  // const previewImagePath = inject("imagePath") as Ref<any>;
  const previewWeather = inject("previewWeather") as Ref<WeatherInput>;
  const emit = defineEmits(["on-save", "on-change"]);

  function onSubmit(values: any) {
    form.value.validate().then((isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        createWeather();
        emit("on-save");
      }
    });
  }

  // async function onUploadImage(image: any) {
  //   imagePath.value = image;
  //   previewImagePath.value = image;
  // }

  function formUpdates(data: any) {
    previewWeather.value.iconNo = data.iconNo;
    previewWeather.value.caption = data.caption;

    previewWeather.value.meta ??= {};
    previewWeather.value.meta.i18n ??= {};
    previewWeather.value.meta.i18n["hk"] ??= {};
    previewWeather.value.meta.i18n["cn"] ??= {};
    previewWeather.value.meta.i18n["cn"]["caption"] = data.captionCn;
    previewWeather.value.meta.i18n["hk"]["caption"] = data.captionHk;
  }
</script>
