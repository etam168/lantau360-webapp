<template>
  <div>
    <q-card class="q-mb-md">
      <q-item clickable v-ripple @click="createPosting">
        <q-item-section avatar>
          <q-avatar color="green-1" text-color="primary" :icon="fasPlus" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{
            $t(`${i18nKeyAction}.createDirectory`, { directoryName: directoryName })
          }}</q-item-label>
          <q-item-label caption>
            {{ $t(`${i18nKey}.createPost.addGalleryDescription`) }}
          </q-item-label></q-item-section
        >
      </q-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  import { fasPlus } from "@quasar/extras/fontawesome-v6";
  import { useUserStore } from "@/stores/user";

  // Props
  const { directoryName, directory } = defineProps<{
    directoryName: string;
    directory: DirectoryTypes;
  }>();

  const i18nKey = "community";
  const i18nKeyAction = "action";

  const $q = useQuasar();
  const userStore = useUserStore();

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
        item: directory as CommunityDirectory
      }
    });
  }
</script>
