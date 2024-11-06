<template>
  <q-list class="q-list q-px-md q-pt-md q-pb-none">
    <q-item v-for="(item, index) in communityItems" :key="index" class="shadow-1 q-pa-sm q-mb-md">
      <q-item-section avatar>
        <q-avatar size="64px" circle>
          <q-img ratio="1" :src="getImageURL((item as PostingView).memberImage)">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                {{ $t("errors.cannotLoadImage") }}
              </div>
            </template>
          </q-img>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label> {{ line1(item) }} </q-item-label>
        <q-item-label> {{ line2(item) }} </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            class="gt-xs"
            size="xs"
            dense
            flat
            :icon="fasCircleInfo"
            @click="handleDetail(item)"
          />
          <q-btn
            class="gt-xs"
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
  </q-list>
</template>

<script setup lang="ts">
  import { fasCircleInfo, fasPencil } from "@quasar/extras/fontawesome-v6";
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { EntityURLKey } from "@/constants";
  import { PostingView } from "@/interfaces/models/views/posting-view";
  import { useUserStore } from "@/stores/user";

  const { getImageURL, translate } = useUtilities();

  const emits = defineEmits(["on-category-detail"]);

  // Props
  const { communityItems, entityKey } = defineProps<{
    communityItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const userStore = useUserStore();
  const roles = ref(userStore.roles);

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
