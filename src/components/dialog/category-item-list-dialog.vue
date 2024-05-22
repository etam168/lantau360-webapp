<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <create-posting-card
            v-if="isCommunityDirectoryItem"
            class="q-px-md q-pt-md q-pb-none"
            :directory="directory"
          />

          <app-category-list
            :directory-items-list="directoryItems"
            :directory="directory"
            :directoryCheckIns="directoryCheckIns"
          />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // others import
  import { useDialogPluginComponent } from "quasar";

  // Components
  import CreatePostingCard from "@/components/card/create-posting-card.vue";

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    },
    directoryCheckIns: {
      type: Array as PropType<CheckIn[]>,
      required: true
    }
  });
  const { dialogRef } = useDialogPluginComponent();
  const { isCommunityDirectory, translate, eventBus, sortDirectoryItems } = useUtilities();

  const directoryItems = ref<any>(props?.directoryItemsList ?? []);
  const isDialogVisible = ref();

  const dialogTitle = computed(() =>
    translate(props.directory.directoryName, props.directory.meta, "directoryName")
  );

  const isCommunityDirectoryItem = computed(() => isCommunityDirectory(props.directory));

  onMounted(() => {
    eventBus.on("CategoryItemListDialog", () => {
      isDialogVisible.value = false;
    });

    //Sort Directory items
    const hasSortByKey = props.directory.meta.sortByKey in directoryItems.value[0];
    directoryItems.value = sortDirectoryItems(
      directoryItems.value,
      props.directory.meta.sortByKey,
      hasSortByKey
    );
  });

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }
</script>
