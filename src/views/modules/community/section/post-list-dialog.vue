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
        <q-card-actions align="center" class="button-margin">
          <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
          <q-space />
          <div class="text-h6 text-weight-medium">{{ directoryName }}</div>
          <q-space />
        </q-card-actions>

        <q-page-container class="q-mx-xl q-my-md">
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.businessId"
            @click="onItemClick(item)"
            class="shadow-1 q-mb-md q-pl-sm"
          >
            <q-item-section avatar>
              <q-avatar size="64px" square>
                <q-img :src="computePath(item.imagePath)" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="q-ml-lg">
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label>{{ item.subtitle1 }}</q-item-label>
            </q-item-section>

            <q-item-section side>
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
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
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
    return path ? `${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
