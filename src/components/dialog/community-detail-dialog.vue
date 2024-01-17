<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="renderer !== RENDERER.TIMETABLE" class="q-items-center q-pa-none">
            <div v-if="galleryItems && galleryItems?.length > 0">
              <gallery-image-list :image-list="galleryItems" />
            </div>
            <div v-else>
              <q-img :src="PLACEHOLDER_THUMBNAIL" :ratio="3 / 1" style="height: 380px" />
            </div>
          </div>

          <posting-renderer v-if="renderer === RENDERER.POSTING" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { Directory } from "@/interfaces/models/entities/directory";

  // .ts files
  import { URL, RENDERER, TEMPLATE, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import PostingRenderer from "@/components/dialog/renderer/posting-renderer.vue";

  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  type DirectoryTypes = Directory | CommunityDirectory;

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  const { translate, eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return translate(props.item.siteName, props.item.meta, "siteName");
      case "businessId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      case "postingId" in props.item:
        return translate(props.item.title, props.item.meta, "title");
      default:
        return "";
    }
  });

  const galleryUrl = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return `${URL.SITE_GALLERY}/${props.item.siteId}`;
      case "businessId" in props.item:
        return `${URL.BUSINESS_GALLERY}/${props.item.businessId}`;
      case "postingId" in props.item:
        return `${URL.POSTING_GALLERY}/${props.item.postingId}`;
      default:
        return "";
    }
  });

  const renderer = computed(() => {
    switch (true) {
      case "postingId" in props.item:
        return RENDERER.POSTING;
      // case props.directory.meta.template == TEMPLATE.TIMETABLE.value:
      //   return RENDERER.TIMETABLE;
      // case props.directory.meta.template == TEMPLATE.TAXI.value:
      //   return RENDERER.TAXI;
      // case props.directory.meta.template == TEMPLATE.RESTAURANT.value:
      //   return RENDERER.RESTAURANT;
      // case [1, 3].includes(props.directory.groupId) &&
      //   props.directory.meta.template == TEMPLATE.DEFAULT.value:
      //   return RENDERER.SITE;
      // case [2, 4].includes(props.directory.groupId) &&
      //   props.directory.meta.template == TEMPLATE.DEFAULT.value:
      //   return RENDERER.BUSINESS;
      default:
        return "";
    }
  });

  onMounted(() => {
    loadData();
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }

  const loadData = async () => {
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([
          axios.get<GalleryImageType[]>(galleryUrl.value)
        ]);

        const maskValue = getMaskValue(props.directory?.meta?.template ?? 0) ?? 0;
        // galleryItems.value = galleryResponse.data.filter(
        //   element => !(maskValue & (1 << (element.ranking - 1)))
        // );
        galleryItems.value = galleryResponse.data.filter(
          element => !((maskValue >> (element.ranking - 1)) & 1)
        );
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = "Not found";
          } else {
            error.value = "An error occurred";
          }
        } else {
          error.value = "An unexpected error occurred";
        }
      }
    }
  };

  function getMaskValue(templateValue: number) {
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        return TEMPLATE[make as keyof typeof TEMPLATE].mask;
      }
    }
    return 0;
  }
</script>
