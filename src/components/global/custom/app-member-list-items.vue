<template>
  <q-list>
    <q-item clickable @click="handleDetail(item)" v-for="(item, index) in memberItems" :key="index">
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
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { EntityURLKey } from "@/constants";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  const { getEntityName, getImageURL, translate } = useUtilities();

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { memberItems, entityKey } = defineProps<{
    memberItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const entityName = getEntityName(entityKey);

  const items = computed(() => {
    switch (entityKey) {
      case "POSTING":
        return ["posting"];
      default:
        return ["N/A"];
    }
  });

  function line1(item: CategoryTypes) {
    const name = `${entityName}Name` as keyof CategoryTypes;

    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function handleDetail(item: any) {
    emits("on-member-detail", item);
  }
</script>
