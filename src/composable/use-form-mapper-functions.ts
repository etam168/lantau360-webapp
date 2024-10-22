// File: @/composable/use-form-mapper-functions.ts

import { EntityURLKey } from "@/constants";

// Form mapper imports
import { useCheckinFormMapper } from "@/composable/form-mappers/use-checkin-form-mapper";
import { useMemberFormMapper } from "@/composable/form-mappers/use-member-form-mapper";
import { usePostingFormMapper } from "@/composable/form-mappers/use-posting-form-mapper";

export function useFormMapperFunctions() {
  const formMapperFunctions: Partial<Record<EntityURLKey, () => any>> = {
    CHECKIN: useCheckinFormMapper,
    MEMBER: useMemberFormMapper,
    POSTING: usePostingFormMapper
    // Add other EntityURLKey values here as needed
  };

  return formMapperFunctions;
}
