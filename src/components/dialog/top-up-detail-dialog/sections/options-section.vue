<template>
  <q-item class="column items-center">
    <q-card
      v-for="(item, index) in topUpDetail"
      :key="index"
      bordered
      class="q-ma-md q-pa-md text-center bg-grey-1"
      style="width: 600px"
    >
      <q-card-section>
        <div class="text-h6">{{ item.title }}</div>
        <div class="text-subtitle1">{{ item.subtitle }}</div>
        <div class="text-body2 text-justify q-mt-md">{{ item.description }}</div>
        <!-- <p v-if="error" class="text-red">{{ item.error }}</p> -->
        <q-btn color="primary" class="q-mt-md">{{ item.buttonText }}</q-btn>
      </q-card-section>
    </q-card>
  </q-item>
</template>

<script setup lang="ts">
  const topUpDetail = computed(() => {
    return [
      {
        title: "Option 1",
        subtitle: "Free top-up points",
        description:
          "Claim 100 free points to publish a post in the community. Users have the opportunity to claim free points once a month, allowing them to participate and share their thoughts and content without any cost",
        buttonText: "CLAIM YOUR FREE POINT",
        error: "You have already claimed your 100 free points for this month.",
        type: "option"
      },
      {
        title: "Option 2",
        subtitle: "Purchase top-up points",
        description:
          "Purchase points to gain the ability to publish posts in the community module. By buying points, users can actively participate and share their thoughts, ideas, and content with the community",
        buttonText: "PURCHASE",
        type: "option"
      }
    ];
  });
</script>
