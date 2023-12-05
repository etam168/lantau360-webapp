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
    <q-card style="max-width: 80vw">
      <q-layout view="hHh lpR fFf">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup> </q-btn>
        </q-bar>
        <q-page-container class="q-ma-xl">
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.businessId"
            @click="onItemClick(item)"
          >
            <q-img width="80px" height="80px" :src="computePath(item.iconPath)" />

            <q-item-section class="q-ml-lg">
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label>{{ item.subtitle1 }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-icon name="favorite" size="2em" color="red" />
              <q-item-label>distance in km</q-item-label>
            </q-item-section>
          </q-item>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { computed, ref } from "vue";
  import { useDialogPluginComponent } from "quasar";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Business[]
    }
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
  }

  const onItemClick = (value: any) => {
    router.push({
      name: "business-detail",
      query: { businessId: value.businessId }
    });
  };

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };
</script>
