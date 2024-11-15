<template>
  <q-input
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-model="value"
    stack-label
    standout="bg-grey-7 text-white"
    :dark="false"
    :error-message="errorMessage"
    :error="!!errorMessage"
    :autocomplete="'new-password'"
  >
    <template v-slot:append>
      <q-icon
        :name="showPassword ? fasEye : fasEyeSlash"
        class="cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { fasEyeSlash, fasEye } from "@quasar/extras/fontawesome-v6";
  import { useField } from "vee-validate";

  // Props
  const { name } = defineProps<{
    name: string;
  }>();

  const showPassword = ref(false);

  const { errorMessage, value } = useField(name) as {
    errorMessage: Ref<string>;
    value: Ref<string | number | null | undefined>;
  };
</script>
