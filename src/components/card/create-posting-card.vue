<template>
  <div>
    <q-card class="q-mb-md">
      <q-item clickable v-ripple @click="createPosting">
        <q-item-section avatar>
          <q-avatar color="green-1" text-color="primary" :icon="fasPlus" />
          <!-- <q-avatar color="green-1" text-color="primary" icon="fa-solid fa-plus" /> -->
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
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { useUserStore } from "@/stores/user";

  import { fasPlus } from "@quasar/extras/fontawesome-v6";

  const userStore = useUserStore();
  const $q = useQuasar();

  const props = defineProps({
    directoryName: {
      type: String,
      required: false
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  function createPosting() {
    if (!userStore.isUserLogon()) {
      // User is not logged in, open the login dialog
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/views/modules/community/login-alert-dialog.vue")
        )
      });

      return;
    }

    // Check whether user have required point to create post
    if (userStore.availabelPoints < userStore.pointsPerPost) {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/views/modules/community/alert-dialog.vue"))
      });
      return;
    }

    // User is logged in and also have required points to create new post
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/views/modules/community/point-usage-confirmation-dialog.vue")
      ),
      componentProps: {
        item: props.directory as CommunityDirectory
      }
    });
  }
</script>
