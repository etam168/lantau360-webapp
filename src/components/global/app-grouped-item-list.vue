<template>
  <div class="q-pa-md">
    <div v-for="group in groupedArray" :key="group.group" class="q-mb-md">
      <div class="text-h6">{{ group.group }}</div>

      <q-list padding>
        <q-item
          clickable
          v-for="item in group.items"
          :key="item.directoryId"
          @click="handleItemClick(item)"
          class="shadow-1 q-pa-sm q-mb-md"
        >
          <q-item-section avatar>
            <q-avatar size="64px" square>
              <q-img ratio="1" :src="computePath(item.iconPath)">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Cannot load image
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
            <q-icon name="favorite" size="2em" color="red" class="favorite-icon" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { Site } from "@/interfaces/models/entities/site";
  import { useQuasar } from "quasar";

  const $q = useQuasar();

  type DirectoryTypes = Business | Site;

  const props = defineProps({
    listItems: {
      type: Array as PropType<DirectoryTypes[]>,
      default: () => [] as DirectoryTypes[]
    },
    groupKey: {
      type: String as PropType<GroupKeys>,
      default: "directoryName"
    }
  });

  const { groupBy, translate } = useUtilities();

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  // Define a type that includes all possible keys you want to group by
  type GroupKeys = keyof DirectoryTypes;

  const groupedArray = computed(() => {
    // Use the groupKey prop with a fallback to "directoryName"
    const key: GroupKeys = props.groupKey || "directoryName";
    return groupBy(
      props.listItems.filter(item => item[key] !== undefined),
      item => item[key] as string | number // Make sure the key exists on the item
    );
  });

  function line1(item: DirectoryTypes) {
    return translate(item.title, item.meta, "title");
  }

  function line2(item: DirectoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function handleItemClick(item: DirectoryTypes) {
    if ("siteId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Site
        }
      });
    } else if ("businessId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Business
        }
      });
    }
  }
</script>
