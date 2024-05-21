<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="getImageURL(businessItem.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ translate(row.title, row.meta, "title") }}
      </q-item-label>

      <q-item-label>
        {{ translate(row.subtitle1, row.meta, "subtitle1") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side v-if="isFavoriteItem(row.businessId)">
      <q-icon name="favorite" size="2em" color="red" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []);

  const emits = defineEmits(["on-detail"]);

  const { translate, getImageURL } = useUtilities();

  const props = defineProps({
    row: {
      type: Object as PropType<BusinessView>,
      required: true
    }
  });

  const businessItem = computed(() => props.row);

  function handleDetail() {
    emits("on-detail");
  }
  const isFavoriteItem = (businessId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === businessId);
  };
</script>
