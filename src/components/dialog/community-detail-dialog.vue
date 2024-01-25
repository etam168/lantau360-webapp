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
        <app-dialog-title>{{
          translate(props.item.title, props.item.meta, "title")
        }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="galleryItems && galleryItems?.length > 0">
            <gallery-image-list :image-list="galleryItems" />
          </div>
          <property-renderer v-if="renderer === RENDERER.PROPERTY" :item="item" />
          <tuition-renderer v-else-if="renderer === RENDERER.TUITION" :item="item" />
          <posting-renderer v-else-if="renderer === RENDERER.POSTING" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { URL, RENDERER, TEMPLATE } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import PostingRenderer from "@/components/dialog/renderer/posting-renderer.vue";
  import TuitionRenderer from "@/components/dialog/renderer/tuition-renderer.vue";
  import PropertyRenderer from "@/components/dialog/renderer/property-renderer.vue";

  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  const props = defineProps({
    item: {
      type: Object as PropType<PostingView>,
      required: true
    },
    directory: {
      type: Object as PropType<CommunityDirectory>,
      required: true
    }
  });

  const { translate, eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const renderer = computed(() => {
    const template = props.directory?.meta?.template ?? 0;

    switch (template) {
      case TEMPLATE.TUITION.value:
        return RENDERER.TUITION;
      case TEMPLATE.PROPERTY.value:
        return RENDERER.PROPERTY;
      default:
        return RENDERER.POSTING;
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
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImageType[]>(`${URL.POSTING_GALLERY}/${props.item.postingId}`)
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
