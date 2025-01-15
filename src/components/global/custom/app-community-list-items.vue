<template>
  <q-table
    v-bind="$attrs"
    flat
    square
    hide-pagination
    hide-header
    :hide-bottom="communityItems.length > 0"
    :row-key="`${entityKey}Id`"
    :card-style="cardStyle"
    :rows="rows"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="padding: 0">
          <app-community-item
            :image-path="props.row.memberImage"
            :line1="line1(props.row)"
            :line2="line2(props.row)"
            :show-edit-icon="userStore.userId === props.row.createdBy"
            @on-detail="handleDetail(props.row)"
            @on-edit="handleEdit(props.row)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data>
      <app-no-record-message v-if="communityItems.length <= 0" :message="$t('errors.noRecord')" />
    </template>
  </q-table>
</template>
<script setup lang="ts">
  import { fasEllipsis, fasPencil } from "@quasar/extras/fontawesome-v6";
  import { formatTimeAgo } from "@vueuse/core";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { PostingView } from "@/interfaces/models/views/posting-view";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useUserStore } from "@/stores/user";

  // Emits
  const emits = defineEmits(["on-community-detail"]);

  // Props
  const { communityItems, entityKey } = defineProps<{
    communityItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const userStore = useUserStore();
  const { translate } = useUtilities(locale.value);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  // Computed Rows
  const rows = computed(() => communityItems);

  // Functions for line1 and line2
  function line1(item: CategoryTypes): string {
    return (item as PostingView).memberFirstName || "";
  }

  function line2(item: CategoryTypes): string {
    const timeAgo = formatTimeAgo(new Date((item as PostingView).createdAt));
    const title = translate(item.title as string, item.meta, "title");
    return `${timeAgo} | ${title}`;
  }

  function handleDetail(item: CategoryTypes) {
    emits("on-community-detail", item);
  }

  function handleEdit(item: CategoryTypes) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
      ),
      componentProps: { row: item, entityKey }
    });
  }
</script>
