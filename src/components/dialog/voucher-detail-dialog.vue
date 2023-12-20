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
            <gallery-carousel-image class="col-12 q-items-center" :gallery-images="galleryItems" />
          </q-item>
          <q-list padding class="q-mx-sm q-pa-none">
            <q-item>
              <q-btn color="primary" text-color="white" icon="location_on" round @click="temp" />
              <q-space />

              <q-btn color="primary" text-color="white" icon="phone" round />
              <q-space />
              <q-btn
                color="primary"
                :text-color="isFavourite ? 'red' : 'white'"
                icon="favorite"
                round
                @click="onBtnFavClick"
              />
            </q-item>
            <q-separator class="q-mt-sm" />

            <q-item>
              <q-item-section>
                <q-item-label class="q-mt-sm"
                  >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
                </q-item-label>
                <q-item-label class="q-mt-sm" caption>{{ $t("business.subtitle1") }} </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator class="q-mt-sm" />

            <q-item>
              <!-- <div
                v-html="translate(directoryItem.description, directoryItem.meta, 'description')"
              ></div> -->

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
  import {
    DIRECTORY_GROUPS,
    BUSINESS_VOUCHER_GALLERY_URL,
    BUSINESS_VOUCHER_URL_BY_ID,
    STORAGE_KEYS
  } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";
  import { PropType, computed, onMounted } from "vue";
  import { ref } from "vue";

  import { LocalStorage } from "quasar";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";

  const directoryItem = ref<BusinessVoucher>({} as BusinessVoucher);
  const { translate } = useUtilities();

  const props = defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const isEditable = ref(false);

  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Link]
  });

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImage[]>([]);
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.businessVoucherId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: props.query?.businessVoucherId,
        directoryName: directoryItem?.value?.directoryName,
        itemName: directoryItem.value.businessName,
        itemId: itemIdToMatch,
        groupId: DIRECTORY_GROUPS.HOME,
        iconPath: directoryItem.value.iconPath,
        subTitle: directoryItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems.value);
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

  const dialogTitle = computed(() => {
    return translate(directoryItem.value.businessName, directoryItem.value.meta, "businessName");
  });

  onMounted(() => {
    loadData();
    eventBus.on("BusinessVoucherDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    // const data =
    //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';
    editor.value?.commands.setContent(props.item.description, false);
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "BusinessVoucherDialog");
  }

  const loadData = async () => {
    if (props.query?.businessVoucherId !== undefined) {
      try {
        const [businessVoucherResponse, galleryResponse] = await Promise.all([
          axios.get(`${BUSINESS_VOUCHER_URL_BY_ID}/${props.query?.businessVoucherId}`),
          axios.get<GalleryImage[]>(
            `${BUSINESS_VOUCHER_GALLERY_URL}/${props.query?.businessVoucherId}`
          )
        ]);
        directoryItem.value = businessVoucherResponse.data;
        galleryItems.value = galleryResponse.data;

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) => item.itemId == directoryItem.value.businessVoucherId
          ) != null;
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
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
