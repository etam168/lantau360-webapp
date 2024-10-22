/**
 * @file use-member-form-mapper.ts
 * @description Composable function for managing Member form mapping.
 * Provides utilities for initializing form values, preparing entity records,
 * and handling image data for Member entities. Used in conjunction with
 * the form-mappers-store for centralized form management.
 */

import type { Member } from "@/interfaces/models/entities/member";
// import type { MemberDatatable } from "@/interfaces/datatable/member-datatable";
import { CategoryTypes } from "@/interfaces/types/category-types";
import type { MemberImage } from "@/interfaces/models/entities/member-image";
import type { EntityFormMappers } from "@/interfaces/stores/entity-form-mappers";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";

import { useMemberFormContents } from "./form-contents/use-member-form-contents";
import typia from "typia";

export function useMemberFormMapper(): EntityFormMappers<Member, CategoryTypes> {
  // Constants and reactive references
  const { resetObject } = useUtilities();
  const { formStructure } = useMemberFormContents();

  /**
   * Creates a new image object for a community event
   */
  function getEntityImage(entityId: number): GalleryImageType {
    const newMemberImage: MemberImage = resetObject(typia.random<MemberImage>());
    const imageData = newMemberImage;
    imageData.memberId = entityId;

    return imageData;
  }

  /**
   * Returns the default values for a new CommunityEvent
   */
  function getDefaultValues(): Record<string, any> {
    return {
      memberId: 0,
      alias: "",
      firstName: "",
      lastName: "",
      firstNameCn: "",
      firstNameHk: "",
      lastNameCn: "",
      lastNameHk: "",
      userName: "",
      phone: "",
      email: "",
      password: "",
      ageGroup: 0,
      otherInfo: "",
      verifiedBy: 0,
      verifiedTimestamp: new Date(),
      otp: "",
      points: 0,
      status: 1,
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
      firstNameCn: row?.meta?.i18n?.["cn"]?.firstName ?? null,
      firstNameHk: row?.meta?.i18n?.["hk"]?.firstName ?? null,
      lastNameCn: row?.meta?.i18n?.["cn"]?.lastName ?? null,
      lastNameHk: row?.meta?.i18n?.["hk"]?.lastName ?? null
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
    entity: Member | MemberDatatable | undefined,
    formData: Record<string, any>
  ): Member {
    const newMember: Member = resetObject(typia.random<Member>());

    // If the entity is null, empty, or undefined, create a new record with default values
    const entityCopy: Member = entity ? { ...entity } : { ...newMember };

    // Then, remove extra fields from entityCopy record
    const pruneAdvertisement = typia.misc.createPrune<Member>();
    pruneAdvertisement(entityCopy);

    // Define the structure for the result
    const result: Member = {
      ...entityCopy,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => key in entityCopy && key !== "meta")
      ),
      meta: {
        ...entityCopy.meta,
        i18n: {
          ...entityCopy.meta?.i18n,
          cn: {
            ...entityCopy.meta?.i18n?.cn,
            firstName: formData.firstNameCn || "",
            lastName: formData.lastNameCn || ""
          },
          hk: {
            ...entityCopy.meta?.i18n?.hk,
            firstName: formData.firstNameHk || "",
            lastName: formData.lastNameHk || ""
          }
        }
      }
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
