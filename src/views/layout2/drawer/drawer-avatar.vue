<template>
  <q-card square flat class="q-pa-lg">
    <q-item class="column items-center q-pa-none">
      <q-item-section avatar class="q-pa-none">
        <q-btn outline round color="primary">
          <q-avatar size="96px" font-size="36px" text-color="primary">
            <q-img :src="avatar" />
          </q-avatar>
        </q-btn>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-medium text-subtitle1 q-mt-sm">
          {{ $t("staff.userName", { userName: userName }) }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  // Vue Import
  //import { computed } from "vue";
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";

  // .ts files
  import api from "@/api/crud";
  import { useUserStore } from "@/stores/user";

  defineProps({
    userName: {
      type: String,
      required: true
    }
  });
  const userStore = useUserStore();

  const userId = ref(userStore.userId);

  const avatar = computed(() => {
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });

  //const avatar = ref(PLACEHOLDER_AVATAR);

  async function getStaffImage() {
    const url = `/Staff/${userId.value}`;
    try {
      const data = await api.get(url);

      const meta = data.data.meta;
      avatar.value = meta.imagePath;
    } catch (e) {
      // console.log(e);
    }
  }

  onMounted(() => {
    getStaffImage();
  });
</script>
