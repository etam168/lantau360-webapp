/**
 * @file use-posting-form-mapper.ts
 * @description Composable function for managing Posting form mapping.
 * Provides utilities for initializing form values, preparing entity records,
 * and handling image data for Posting entities. Used in conjunction with
 * the form-mappers-store for centralized form management.
 */

import type { Posting } from "@/interfaces/models/entities/posting";
import type { PostingImage } from "@/interfaces/models/entities/posting-image";
import type { EntityFormMappers } from "@/interfaces/stores/entity-form-mappers";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

import { usePostingFormContents } from "./form-contents/use-posting-form-contents";
import typia from "typia";
import { CategoryTypes } from "@/interfaces/types/category-types";

export function usePostingFormMapper(): EntityFormMappers<Posting, CategoryTypes> {
  // Constants and reactive references
  const { resetObject } = useUtilities();
  const { formStructure } = usePostingFormContents();

  /**
   * Creates a new image object for a community event
   */
  function getEntityImage(entityId: number): GalleryImageType {
    const newPostingImage: PostingImage = resetObject(typia.random<PostingImage>());
    const imageData = newPostingImage;
    imageData.postingId = entityId;

    return imageData;
  }

  /**
   * Returns the default values for a new CommunityEvent
   */
  function getDefaultValues(): Record<string, any> {
    return {
      postingId: 0,
      postingName: "",
      directoryId: 0,
      contactWhatsApp: "",
      contactPhone: "",
      contactOther: "",
      buttonText: "",
      title: "",
      mapLabel: "",
      subtitle1: "",
      subtitle2: "",
      subtitle3: "",
      displayMask: 0,
      description: "",
      imagePath: "",
      iconPath: "",
      bannerPath: "",
      hashKey: "",
      status: 1,
      latitude: 0,
      longitude: 0,
      rank: 0,
      expiryDate: null,
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
      )
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
    entity: Posting | undefined,
    formData: Record<string, any>
  ): Posting {
    const newPosting: Posting = resetObject(typia.random<Posting>());

    // If the entity is null, empty, or undefined, create a new record with default values
    const entityCopy: Posting = entity ? { ...entity } : { ...newPosting };

    // Then, remove extra fields from entityCopy record
    const prunePosting = typia.misc.createPrune<Posting>();
    prunePosting(entityCopy);

    // Define the structure for the result
    const result: Posting = {
      ...entityCopy,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => key in entityCopy && key !== "meta")
      )

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
