<template>
  <div class="q-pa-md">
    <div v-for="(items, groupName) in groupedArray" :key="groupName">
      <!-- Display group name -->
      <q-item-label class="text-weight-medium text-h6">{{ items.group }}</q-item-label>
      <q-list padding>
        <q-item
          clickable
          v-for="item in items.items"
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
  // Quasar Import
  import { useQuasar } from "quasar";

  // interface files
  // .ts file
  import { BLOB_URL } from "@/constants";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const $q = useQuasar();

  const props = defineProps({
    listItems: {
      type: Array as PropType<CategoryTypes[]>,
      default: () => [] as CategoryTypes[]
    },
    groupBykey: {
      type: String,
      required: false
    }
  });
  // type GroupKeys = keyof CategoryTypes;

  const { groupBy, translate } = useUtilities();

  const groupedArray = computed(() => {
    const key = "directoryName";
    return groupBy(
      props.listItems.filter(item => item[key] !== undefined),
      (item: any) => item[key] as string | number // Make sure the key exists on the item
    );
  });

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "./img/icons/no_image_available.jpeg";
  };

  function line1(item: CategoryTypes) {
    return translate(item.title, item.meta, "title");
  }

  function line2(item: CategoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  async function handleItemClick(item: CategoryTypes) {
    let directoryData;

    try {
      // Make an API call to fetch data based on item's directoryId
      const response = await axios.get(`Directory/${item.directoryId}`);
      directoryData = response.data; // Assuming the API response contains the data you need
    } catch (error) {
      console.error("Error fetching directory data:", error);
      // Handle error scenarios here
      return;
    }
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item,
        directory: directoryData
      }
    });
  }
</script>
