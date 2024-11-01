<template>
  <q-card v-for="(item, index) in memberItems" :key="index" class="q-ma-md">
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item clickable @click="handleDetail(item)">
          <q-item-section avatar>
            <q-avatar size="64px" circle>
              <q-img ratio="1" :src="computeIconPath(item)">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    {{ $t("errors.cannotLoadImage") }}
                  </div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <!-- <q-item-label> {{ line1(item) }} </q-item-label> -->
            <q-item-label>{{ item.siteName }}</q-item-label>
            <q-item-label lines="2"
              >{{
                $t("more.checkin.lastCheckIn", {
                  date: dateFormatter(item.modifiedAt)
                })
              }}
            </q-item-label>
            <!-- <q-item-label>{{ item.siteName }}</q-item-label> -->

            <!-- <q-item-label lines="2"
          >{{
            $t("more.checkIn.lastCheckIn", {
              date: dateFormatter(item.modifiedAt)
            })
          }}
        </q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { BLOB_URL, EntityURLKey } from "@/constants";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  const { getEntityName, getImageURL, translate, dateFormatter } = useUtilities();

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

  const computeIconPath = (item: any) => {
    return item.iconPath ? `${BLOB_URL}/${item.iconPath}` : "./img/icons/no_image_available.jpeg";
  };
  function handleDetail(item: any) {
    emits("on-member-detail", item);
  }
</script>
