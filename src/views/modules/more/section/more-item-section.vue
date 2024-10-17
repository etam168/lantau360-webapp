<!-- MenuSection.vue -->
<template>
  <q-card-section class="q-pt-none q-qb-xl">
    <q-item class="shadow-1 q-mb-md q-pl-sm">
      <q-item-section avatar>
        <q-avatar size="36px" square>
          <img :src="icon" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">
          {{ $t(title) }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          dense
          flat
          round
          icon="mdi-chevron-right"
          @click="showDialog()"
          v-close-popup
        ></q-btn>
      </q-item-section>
    </q-item>
  </q-card-section>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";

  const { icon, name, title, contentKey = "" } = defineProps<{
    icon: any;
    name:any;
    title: any;
    contentKey?: any;
  }>();

  const emit = defineEmits(["on-dialog"]);

const showDialog = ()=> {
  emit("on-dialog", {name: name , title: title,contentKey: contentKey});
}
</script>
