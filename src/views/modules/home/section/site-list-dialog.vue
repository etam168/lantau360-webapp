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
    <q-card style="max-width: 1024px">
      <q-layout view="hHh lpR fFf">
        <q-bar class="bg-primary text-white">
          <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
          <q-space />
          <div>{{ directoryName }}</div>
          <q-space />
        </q-bar>
        <q-page-container class="q-mx-xl q-my-md">
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.businessId"
            @click="onItemClick(item)"
            class="shadow-3 q-my-md"
            style="border-radius: 12px"
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
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { PropType, computed, ref } from "vue";
  import { useDialogPluginComponent } from "quasar";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Business[]
    },
    directoryName: {
      type: String as PropType<any>,
      required: true
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
    return path ? `${BLOB_URL}/${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>
