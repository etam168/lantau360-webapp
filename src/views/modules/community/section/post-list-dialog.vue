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

        <q-page-container class="q-mx-md q-my-md">
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.postingId"
            @click="onItemClick(item)"
            class="shadow-1 q-mb-md q-pl-sm"
          >
            <q-item-section avatar>
              <q-avatar size="64px" square>
                <q-img ratio="1" :src="computePath(item.imagePath)" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="q-ml-lg">
              <q-item-label>
                {{ translate(item.title, item.meta, "title") }}
              </q-item-label>

              <q-item-label>
                {{ translate(item.subtitle1, item.meta, "subtitle1") }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { PropType, computed, defineAsyncComponent, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  // import { useRouter } from "vue-router";
  // const router = useRouter();
  const $q = useQuasar();
  const { translate } = useUtilities();

  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Posting[]
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

  // const onItemClick = (value: any) => {
  //   router.push({
  //     name: "business-detail",
  //     query: { businessId: value.businessId }
  //   });
  // };

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./community-detail-dialog.vue")),
      componentProps: {
        query: { postingId: item.postingId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
