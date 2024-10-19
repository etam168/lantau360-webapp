<template>
  <q-list>
    <pre>{{ communityItems }}</pre>
    <q-item
      clickable
      @click="handleDetail(item)"
      v-for="(item, index) in communityItems"
      :key="index"
    >
      <q-item-section avatar>
        <q-avatar size="64px" square>
          <q-img ratio="1" :src="getImageURL(item.iconPath)">
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

  const { getEntityName, getImageURL, translate } = useUtilities();

  const emits = defineEmits(["on-category-detail"]);

  // Props
  const { communityItems, entityKey } = defineProps<{
    communityItems: CategoryTypes[];
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
    emits("on-category-detail", item);
  }
</script>
