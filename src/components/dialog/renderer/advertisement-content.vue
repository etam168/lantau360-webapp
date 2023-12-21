<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(advertisementItem.subtitle1, advertisementItem.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("community.subtitle1") }} </q-item-label>
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
            :disable="advertisementItem.contactPhone == ''"
            color="primary"
            text-color="white"
            icon="phone"
            size="sm"
            round
            class="q-mr-md"
            @click="navigateToPhone" />
          <q-btn
            color="primary"
            text-color="white"
            :disable="advertisementItem.contactWhatsApp == ''"
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
            >{{ formatTime(advertisementItem.openTime) }} -
            {{ formatTime(advertisementItem.closeTime) }}</q-item-label
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
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  //   import { MarketingType } from "@/interfaces/types/marketing-types";

  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const advertisementItem = computed(() => {
    return props.item as Advertisement;
  });
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.BUSINESSFAVOURITES) || []);

  // const data =
  //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';

  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Link]
  });

  const { translate } = useUtilities();
  const isDialogVisible = ref();
  const isEditable = ref(false);
  const isFavourite = ref<boolean>(false);
  //const setIsEditable = ref(false);

  const onBtnFavClick = () => {
    const itemIdToMatch = advertisementItem.value.businessId;

    if (itemIdToMatch) {
      const isCurrentlyFavourite = isFavourite.value;

      if (isCurrentlyFavourite) {
        const itemIndex = favoriteItems.value.findIndex(
          (item: any) => item.businessId === itemIdToMatch
        );

        if (itemIndex !== -1) {
          favoriteItems.value.splice(itemIndex, 1);
        }

        isFavourite.value = false;
      } else {
        isFavourite.value = true;
        favoriteItems.value.push(advertisementItem);
      }

      LocalStorage.set(STORAGE_KEYS.BUSINESSFAVOURITES, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        businessId: advertisementItem.value.businessId
      });
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    // const data =
    //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';
    editor.value?.commands.setContent(advertisementItem.value.description, false);
  });

  function navigateToPhone() {
    const formattedPhoneNumber = encodeURIComponent(
      (advertisementItem?.value.contactPhone ?? "").replace(/\D/g, "")
    );
    const phoneURL = `tel:${formattedPhoneNumber}`;
    window.open(phoneURL, "_blank");
  }

  function navigateToWhatsApp() {
    const formattedPhoneNumber = encodeURIComponent(
      (advertisementItem?.value.contactWhatsApp ?? "").replace(/\D/g, "")
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
