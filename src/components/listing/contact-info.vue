<template>
  <q-card style="width: 360px">
    <q-card-section>
      <div class="text-h6">{{ $t("contact.title") }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section class="q-px-lg">
      <q-field
        v-for="(info, index) in contactInfo"
        :key="index"
        :label="$t(info.label)"
        stack-label
        bottom-slots
      >
        <template v-slot:before>
          <q-avatar :color="info.color" text-color="grey-9" :icon="info.icon" size="36px" />
        </template>
      </q-field>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  const contactInfo = [
    {
      label: "contact.name",
      color: "grey-3",
      icon: "mdi-account-tie"
    },
    {
      label: "contact.phone",
      color: "grey-3",
      icon: "mdi-phone"
    },
    {
      label: "contact.whatsapp",
      color: "grey-3",
      icon: "mdi-whatsapp"
    },
    {
      label: "contact.email",
      color: "grey-3",
      icon: "mdi-email"
    }
  ];
</script>
