<template>
  <q-card-section style="max-width: 720px">
    <q-list>
      <q-item-label class="text-weight-bold text-subtitle1 text-black" header>{{
        $t("settings.personalize.headline")
      }}</q-item-label>

      <q-item>
        <q-item-section top>
          <q-item-label>{{ $t("settings.personalize.lang") }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <language-select class="q-mr-md" @on-language="onLanguageChange" />
        </q-item-section>
      </q-item>

      <!-- <q-item v-show="isAdmin">
        <q-item-section top>
          <q-item-label>{{ $t("settings.listing.retentionRent") }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <retention-period-select
            class="q-mr-md"
            @on-update="onUpdatePeriod"
            :is-rent="true"
            :selectedOption="listingRetentionPeriodRent"
          />
        </q-item-section>
      </q-item> -->
      <!-- <q-item v-show="isAdmin">
        <q-item-section top>
          <q-item-label>{{ $t("settings.listing.retentionSell") }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <retention-period-select
            class="q-mr-md"
            @on-update="onUpdatePeriod"
            :is-rent="false"
            :selectedOption="listingRetentionPeriodSell"
          />
        </q-item-section>
      </q-item> -->
    </q-list>
  </q-card-section>
</template>

<script setup lang="ts">
  // Vue Import
  //import { inject, Ref, computed, ref } from "vue";
  import LanguageSelect from "@/components/language-select.vue";
  //import RetentionPeriodSelect from "@/components/custom/retention-period-select.vue";
  import { useI18n } from "vue-i18n";
  //import { Content } from "@/interfaces/content";
  //import { useUserStore } from "@/stores/user";

  const { locale } = useI18n({ useScope: "global" });

  //const userStore = useUserStore();

  //const roles = ref(userStore.roles);
  //const settingsContent = inject("settingsContent") as Ref<Content>;

  const emit = defineEmits(["update-language", "update-period"]);

  // const isAdmin = computed(() => {
  //   return (roles.value as Array<string>).includes("admin");
  // });

  // const listingRetentionPeriodRent = computed(() => {
  //   if (settingsContent != null) {
  //     return settingsContent?.value?.meta["listing_retention_period_rent"] as string;
  //   }
  //   return "";
  // });

  // const listingRetentionPeriodSell = computed(() => {
  //   if (settingsContent != null) {
  //     return settingsContent?.value?.meta["listing_retention_period_sell"] as string;
  //   }
  //   return "";
  // });

  function onLanguageChange() {
    emit("update-language", locale.value);
  }

  // function onUpdatePeriod(period: string, isRent: boolean) {
  //   emit("update-period", period, isRent);
  // }
</script>
