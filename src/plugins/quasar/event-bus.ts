import { EventBus } from "quasar";

// Create the event bus instance
export const eventBus = new EventBus();

// If you want to use TypeScript with typed events:
/*
export const eventBus = new EventBus<{
  'DialogClose': () => void;
  'DialogStatus': (status: boolean, emitter: string) => void;
  // Add other event types here
}>()
*/

// Create a Vue plugin
export const eventBusPlugin = {
  install: (app: any) => {
    // For Options API
    app.config.globalProperties.$bus = eventBus;

    // For Composition API
    app.provide("bus", eventBus);
  }
};
