/**
 * @file form-mappers-store-new.ts
 * @description Pinia store for managing form mappers. Dynamically loads and handles
 * form mappers for various entity types.
 * Provides centralized state management for form-related operations across the application.
 */

// Store and type imports
import type { FormMappersStore } from "@/interfaces/stores/form-mappers-store";

import { defineStore } from "pinia";
import { EntityURLKey } from "@/constants";
import { useFormMapperFunctions } from "@/composable/use-form-mapper-functions";

// Define the form mappers store
export const useFormMappersStore = defineStore("formMappers", (): FormMappersStore => {
  // Store state
  const formMapperFunctionsMap = ref<Map<EntityURLKey, any>>(new Map());

  // Get the form mapper functions
  const formMapperFunctions = useFormMapperFunctions();

  // Computed property to check if form mapper is loaded for a specific entity
  const isLoaded = (entityKey: EntityURLKey) =>
    computed(() => formMapperFunctionsMap.value.has(entityKey));

  // Function to load the appropriate form mapper based on the entity key
  function loadFormMapper(entityKey: EntityURLKey) {
    if (formMapperFunctionsMap.value.has(entityKey)) {
      return; // Already loaded
    }

    try {
      const composable = formMapperFunctions[entityKey];
      if (!composable) {
        throw new Error(`Unsupported entity key: ${entityKey}`);
      }

      if (typeof composable !== "function") {
        throw new Error(`Composable for ${entityKey} is not a function`);
      }

      formMapperFunctionsMap.value.set(entityKey, composable());
    } catch (error) {
      console.error(`Error loading form mapper functions for ${entityKey}:`, error);
    }
  }

  // Function to get form mappers for a specific entity
  function getFormMappers(entityKey: EntityURLKey) {
    return formMapperFunctionsMap.value.get(entityKey) || null;
  }

  // Return the store object
  return {
    formMapperFunctionsMap,
    isLoaded,
    loadFormMapper,
    getFormMappers
  };
});
