<template>
  <q-card>
    <q-card-section :class="cardSectionClass" class="q-pa-sm">
      <q-item class="q-pb-none q-pt-xs">
        <q-item-section>
          <q-item-label class="text-h4 text-weight-medium" style="letter-spacing: 3px">
            {{ total }}
            <q-badge v-if="badgeLabel" color="primary" class="q-ml-xs" align="top">{{
              badgeLabel
            }}</q-badge>
          </q-item-label>
          <q-item-label class="text-subtitle1 text-bold" :class="itemLabelClass">
            {{ title }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon :name="icon" size="64px" :color="color"></q-icon>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs" style="min-height: unset">
        <q-item-section>
          <q-linear-progress
            rounded
            size="10px"
            :value="getPercentage"
            :color="color"
            class="q-mt-sm"
          />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed } from "vue";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  const props = defineProps({
    badgeLabel: {
      type: String,
      required: false,
      default: ""
    },
    color: {
      type: String
    },
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    total: {
      type: Number,
      required: false,
      default: 0
    },
    value: {
      type: Number,
      required: false,
      default: 0
    }
  });

  const $q = useQuasar();

  const getPercentage = computed(() => {
    return props.total !== 0 ? props.value / props.total : 1;
  });

  const cardSectionClass = computed(() => {
    return $q.dark.isActive ? "theme_color" : "";
  });

  const itemLabelClass = computed(() => {
    return $q.dark.isActive ? "text-white" : "text-grey-8";
  });
</script>
