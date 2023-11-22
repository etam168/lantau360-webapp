<!-- feature-listing.vue -->
<template>
  <q-card-section class="text-center">
    <div class="text-h5 text-weight-Medium">{{ $t("home.featuredSection.slogan") }}</div>
  </q-card-section>

  <q-card-section class="text-center">
    <div class="text-subtitle1">{{ $t("home.featuredSection.title") }}</div>
  </q-card-section>

  <div v-if="data != null">
    <div class="q-px-md">
      <q-virtual-scroll
        ref="virtualScroll"
        :items="data"
        :virtual-scroll-item-size="360"
        virtual-scroll-horizontal
        @virtual-scroll="onVirtualScroll"
      >
        <template v-slot="{ item: row }">
          <div class="q-pa-sm" style="width: 360px">
            <listing-card :row="row" @on-contact="handleContact" @on-detail="handleDetail" />
          </div>
        </template>
      </q-virtual-scroll>

      <div class="row justify-center q-my-lg">
        <q-btn icon="chevron_left" @click="scrollLeft" />
        <q-btn icon="chevron_right" @click="scrollRight" class="q-ml-sm" />
      </div>
    </div>
  </div>
  <div v-else>
    <h3>Error:</h3>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, inject, PropType, Ref, ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  // .ts file
  import { PropertyListingDatatable } from "@/interfaces/datatable/property-listing-datatable";
  import { RequestMessage } from "@/interfaces/models/entities/request-message";

  // Custom Components
  import ListingCard from "@/components/cards/listing-card.vue";

  const router = useRouter();

  const props = defineProps({
    data: {
      type: Array as PropType<PropertyListingDatatable[]>,
      required: false,
      default: null
    }
  });

  const messageList = inject("messageList") as Ref<RequestMessage[]>;
  const message = ref(messageList?.value ?? []);
  const messageDropdown = ref();

  message.value.sort((a: any, b: any) =>
    String(a.messageText).localeCompare(String(b.messageText))
  );

  messageDropdown.value = message.value.map((group: any) => {
    return {
      value: group.requestMessageId,
      label: group.messageText
    };
  });

  const $q = useQuasar();

  const virtualScroll = ref(null);
  const virtualScrollIndex = ref(0);

  function onVirtualScroll(detail: any) {
    virtualScrollIndex.value = detail.index;
  }

  function scrollLeft() {
    if (virtualScroll.value && virtualScrollIndex.value > 0) {
      virtualScrollIndex.value -= 1;
      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "end-force");
    }
  }

  function scrollRight() {
    if (virtualScroll.value && virtualScrollIndex.value < props.data.length - 1) {
      virtualScrollIndex.value += 1;
      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "start-force");
    }
  }

  function handleContact(data: PropertyListingDatatable) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialogs/contact-dialog.vue")),
      componentProps: {
        row: data,
        messageList: messageList
      }
    });
  }

  function handleDetail(data: PropertyListingDatatable) {
    router.push({ name: "property-detail", params: { id: data.propertyListingId } });
  }
</script>
