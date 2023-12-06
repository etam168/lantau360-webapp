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
      <!-- {{ directoryItems[0] }} -->
      <q-layout view="hHh lpR fFf">
        <q-card-actions align="center" class="button-margin">
          <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
          <q-space />
          <div class="text-h6 text-weight-medium">
            {{ translate(directory.directoryName, directory.meta, "directoryName") }}
          </div>
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
                <q-img ratio="1" :src="computePath(item.iconPath)" />
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

            <q-item-section side>
              <q-icon name="favorite" size="2em" color="red" />
              <!-- <q-item-label>distance in km</q-item-label> -->
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
  import { PropType, computed, defineAsyncComponent, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  // import { useRouter } from "vue-router";
  // const router = useRouter();
  import { useUtilities } from "@/composable/use-utilities";
  import { Directory } from "@/interfaces/models/entities/directory";

  const { translate } = useUtilities();

  const $q = useQuasar();

  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Business[]
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../../site-directory/site-detail-dialog.vue")),
      componentProps: {
        query: { siteId: item.siteId }
      }
    });
  }

  // const onItemClick = (value: any) => {
  //   debugger;
  //   router.push({
  //     name: "business-detail",
  //     query: { businessId: value.businessId }
  //   });
  // };

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
