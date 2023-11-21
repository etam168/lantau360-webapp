import axios from "axios";
import { ref } from "vue";
import { FetchStatus } from "@/constants";
import { Content } from "@/interfaces/content";
import { Quasar } from "quasar";
import i18n from "@/plugins/i18n/i18n";
import * as yup from "yup";

// .ts file
import { useUtilities } from "@/composable/use-utilities";

const { t } = i18n.global;

const newInput = () => {
  return {
    modifiedAt: new Date()
  } as unknown as Content;
};

const contentInput = ref<Content>(newInput());
const locale = ref("hk");
const { notify } = useUtilities();

const fonts = ref({
  arial: "Arial",
  arial_black: "Arial Black",
  comic_sans: "Comic Sans MS",
  courier_new: "Courier New",
  impact: "Impact",
  lucida_grande: "Lucida Grande",
  times_new_roman: "Times New Roman",
  verdana: "Verdana"
});

const [
  metaContactName,
  metaFirstName,
  metaLastName,
  metaPhone,
  metaEmail,
  metaPassword,
  metaContentData
] = [
  ref<string>(""),
  ref<string>(""),
  ref<string>(""),
  ref<string>(""),
  ref<string>(""),
  ref<string>(""),
  ref<string>("")
];

export default function useContentInput() {
  const status = ref(FetchStatus.IDLE);

  function successCallback(successMessage: string) {
    notify(successMessage, "positive");
  }

  function saveContent(data: any, name: string) {
    const url = `/Content/CreateOrUpdateContent/${name}`;
    axios.put(url, data).then(
      () => {
        const successMessage = t("contact.message.updated");
        successCallback(successMessage);
      },
      error => {
        //console.log(error);
        notify(error.message, "negative");
      }
    );
  }

  function getContentByName(name: string) {
    const url = `/Content/ContentByName/${name}`;
    return axios.get(url).then(
      data => {
        return data;
      },
      error => {
        status.value = FetchStatus.ERROR;
        throw { message: error.message, status: error.response.status };
      }
    );
  }

  function testing() {
    const x = Quasar.iconSet;
    //console.log(Object.keys(x));
    //console.log(x["__icons"]);
    alert(JSON.stringify(x["__icons"].editor.align));
  }

  const schema = yup.object({});

  return {
    status,
    locale,
    fonts,

    saveContent,
    testing,
    getContentByName,
    contentInput,
    metaContactName,
    metaFirstName,
    metaLastName,
    metaPhone,
    metaEmail,
    metaPassword,
    metaContentData,

    schema
  };
}
