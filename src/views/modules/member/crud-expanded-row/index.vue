<template>
  <q-card flat class="my-card bg-white">
    <q-card-section :horizontal="$q.screen.gt.sm">
      <q-card-section class="col-4 q-pa-xl">
        <crud-grid-card-avatar-item
          :imageLink="imageLink"
          :name="name"
          :caption="caption"
          :recId="recId"
        />

        <q-item dense v-if="userStore.user == 'cs_admin'">
          <q-btn class="q-ml-xl" flat color="red" label="Change Password" @click="updatePassword" />
        </q-item>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-4 q-pa">
        <q-list dense>
          <!-- phone -->
          <crud-grid-card-item
            icon="phone_iphone"
            :caption="$t('member.columns.phone')"
            :label="phone"
          />

          <!-- email -->
          <crud-grid-card-item icon="mail" :caption="$t('member.columns.email')" :label="email" />

          <!-- JoinDate -->
          <crud-grid-card-item
            icon="date_range"
            :caption="$t('member.columns.joinDateTime')"
            :label="joinDateTime"
          />
        </q-list>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { date, useQuasar } from "quasar";
  import { useI18n } from "vue-i18n";

  import { BASE_URL } from "@/constants";
  import { Member } from "@/interfaces/models/entities/member";

  // Custom Components
  import CrudGridCardItem from "@/components/widgets/crud-grid-card-item.vue";
  import CrudGridCardAvatarItem from "@/components/widgets/crud-grid-card-banner.vue";
  import { useUserStore } from "@/stores/user";
  import PasswordChangeDialog from "../shared/password-change-dialog.vue";

  const props = defineProps({
    props: {
      type: Object
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();

  const $q = useQuasar();
  const rand = ref(Math.random());

  const rowData = computed(() => props?.props?.row as Member);

  const name = computed(() => `${rowData.value.firstName} ${rowData.value.lastName}`);
  const recId = computed(() => `ID. ${rowData.value.memberId}`);
  const phone = computed(() => (rowData.value.phone ?? "").toString());
  // const fabOption = computed(() => FabOption.EDIT);
  const email = computed(() => (rowData.value.email ?? "").toString());

  const caption = computed(() =>
    t("member.columns.joinYear", { joinYear: date.formatDate(rowData.value.createdAt, "YYYY") })
  );

  const joinDateTime = computed(() => date.formatDate(rowData.value.createdAt, "YYYY-MM-DD"));

  const imageLink = computed(
    () => `${BASE_URL}/MemberImage/${rowData.value.memberId}?t=${rand.value}`
  );

  function updatePassword() {
    $q.dialog({
      component: PasswordChangeDialog,
      componentProps: {
        username: rowData.value.email
      }
    });
  }
</script>
