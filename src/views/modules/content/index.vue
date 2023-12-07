<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        @update:model-value="updateDialogState"
        :model-value="isDialogVisible"
        maximized
      >
        <q-card style="max-width: 1024px">
          <q-layout view="hHh lpR fFf">
            <q-card-actions align="center" class="button-margin">
              <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
              <q-space />
              <app-page-title>{{ $t(`content.title.${contentName}`) }}</app-page-title>
              <q-space />
            </q-card-actions>
            <content-input :contentName="contentName" />
          </q-layout>
        </q-card>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="10em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  //import { useRoute } from "vue-router";
  // Custom Components
  import { useDialogPluginComponent } from "quasar";
  import AppSpinner from "@/components/widgets/app-spinner.vue";
  import eventBus from "@/utils/event-bus";

  const props = defineProps({
    contentNameValue: {
      type: String as PropType<any>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );

  const ContentInput = defineAsyncComponent({
    loader: () => import("./content-input.vue"),
    delay: 500
  });

  // Access the route and retrieve the contentName parameter
  //const route = useRoute();
  //const queryParam = route.meta.queryParam as string;

  // Create a computed property for contentName
  const contentName = computed(() => {
    switch (props.contentNameValue) {
      case "Terms":
      case "Privacy":
      case "About":
        return props.contentNameValue;
      default:
        return "default";
    }
  });

  onMounted(() => {
    eventBus.on("ContentDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ContentDialog");
  }
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
