// File: @/composable/use-form-mapper-functions.ts

import { EntityURLKey } from "@/constants";

// Form mapper imports
import { useMemberFormMapper } from "@/composable/form-mappers/use-member-form-mapper";

export function useFormMapperFunctions() {
  const formMapperFunctions: Partial<Record<EntityURLKey, () => any>> = {
    MEMBER: useMemberFormMapper
    // Add other EntityURLKey values here as needed
  };

  return formMapperFunctions;
}
