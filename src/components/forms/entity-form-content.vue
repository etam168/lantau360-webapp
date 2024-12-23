<!--
  @file: entity-form-content.vue
  @description: A reusable Vue component that renders a form based on a provided form structure.
  @props:
    - entityKey: The key identifying the entity type
    - formStructure: The structure defining the form fields and sections
-->
<template>
  <template v-if="formStructure">
    <!-- Localization section -->
    <q-card flat>
      <q-expansion-item
        v-for="(lang, index) in formStructure.localizedSection!.languages"
        :key="lang.code"
        :group="`${entityKey}Group`"
        dense
        dense-toggle
        :default-opened="index === 0"
        class="custom-expansion-item"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar size="24px" color="primary" text-color="white">{{ lang.code }}</q-avatar>
          </q-item-section>
          <q-item-section>{{ lang.name }}</q-item-section>
        </template>

        <q-card>
          <q-item v-for="field in lang.fields" :key="field.name">
            <q-item-section>
              <vee-input
                :auto-grow="true"
                :name="field.name"
                :label="$t(field.label as string)"
                :maxlength="field.maxlength"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-card>

    <!-- Entity fields -->
    <q-list v-for="(section, index) in formStructure.entityFields!.sections" :key="index" dense>
      <q-item v-for="field in section.fields" :key="field.name" dense>
        <q-item-section v-for="subField in field.subFields" :key="subField.name">
          <!-- Render telephone input for 'tel' type fields -->

          <template v-if="subField.type === 'tel'">
            <vee-q-tel-input
              defaultIso="HK"
              :name="subField.name"
              :label="$t(subField.label as string)"
            />
          </template>

          <vee-gallery-images
            v-else-if="subField.type === 'gallery'"
            :name="subField.name"
            :options="getOptionsForField(subField.name)"
          />

          <vee-avatar
            v-else-if="subField.type === 'avatar'"
            :name="subField.name"
            :options="getOptionsForField(subField.name)"
          />

          <template v-else-if="subField.type === 'password'">
            <vee-input-password
              v-if="mode == 0"
              :label="$t(subField.label!)"
              :name="subField.name"
            />
          </template>

          <!-- Render standard input for all other field types -->
          <template v-else>
            <vee-input
              :auto-grow="true"
              :name="subField.name"
              :label="$t(subField.label as string)"
              :maxlength="subField.maxlength"
              :type="subField.type"
              :icon="subField.icon"
            />
          </template>
        </q-item-section>
      </q-item>
    </q-list>
  </template>
</template>

<script setup lang="ts">
  // Import types
  import type { FormStructure } from "@/interfaces/types/form-structure-types";
  import { EntityURLKey } from "@/constants";

  // Props
  const {
    entityKey,
    entityOptions = {},
    formStructure,
    mode = 0
  } = defineProps<{
    entityKey: EntityURLKey;
    entityOptions?: Record<string, any>;
    formStructure: FormStructure;
    mode?: Number;
  }>();

  const getOptionsForField = (fieldName: string): any => {
    if (entityOptions && fieldName in entityOptions) {
      return entityOptions[fieldName];
    }
    return {};
  };
</script>

<style lang="scss">
  // Custom styles for expansion items
  .custom-expansion-item {
    &:not(.q-expansion-item--expanded) {
      .q-expansion-item__container > .q-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }

    &:last-child:not(.q-expansion-item--expanded) {
      .q-expansion-item__container > .q-item {
        border-bottom: none;
      }
    }
  }
</style>
