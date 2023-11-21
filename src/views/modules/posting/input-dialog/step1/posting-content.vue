<template>
  <q-card-section class="q-pa-none row justify-between">
    <q-field
      class="q-pb-md"
      filled
      readonly
      disable
      stack-label
      color="green"
      :label="$t('posting.columns.id')"
      style="width: 48.5%"
    >
      <template v-slot:control>
        <div class="self-center full-width no-outline" tabindex="0">
          {{ postingInput.postingId }}
        </div>
      </template>
    </q-field>

    <q-select
      emit-value
      initial
      outlined
      map-options
      color="green"
      options-dense
      options-selected-class="bg-green-1"
      style="width: 48.5%; height: 50px"
      v-model="postingInput.directoryId"
      :options="directoryDropdown"
      :label="$t('posting.columns.directory')"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption
              ><q-badge color="green-2" text-color="black" :label="scope.opt.value"
            /></q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </q-card-section>

  <app-input-outlined
    class="q-mb-sm"
    v-model="postingInput.postingName"
    :initialValue="postingInput.postingName"
    counter
    maxlength="32"
    name="postingName"
    :label="$t('posting.columns.postingName')"
  />
  <app-input-outlined
    class="q-mb-sm"
    v-model="postingInput.title"
    :initialValue="postingInput.title"
    counter
    maxlength="25"
    name="title"
    :label="$t('posting.columns.title')"
  />

  <q-card-section class="q-pa-none row justify-between">
    <app-input-outlined
      class="q-mb-sm"
      v-model="postingInput.subtitle1"
      :initialValue="postingInput.subtitle1"
      counter
      maxlength="32"
      name="subtitle1"
      style="width: 48%"
      :label="$t('posting.columns.subtitle1')"
    />
    <app-input-outlined
      class="q-mb-sm"
      v-model="postingInput.subtitle2"
      :initialValue="postingInput.subtitle2"
      counter
      maxlength="32"
      name="subtitle2"
      style="width: 48%"
      :label="$t('posting.columns.subtitle2')"
    />
    <app-input-outlined
      class="q-mb-sm"
      v-model="postingInput.subtitle3"
      :initialValue="postingInput.subtitle3"
      counter
      maxlength="32"
      name="subtitle3"
      style="width: 48%"
      :label="$t('posting.columns.subtitle3')"
    />

    <app-input-outlined
      class="q-mb-sm"
      v-model="postingInput.status"
      :initialValue="postingInput.status"
      name="status"
      type="number"
      style="width: 48%"
      :label="$t('posting.columns.status')"
    />

    <app-input-outlined
      v-model="postingInput.latitude"
      :initialValue="postingInput.latitude"
      type="number"
      name="latitude"
      style="width: 48%"
      :label="$t('posting.columns.latitude')"
    />

    <app-input-outlined
      v-model="postingInput.longitude"
      :initialValue="postingInput.longitude"
      type="number"
      name="longitude"
      style="width: 48%"
      :label="$t('posting.columns.longitude')"
    />
  </q-card-section>

  <app-input-outlined
    counter
    maxlength="16"
    name="locationName"
    v-model="locationName"
    :label="$t('posting.columns.locationName')"
  />

  <q-card-section class="q-pa-none row justify-between">
    <app-input-outlined
      v-model="postingInput.contactWhatsApp"
      name="contactWhatsapp"
      style="width: 48%"
      mask="#########"
      :label="$t('posting.columns.whatsApp')"
    />

    <app-input-outlined
      v-model="postingInput.contactPhone"
      name="contactPhone"
      mask="#########"
      style="width: 48%"
      :label="$t('posting.columns.phone')"
    />
  </q-card-section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, onMounted, PropType, ref, watch } from "vue";

  // .ts file
  import usePostingInput from "../use-posting-input";
  import { Directory } from "@/interfaces/directory";

  export default defineComponent({
    name: "InputDialogStep1",

    props: {
      directory: {
        type: Array as PropType<Directory[]>
      }
    },

    components: {
      AppInputOutlined: defineAsyncComponent(
        () => import("@/components/widgets/app-input-outlined.vue")
      )
    },

    setup(props) {
      const { postingInput } = usePostingInput();
      const directoryDropdown = ref([]);
      const directories = ref(props.directory);
      const locationName = ref(null);

      watch(locationName, () => {
        postingInput.value.meta ??= {};
        postingInput.value.meta["locationName"] = locationName.value;
      });

      onMounted(() => {
        // Initialize localization values for input
        postingInput.value.meta = postingInput.value.meta ?? {};
        locationName.value = postingInput.value.meta?.locationName ?? null;
      });

      directories.value.sort((a, b) => a.directoryName.localeCompare(b.directoryName));
      directoryDropdown.value = directories.value.map(group => {
        const directoryData = {
          value: 0,
          label: ""
        };

        directoryData.value = group.directoryId;
        directoryData.label = group.directoryName;
        return directoryData;
      });

      return {
        postingInput,
        directoryDropdown,
        locationName
      };
    }
  });
</script>
