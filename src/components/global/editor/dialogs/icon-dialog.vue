<template>
  <q-dialog ref="dialogRef">
    <q-card style="width: 500px">
      <q-card-section class="text-left">
        <q-card-title class="text-h6">Add Icon</q-card-title>
        <q-separator />

        <q-input
          class="q-mt-md"
          v-model="icon"
          label="FontAwesome Icon (fa-solid fa-house)"
          dense
          outlined
        ></q-input>
        <q-item class="q-px-none q-mt-sm">
          <q-item-label class="text-subtitle1 q-mr-md q-mt-sm">Color</q-item-label>

          <q-btn-dropdown :style="dropdownStyle">
            <q-color v-model="selectedColor" style="max-width: 250px" />
          </q-btn-dropdown>
        </q-item>

        <q-checkbox dense class="q-my-sm" v-model="addLinkChk" label="Add Link"></q-checkbox>

        <q-input v-model="link" label="Link" dense outlined :disable="!addLinkChk"></q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" color="negative" @click="cancel"></q-btn>
        <q-btn label="Done" color="positive" @click="done"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  const props = defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();

  const icon = ref("");
  const link = ref("");
  const addLinkChk = ref(false);
  const selectedColor = ref("#213454");

  const dropdownStyle = computed(() => {
    return `background-color: ${selectedColor.value};width: 250px;color: ${selectedColor.value}`;
  });

  const iconStyle = computed(() => {
    return `text-decoration: none; color:${selectedColor.value}`;
  });

  const cancel = () => {
    onDialogCancel();
  };

  const done = () => {
    const linkValue = link.value.trim() != "" ? link.value : null;
    props.callback(icon.value, iconStyle.value, linkValue);
    onDialogCancel();
  };
</script>
