// useEntityService.ts
import type { CrudService } from "@/interfaces/stores/crud-service";
import type { EntityType } from "@/interfaces/types/entity-type";
import { ENTITY_URL, EntityURLKey } from "@/constants";
import { AxiosError } from "axios";

export function useCrudService<T extends EntityType>(entityUrlKey: EntityURLKey): CrudService<T> {
  const { api } = useApi();

  // Get the URL from the constants
  const entityUrl = ENTITY_URL[entityUrlKey];

  // Custom error class for entity not found errors
  class EntityNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "EntityNotFoundError";
    }
  }

  if (!entityUrl) {
    throw new Error(`No URL found for entity type: ${entityUrlKey}`);
  }

  async function createEntity(payload: T): Promise<T> {
    alert("PAYLOAD " + JSON.stringify(payload));
    try {
      const response = await api.create<T>(entityUrl, payload);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to create entity: ${error.message}`);
      }
      throw error;
    }
  }

  async function updateEntity(entityId: number, payload: T): Promise<void> {
    try {
      await api.update(`${entityUrl}/${entityId}`, payload);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new EntityNotFoundError(`Entity not found for update in ${entityUrlKey}`);
        }
        throw new Error(`Failed to update entity: ${error.message}`);
      }
      throw error;
    }
  }

  async function deleteEntity(id: number): Promise<void> {
    try {
      await api.delete(`${entityUrl}/${id}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new EntityNotFoundError(`Entity not found for deletion in ${entityUrlKey}`);
        }
        throw new Error(`Failed to delete entity: ${error.message}`);
      }
      throw error;
    }
  }

  return {
    createEntity,
    updateEntity,
    deleteEntity
  };
}
