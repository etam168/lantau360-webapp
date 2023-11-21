<template>
  <q-card flat class="my-card bg-white">
    <q-card-section :horizontal="$q.screen.gt.sm">
      <q-card-section class="col-4 q-pa-xl">
        <crud-grid-card-avatar-item
          :imageLink="imagePath"
          :name="name"
          :caption="caption"
          :recId="recId"
        />
        <q-item dense v-if="userStore.user == 'admin'">
          <q-btn class="q-ml-xl" flat color="red" label="Change Password" @click="updatePassword" />
        </q-item>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-4 q-pa">
        <q-list dense>
          <!-- roleCode -->
          <crud-grid-card-item
            icon="mdi-account-tie"
            :caption="$t('staff.columns.roleCode')"
            :label="roleCode"
          />

          <!-- email -->
          <crud-grid-card-item icon="mail" :caption="$t('staff.columns.email')" :label="email" />
          <!-- JoinDate -->
          <crud-grid-card-item
            icon="date_range"
            :caption="$t('staff.columns.joinDateTime')"
            :label="joinDateTime"
          />
        </q-list>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { date, useQuasar } from "quasar";
  import { useI18n } from "vue-i18n";
  import eventBus from "@/utils/event-bus";

  import { Staff } from "@/interfaces/models/entities/staff";

  // .ts files
  import api from "@/api/crud";
  import { useStaffInput } from "./../use-staff-input";
  import { useUserStore } from "@/stores/user";

  // Custom Components
  import CrudGridCardItem from "@/components/widgets/crud-grid-card-item.vue";
  import CrudGridCardAvatarItem from "@/components/widgets/crud-grid-card-banner.vue";
  import PasswordChangeDialog from "../shared/password-change-dialog.vue";
  import { BLOB_URL } from "@/constants";

  const props = defineProps({
    props: {
      type: Object
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const { setStaffInput } = useStaffInput();
  const isDialogVisible = ref();
  const userStore = useUserStore();

  const $q = useQuasar();
  // const rand = ref(Math.random());

  const rowData = computed(() => props?.props?.row as Staff);

  const name = computed(() => `${rowData.value.firstName} ${rowData.value.lastName}`);
  const recId = computed(() => `ID. ${rowData.value.staffId}`);
  const roleCode = computed(() => (rowData.value.roleCode ?? "").toString());

  const email = computed(() => (rowData.value.email ?? "").toString());
  // const fabOption = computed(() => FabOption.EDIT);

  const caption = computed(() =>
    t("staff.columns.joinYear", { joinYear: date.formatDate(rowData.value.createdAt, "YYYY") })
  );

  const joinDateTime = computed(() => date.formatDate(rowData.value.createdAt, "YYYY-MM-DD"));

  function updatePassword() {
    $q.dialog({
      component: PasswordChangeDialog,
      componentProps: {
        username: rowData.value.userName
      }
    });
  }

  const imagePath = computed(() => {
    if (rowData.value?.imagePath) {
      return `${BLOB_URL}/${rowData.value.imagePath}`;
    }
    return "";
  });

  onMounted(() => {
    setStaffInput(rowData.value as unknown as Staff);

    eventBus.on("CloseStaffDilaog", () => {
      isDialogVisible.value = false;
    });
  });
</script>
