<template>
  <q-item clickable :style="$q.screen.lt.sm ? 'max-width: 390px' : ''">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="(communityItem as PostingView).memberImage" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ line1 }}</q-item-label>
      <q-item-label caption lines="2">{{ line2 }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn flat round dense :icon="fasEllipsisVertical" class="custom-btn">
        <q-menu self="top right">
          <q-list>
            <q-item
              v-for="item in menuItems"
              :key="item.value"
              :clickable="!item.disabled"
              @click="handleMenuAction(item)"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
  import { PostingView } from "@/interfaces/models/views/posting-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { fasEllipsisVertical } from "@quasar/extras/fontawesome-v6";
  import { formatTimeAgo } from "@vueuse/core";
  import { computed } from "vue";

  // Stores
  import { useUserStore } from "@/stores/user";

  // Props
  const { communityItem } = defineProps<{
    communityItem: CategoryTypes;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);
  const userStore = useUserStore();

  // Emits
  const emit = defineEmits(["on-detail", "on-edit"]);

  // Menu Items
  const menuItems = computed(() => [
    { value: "detail", label: "Detail", disabled: false },
    { value: "edit", label: "Edit", disabled: !showEdit() }
  ]);

  // Functions for line1 and line2
  const line1 = computed(() => {
    return (communityItem as PostingView).memberFirstName || "";
  });

  const line2 = computed(() => {
    const timeAgo = formatTimeAgo(new Date((communityItem as PostingView).createdAt));
    const title = translate(communityItem.title as string, communityItem.meta, "title");
    return `${timeAgo} | ${title}`;
  });

  function showEdit() {
    return userStore.userInfo && userStore.userInfo.userId === communityItem.createdBy;
  }

  // Handle Menu Action
  const handleMenuAction = (menuItem: { value: string }) => {
    if (menuItem.value === "detail") {
      emit("on-detail");
    } else if (menuItem.value === "edit") {
      emit("on-edit");
    }
  };
</script>
