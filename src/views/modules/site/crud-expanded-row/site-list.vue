<template>
  <q-card class="shadow-6" style="border-radius: 12px">
    <q-item class="q-pa-sm">
      <q-item-section top avatar>
        <q-avatar
          size="60px"
          rounded
          style="border-radius: 10px; border: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <img :src="rowData?.iconPath" />
        </q-avatar>
      </q-item-section>

      <q-item-section top class="q-mt-md">
        <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
          rowData?.siteName
        }}</q-item-label>
        <q-item-label class="text-caption" lines="1" style="font-family: baloo">
          {{ rowData?.subtitle1 }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
  <div class="text-h6 text-weight-regular q-my-sm">Contact Detail</div>
  <q-card class="shadow-6" style="border-radius: 12px">
    <q-card-section class="q-pa-none">
      <q-item class="q-pa-sm">
        <q-item-section>
          <q-icon name="mdi-phone-in-talk" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("site.columns.contactPhone")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData?.contactPhone }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="mdi-whatsapp" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("site.columns.contactWhatsApp")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData?.contactWhatsApp }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
  <div class="text-h6 text-weight-regular q-my-sm">Latitude & Longitude</div>
  <q-card class="shadow-6" style="border-radius: 12px">
    <q-card-section class="q-pa-none">
      <q-item class="q-pa-sm">
        <q-item-section>
          <q-icon name="mdi-latitude" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("site.columns.latitude")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData?.latitude }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="mdi-longitude" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("site.columns.longitude")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData?.longitude }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  defineProps({
    rowData: {
      type: Object
    }
  });
</script>
