/**
 * @file use-checkin-form-mapper.ts
 * @description Composable function for managing Checkin form mapping.
 * Provides utilities for initializing form values, preparing entity records,
 * and handling image data for Checkin entities. Used in conjunction with
 * the form-mappers-store for centralized form management.
 */

import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { EntityFormMappers } from "@/interfaces/stores/entity-form-mappers";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import { NotImplementedException } from "@/helpers/not-implemented-exception";

import { useCheckinFormContents } from "./form-contents/use-checkin-form-contents";
import typia from "typia";
import { CategoryTypes } from "@/interfaces/types/category-types";

export function useCheckinFormMapper(): EntityFormMappers<CheckIn, CategoryTypes> {
  // Constants and reactive references
  const { resetObject } = useUtilities();
  const { formStructure } = useCheckinFormContents();

  /**
   * Creates a new image object for a checkin
   */
  function getEntityImage(_entityId: number): GalleryImageType {
    console.log(_entityId);
    throw new NotImplementedException();
  }

  /**
   * Returns the default values for a new Checkin
   */
  function getDefaultValues(): Record<string, any> {
    return {
      checkInId: 0,
      memberId: 0,
      siteId: 0,
      checkInfo: {},
      description: "",
      checkInAt: new Date(),
      meta: {} // Keep this for any other metadata
    };
  }

  /**
   * Returns initial values for the form, based on existing data or default values
   */
  function getInitialValues(row?: CategoryTypes): Record<string, any> {
    const defaultValues = getDefaultValues();

    if (!row) {
      return defaultValues;
    }

    return {
      ...defaultValues,
      ...Object.fromEntries(
        Object.entries(row).filter(([key]) => key in defaultValues && key !== "meta")
      ),

      description: row?.checkInfo?.description ?? null,
      checkInAt: row?.checkInfo?.checkInAt ?? null
    };
  }

  /**
   * Returns schema object for the form input
   */
  function getSchema(): Record<string, any> {
    return {};
  }

  /**
   * Prepares the entity record for submission by merging form data with existing entity data
   */
  function prepareEntityRecord(
    entity: CheckIn | undefined,
    formData: Record<string, any>
  ): CheckIn {
    const newCheckIn: CheckIn = resetObject(typia.random<CheckIn>());

    // If the entity is null, empty, or undefined, create a new record with default values
    const entityCopy: CheckIn = entity ? { ...entity } : { ...newCheckIn };

    // Then, remove extra fields from entityCopy record
    const pruneCheckin = typia.misc.createPrune<CheckIn>();
    pruneCheckin(entityCopy);

    // Define the structure for the result
    const result: CheckIn = {
      ...entityCopy,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => key in entityCopy && key !== "meta")
      ),

      checkInfo: [
        {
          checkInAt: formData.checkInAt,
          description: formData.description
        }
      ]

      // meta: {} // Simplified meta handling for now
    };

    // Add more logic to handle the meta column if necessary
    return result;
  }

  // Return object with all functions and reactive references
  return {
    formStructure,
    getEntityImage,
    getInitialValues,
    getSchema,
    prepareEntityRecord
  };
}
