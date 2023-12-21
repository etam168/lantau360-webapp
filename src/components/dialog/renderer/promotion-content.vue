<template>
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
        <q-item-label class="q-mt-sm" caption>{{ $t("buiness.subtitle1") }} </q-item-label>
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
</template>

<script setup lang="ts">
  import { DIRECTORY_GROUPS, STORAGE_KEYS } from "@/constants";
  import { PropType, onMounted } from "vue";
  import { ref } from "vue";

  import { LocalStorage } from "quasar";
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";

  const directoryItem = ref<BusinessPromotion>({} as BusinessPromotion);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const isDialogVisible = ref();

  const isEditable = ref(false);

  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Link]
  });

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.businessPromotionId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: props.item?.businessPromotionId,
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

  onMounted(() => {
    eventBus.on("BusinessPromotionDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    // const data =
    //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';
    editor.value?.commands.setContent(props.item.description, false);
  });
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
