<template>
  <q-item>
    <q-item-section>
      <q-card flat>
        <div class="q-py-md">
          <q-list bordered class="rounded-borders">
            <q-expansion-item group="siteGroup" dense dense-toggle default-opened>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar size="24px" color="primary" text-color="white">en</q-avatar>
                </q-item-section>

                <q-item-section> English </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <vee-input
                    name="postingName"
                    :label="$t('posting.columns.postingName')"
                    :maxlength="32"
                    stack-label
                  />
                  <vee-input
                    name="title"
                    :label="$t('posting.columns.title')"
                    :maxlength="25"
                    counter
                    stack-label
                  />

                  <template v-for="field in veeInputsForEnSubtitle" :key="field">
                    <vee-input
                      :name="field.name"
                      :auto-grow="true"
                      :maxlength="field.maxlength"
                      stack-label
                      :label="$t(field.label)"
                    />
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item group="siteGroup" dense dense-toggle>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar size="24px" color="primary" text-color="white">hk</q-avatar>
                </q-item-section>

                <q-item-section> 繁體版本 </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <vee-input
                    name="postingNameHk"
                    :label="$t('posting.columns.postingNameHk')"
                    :maxlength="50"
                    stack-label
                  />
                  <vee-input
                    name="titleHk"
                    :label="$t('posting.columns.titleHk')"
                    :maxlength="50"
                    counter
                    stack-label
                  />
                  <template v-for="field in veeInputsForHkSubtitle" :key="field">
                    <vee-input
                      :name="field.name"
                      :auto-grow="true"
                      :maxlength="field.maxlength"
                      stack-label
                      :label="$t(field.label)"
                    />
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item group="siteGroup" dense dense-toggle>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar size="24px" color="primary" text-color="white">cn</q-avatar>
                </q-item-section>

                <q-item-section> 简体版本 </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <vee-input
                    name="postingNameCn"
                    :label="$t('posting.columns.postingNameCn')"
                    :maxlength="50"
                    stack-label
                  />
                  <vee-input
                    name="titleCn"
                    :label="$t('posting.columns.titleCn')"
                    :maxlength="50"
                    counter
                    stack-label
                  />
                  <template v-for="field in veeInputsForCnSubtitle" :key="field">
                    <vee-input
                      :name="field.name"
                      :auto-grow="true"
                      :maxlength="field.maxlength"
                      stack-label
                      :label="$t(field.label)"
                    />
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card>
    </q-item-section>

    <q-item-section style="margin-top: 8px">
      <q-list dense>
        <q-item v-for="field in veeInputsForLatLng" :key="field.name">
          <q-item-section>
            <vee-input :name="field.name" :auto-grow="true" :label="$t(field.label)" />
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Contact Info -->
      <q-item-label header class="text-primary text-weight-bold">Contact Info:</q-item-label>
      <q-list dense>
        <q-item>
          <q-item-section>
            <vee-input
              :name="veeInputsForContactOther.name"
              stack-label
              :label="$t(veeInputsForContactOther.label)"
              :max-lenght="veeInputsForContactOther.maxLenght"
              :counter="true"
            />
          </q-item-section>
        </q-item>
        <template v-for="contact in veeInputsForContactInfo" :key="contact.name">
          <q-item>
            <q-item-section>
              <vee-q-tel-input
                :name="contact.name"
                :defaultIso="contact.defaultIso"
                :labelText="$t(contact.label)"
                :label="$t(contact.label)"
            /></q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <app-description-input :content-height="contentHeight" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  const contentHeight = ref("calc(50vh - 450px)");

  const veeInputsForEnSubtitle = ref([
    { name: "subtitle1", label: "posting.columns.subtitle1", maxlength: 50 },
    { name: "subtitle2", label: "posting.columns.subtitle2", maxlength: 50 },
    { name: "subtitle3", label: "posting.columns.subtitle3", maxlength: 50 }
  ]);

  const veeInputsForHkSubtitle = ref([
    { name: "subtitle1Hk", label: "posting.columns.subtitle1Hk", maxlength: 50 },
    { name: "subtitle2Hk", label: "posting.columns.subtitle2Hk", maxlength: 50 },
    { name: "subtitle3Hk", label: "posting.columns.subtitle3Hk", maxlength: 50 }
  ]);

  const veeInputsForCnSubtitle = ref([
    { name: "subtitle1Cn", label: "posting.columns.subtitle1Cn", maxlength: 50 },
    { name: "subtitle2Cn", label: "posting.columns.subtitle2Cn", maxlength: 50 },
    { name: "subtitle3Cn", label: "posting.columns.subtitle3Cn", maxlength: 50 }
  ]);

  const veeInputsForLatLng = ref([
    { name: "rank", label: "posting.columns.rank", type: "number" },
    { name: "latitude", label: "posting.columns.latitude", type: "number" },
    { name: "longitude", label: "posting.columns.longitude", type: "number" }
  ]);

  const veeInputsForContactOther = ref({
    name: "contactOther",
    label: "posting.columns.contactOther",
    icon: "person",
    maxLenght: 25
  });

  const veeInputsForContactInfo = ref([
    {
      name: "contactPhone",
      label: "posting.columns.contactPhone",
      icon: "phone",
      defaultIso: "hk"
    },
    {
      name: "contactWhatsApp",
      label: "posting.columns.contactWhatsApp",
      icon: "phone",
      defaultIso: "hk"
    }
  ]);
</script>
