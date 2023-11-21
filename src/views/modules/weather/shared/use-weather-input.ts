/* eslint-disable @typescript-eslint/no-unused-vars */
// vue component import
import { ref } from "vue";

// 3rd Part import
import { is } from "quasar";
import axios from "axios";
import i18n from "@/plugins/i18n/i18n";
import * as yup from "yup";

// .ts file
import { WeatherInput } from "@/interfaces/input/weather-input";
import { onRefresh } from "../use-table-options";
import { useUtilities } from "@/composable/use-utilities";
import { useUserStore } from "@/stores/user";
import { WeatherDatatable } from "@/interfaces/datatable/weather-datatable";
import eventBus from "@/utils/event-bus";

const { notify } = useUtilities();
const userStore = useUserStore();

const newWeatherInput = () => {
  return {
    modifiedAt: new Date()
  } as WeatherInput;
};

const { t } = i18n.global;

export function useWeatherInput() {
  const weatherInput = ref<WeatherInput>(newWeatherInput());
  //const imagePath = ref();

  const loading = ref(false);
  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
    loading.value = false;
  }

  async function updateWeather(): Promise<boolean> {
    weatherInput.value.modifiedBy = parseInt(userStore.userId);

    if (is.object(weatherInput.value.meta) == false) {
      weatherInput.value.meta = {};
    }

    // Update weather record
    return axios
      .put(`/WeatherIcon/${weatherInput.value.weatherIconId}`, weatherInput.value)
      .then(async () => {
        const successMessage = t("weather.message.updated");
        successCallback(successMessage);
        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }
        return false;
      });
  }

  async function createWeather(): Promise<boolean> {
    weatherInput.value.weatherIconId = 0;
    weatherInput.value.createdBy = parseInt(userStore.userId);

    if (is.object(weatherInput.value.meta) == false) {
      weatherInput.value.meta = {};
    }

    // Create a new weather record
    return axios
      .post(`/WeatherIcon`, weatherInput.value)
      .then(async response => {
        weatherInput.value.weatherIconId = response.data.weatherIconId;

        onRefresh();
        eventBus.emit("onWeatherCreate", weatherInput.value);

        const successMessage = t("weather.message.created");
        successCallback(successMessage);
        return true;
      })
      .catch(errors => {
        if (errors.message == "Network Error") {
          notify("No Internet Connection", "negative");
        } else {
          notify(errors.message, "negative");
        }
        return false;
      });
  }

  const initialValues = ref({
    status: 1
  });

  const schema = yup.object({
    iconNo: yup.string().required(),
    caption: yup.string().required().min(3).label("weather.columns.caption"),
    metaCaption: yup.string().nullable().min(3).label("weather.columns.caption")
  });

  function setWeatherInput(val: WeatherDatatable) {
    // Need to manually assign the values
    weatherInput.value.weatherIconId = val.weatherIconId;
    weatherInput.value.iconNo = val.iconNo;
    weatherInput.value.caption = val.caption;

    weatherInput.value.createdBy = val.createdBy;
    weatherInput.value.createdAt = val.createdAt;
    weatherInput.value.modifiedBy = val.modifiedBy;
    weatherInput.value.modifiedAt = val.modifiedAt;
    weatherInput.value.meta = val.meta;
  }

  function setValidatedInput(values: any) {
    weatherInput.value.weatherIconId = values.weatherIconId;

    weatherInput.value.caption = values.caption;
    weatherInput.value.meta ??= {};
    weatherInput.value.meta.i18n ??= {};
    weatherInput.value.meta.i18n["hk"] ??= {};
    weatherInput.value.meta.i18n["cn"] ??= {};
    weatherInput.value.meta.i18n["cn"]["caption"] = values.captionCn;
    weatherInput.value.meta.i18n["hk"]["caption"] = values.captionHk;
  }

  return {
    weatherInput,
    updateWeather,
    createWeather,
    setWeatherInput,
    setValidatedInput,
    schema,
    initialValues
  };
}
