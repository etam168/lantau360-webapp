<template>
  <q-card flat>
    <q-card-actions class="justify-end q-pt-md q-px-md q-pb-none">
      <app-button-rounded
        v-if="hasCheckIn"
        color="primary"
        @click="onBtnCheckInClick"
        :icon="fasMapLocationDot"
      />

      <app-button-rounded
        :text-color="isFavourite ? 'red' : 'white'"
        :icon="fasHeart"
        @click="onBtnFavClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Third party imports
  import { fasHeart, fasMapLocationDot } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey } from "@/constants";
  import { useUserStore } from "@/stores/user";

  // Emit
  const emit = defineEmits(["check-in"]);

  // Props
  const { category, entityKey, hasCheckIn } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    hasCheckIn?: boolean;
  }>();

  const userStore = useUserStore();
  const $q = useQuasar();

  // Composable function calls
  const { eventBus } = useUtilities();
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);



  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));

  function onBtnFavClick() {
    if (userStore.isUserLogon() == false) {
      promptUserLogon();
    } else {
      toggleItemFavStatus(category, isFavourite.value);
      isFavourite.value = !isFavourite.value;
      eventBus("favoriteUpdated").emit(category);
    }
  }

  function promptUserLogon() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue")),
      componentProps: {
        mode: "login"
      }
    });
  }
  function onBtnCheckInClick() {
    emit("check-in");
  }
</script>
