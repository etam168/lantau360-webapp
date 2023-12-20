<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-item class="q-items-center q-pa-none">
            <gallery-carousel-image
              class="col-12 q-items-center"
              :gallery-images="galleryItems"
              :address="translate(item.subtitle1, item.meta, 'subtitle1')"
            />
          </q-item>

          <q-list padding class="q-mx-sm q-pa-none">
            <q-item>
              <q-item-section avatar>
                <q-icon color="primary" name="location_on" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="q-mt-sm"
                  >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
                </q-item-label>
                <q-item-label class="q-mt-sm" caption
                  >{{ $t("community.subtitle1") }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <q-btn
                    color="primary"
                    :text-color="isFavourite ? 'red' : 'white'"
                    icon="favorite"
                    size="sm"
                    round
                    @click="onBtnFavClick"
                    class="q-mr-md" />
                  <q-btn
                    :disable="item.contactPhone == ''"
                    color="primary"
                    text-color="white"
                    icon="phone"
                    size="sm"
                    round
                    class="q-mr-md" />
                  <q-btn
                    color="primary"
                    text-color="white"
                    :disable="item.contactWhatsApp == ''"
                    icon="fab fa-whatsapp"
                    size="sm"
                    round
                    @click="navigateToWhatsApp"
                /></q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="primary" name="schedule" />
              </q-item-section>

              <q-item-section class="row">
                <q-item-label>
                  <q-item-label class="q-mt-sm"
                    >{{ formatTime(item.openTime) }} -
                    {{ formatTime(item.closeTime) }}</q-item-label
                  >
                  <q-item-label class="q-mt-sm" caption
                    >{{ $t("business.openTime") }} - {{ $t("business.closeTime") }}</q-item-label
                  >
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-mt-sm" />

            <q-item>
              <!-- <div v-html="translate(item.description, item.meta, 'description')"></div> -->

              <editor-content :editable="isEditable" :editor="editor"></editor-content>
            </q-item>
            <q-separator class="q-mt-sm" />
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import { URL } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";

  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  // const data =
  //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';

  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Link]
  });

  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const isEditable = ref(false);
  const isFavourite = ref<boolean>(false);
  //const setIsEditable = ref(false);

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImage[]>([]);

  const dialogTitle = computed(() => {
    debugger;
    switch (true) {
      case "siteId" in props.item:
        return translate(props.item.siteName, props.item.meta, "siteName");
      case "advertisementId" in props.item:
        return translate(props.item.advertisementName, props.item.meta, "advertisementName");
      case "businessId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      case "postingId" in props.item:
        return translate(props.item.title, props.item.meta, "title");
      default:
        return "";
    }
  });

  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  const galleryUrl = computed(() => {
    switch (true) {
      case "advertisementId" in props.item:
        return `${URL.ADVERTISEMENT_GALLERY}/${props.item.advertisementId}`;
      default:
        return "";
    }
  });

  onMounted(() => {
    loadData();
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    // const data =
    //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';
    editor.value?.commands.setContent(props.item.description, false);
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }

  const loadData = async () => {
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([axios.get<GalleryImage[]>(galleryUrl.value)]);
        galleryItems.value = galleryResponse.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = "Not found";
          } else {
            error.value = "An error occurred";
          }
        } else {
          error.value = "An unexpected error occurred";
        }
      }
    }
  };

  function navigateToWhatsApp() {
    const formattedPhoneNumber = encodeURIComponent(
      (props.item?.contactWhatsApp ?? "").replace(/\D/g, "")
    );
    const message = "Hi, Can you guide me for my visit to lantau?";
    const propertyLink = `https://app.lantau360.com/`;

    const whatsappURL = `https://wa.me/${formattedPhoneNumber}?text=${encodeURIComponent(
      `${message} \n${propertyLink} `
    )}`;

    window.open(whatsappURL, "_blank");
  }
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
