// @/interfaces/stores/crud-service.ts
import type { EntityType } from "@/interfaces/types/entity-type";

export interface CrudService<T extends EntityType> {
  createEntity: (payload: T) => Promise<T>;
  updateEntity: (entityId: number, payload: T) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
}
