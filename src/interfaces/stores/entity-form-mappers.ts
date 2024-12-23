// @/interfaces/stores/entity-form-mappers.ts

import type { CategoryTypes } from "../types/category-types";
import type { EntityType } from "@/interfaces/types/entity-type";
import type { FormStructure } from "../types/form-structure-types";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

export interface EntityFormMappers<
  T extends EntityType = EntityType,
  U extends CategoryTypes = CategoryTypes
> {
  formStructure: FormStructure;
  getEntityImage: (entityId: number) => GalleryImageType;
  getInitialValues: (row?: U, initializingValues?: Record<string, any>) => Record<string, any>;
  getSchema: () => Record<string, any>;
  prepareEntityRecord: (entity: T | U | undefined, formData: Record<string, any>) => T;
}
