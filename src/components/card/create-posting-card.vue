<template>
  <div>
    <q-card class="q-mb-md">
      <q-item clickable v-ripple @click="createPosting">
        <q-item-section avatar>
          <q-avatar color="green-1" text-color="primary" icon="add" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{
            $t("action.createDirectory", { directoryName: directoryName })
          }}</q-item-label>
          <q-item-label caption>{{
            $t("community.createPost.addGalleryDescription")
          }}</q-item-label></q-item-section
        >
      </q-item>
    </q-card>
  </div>
</template>
<script setup lang="ts">
  // .ts files

  defineProps({
    directoryName: {
      type: String,
      required: false
    }
  });
  const emit = defineEmits(["create-posting"]);

  function createPosting() {
    emit("create-posting");
  }
</script>
