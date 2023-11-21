<template>
  <q-item v-if="groupTitle">
    <q-item-label header class="q-px-none q-pb-none text-primary text-bold">{{
      $t(`route.groupTitle.${groupTitle}`)
    }}</q-item-label>
  </q-item>

  <div>
    <template v-if="routeList">
      <q-list class="column q-pa-none" dense>
        <template v-for="item in routeList" :key="item.title">
          <q-list class="column q-pa-none" v-if="item.children">
            <q-expansion-item
              :icon="getListIcon(item)"
              :label="$t(`${getListTitle(item)}`)"
              expand-icon="keyboard_arrow_down"
              dense
            >
              <template v-for="children in item.children" :key="children">
                <q-item
                  clickable
                  @click="navigateTo(children)"
                  active-class="q-item-no-link-highlighting"
                  dense
                >
                  <q-item-section avatar>
                    <q-icon :name="getListIcon(children)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t(`${getListTitle(children)}`) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
          </q-list>

          <q-item
            v-else
            clickable
            @click="navigateTo(item)"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon :name="getListIcon(item)" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ $t(`${getListTitle(item)}`) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { RouteRecordRaw, useRouter } from "vue-router";

  defineProps({
    groupTitle: {
      type: String,
      default: ""
    },
    routeList: {
      type: Array as () => RouteRecordRaw[],
      required: true
    }
  });

  const router = useRouter();

  const navigateTo = (routeData: any) => {
    // if (routeData.name === "PropertyListing") {
    //   routeData.path = "/property-listing";
    // }

    if (["Terms", "Privacy", "About"].includes(routeData.name)) {
      const queryString = { queryParam: getQueryParam(routeData) };
      router.push({ path: routeData.path, query: queryString });
    } else {
      router.push(routeData.path);
    }
  };
  const getListTitle = (item: RouteRecordRaw): string => {
    const { meta } = item;
    if (meta && meta.title) {
      return meta.title as string;
    }
    // Default title if none is provided in the route meta
    return "";
  };

  const getListIcon = (item: RouteRecordRaw): string => {
    const { meta } = item;
    if (meta && meta.icon) {
      return meta.icon as string;
    }
    // Default icon if none is provided in the route meta
    return "";
  };

  const getQueryParam = (item: RouteRecordRaw): string => {
    const { meta } = item;
    if (meta && meta.queryParam) {
      return meta.queryParam as string;
    }
    // Default icon if none is provided in the route meta
    return "";
  };
</script>
