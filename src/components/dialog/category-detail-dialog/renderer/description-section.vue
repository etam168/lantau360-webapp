<template>
  <!-- Conditionally render the scroll area based on content overflow -->
  <q-scroll-area :style="{ height: scrollAreaHeight + 'px' }" v-if="shouldShowScroll">
    <q-item class="no-padding no-wrap">
      <q-item-label>
        <div ref="contentRef" v-html="translatedContent"></div>
      </q-item-label>
    </q-item>
  </q-scroll-area>

  <!-- Fallback for small content -->

  <q-item class="no-padding" v-else>
    <q-item-label>
      <div v-html="translatedContent"></div>
    </q-item-label>
  </q-item>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  // Utilities and reactive variables
  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);

  const translatedContent = ref(translate(category.description, category.meta, "description"));

  const scrollAreaHeight = ref(0); // Reactive variable for scroll area height
  const shouldShowScroll = ref(false); // Flag to determine if the scroll area is needed

  const contentRef = ref<HTMLDivElement | null>(null); // Reference to the content div

  // Function to calculate and update height dynamically
  const updateScrollAreaHeight = () => {
    const reservedSpace = 262.75; // Space taken by other elements
    const availableHeight = window.innerHeight - reservedSpace;

    if (contentRef.value) {
      const contentHeight = contentRef.value.offsetHeight;
      shouldShowScroll.value = contentHeight > availableHeight;
      scrollAreaHeight.value = shouldShowScroll.value ? availableHeight : contentHeight;
    }
  };

  // Watch for changes in `translatedContent` and recheck
  watch(translatedContent, () => {
    updateScrollAreaHeight();
  });

  // Lifecycle hooks
  onMounted(() => {
    updateScrollAreaHeight(); // Initial check for overflow and height
    window.addEventListener("resize", updateScrollAreaHeight); // Recalculate on resize
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScrollAreaHeight); // Clean up listener
  });
</script>
