// @/interfaces/types/form-mappers-store.ts
import type { DatatableType } from "@/interfaces/types/datatable-types";
import type { EntityFormMappers } from "@/interfaces/stores/entity-form-mappers";
import type { EntityType } from "@/interfaces/types/entity-type";

import { EntityURLKey } from "@/constants";

export interface FormMappersStore {
  formMapperFunctionsMap: Ref<Map<EntityURLKey, EntityFormMappers<EntityType, DatatableType>>>;
  isLoaded: (entityKey: EntityURLKey) => ComputedRef<boolean>;
  loadFormMapper: (entityKey: EntityURLKey) => void;
  getFormMappers: (entityKey: EntityURLKey) => EntityFormMappers<EntityType, DatatableType> | null;
}
