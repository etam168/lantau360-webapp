<template>
  <q-list
    v-for="(item, index) in communityItems"
    :key="index"
    class="q-list q-px-md q-pt-md q-pb-none"
  >
    <q-item class="shadow-1 q-pa-sm q-mb-md column">
      <q-item class="q-pl-none">
        <q-item-section>
          <q-item>
            <q-item-section top avatar>
              <q-avatar size="54px" circle>
                <q-img ratio="1" :src="getImageURL((item as PostingView).memberImage)">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      {{ $t("errors.cannotLoadImage") }}
                    </div>
                  </template>
                </q-img>
              </q-avatar>
            </q-item-section>

            <q-item-section side>
              <q-item-label class="text-weight-bold">
                {{ (item as PostingView).memberFirstName }}
              </q-item-label>

              <div class="row items-center">
                <q-item-label class="text-weight-medium text-caption q-mt-xs">
                  {{ line1(item) }}
                </q-item-label>
                <q-item-label class="text-weight-medium text-caption text-caption q-ml-sm">
                  {{ formatTimeAgo(new Date((item as PostingView).createdAt)) }}
                </q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </q-item-section>

        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="xs" dense flat :icon="fasCircleInfo" @click="handleDetail(item)" />
            <q-btn
              size="xs"
              dense
              flat
              :icon="fasPencil"
              v-if="userStore.userId === item.createdBy"
              @click="handleEdit(item)"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />

      <q-item class="justify-content">
        <q-item-section>
          <q-item-label class="text-grey-8">
            {{ (item as PostingView).description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { PostingView } from "@/interfaces/models/views/posting-view";

  // Constants
  import { EntityURLKey } from "@/constants";
  import { fasCircleInfo, fasPencil } from "@quasar/extras/fontawesome-v6";

  // Stores
  import { useUserStore } from "@/stores/user";

  import { formatTimeAgo } from "@vueuse/core";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const { communityItems, entityKey } = defineProps<{
    communityItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const userStore = useUserStore();
  const { getImageURL, translate } = useUtilities(locale.value);

  function line1(item: CategoryTypes) {
    const name = `title` as keyof CategoryTypes;

    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }

  function handleEdit(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
      ),
      componentProps: { row: item, entityKey: entityKey }
    });
  }
</script>
