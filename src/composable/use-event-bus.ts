import { ref } from "vue";
import { EventBus } from "quasar";

const bus = ref(new EventBus());

export default function useEventBus() {
  return {
    bus
  };
}
