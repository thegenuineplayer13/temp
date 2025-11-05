import { useQuery } from "@/mock/mock-react-query";
import { profileSchema, businessTypeOptionSchema } from "@/features/core/schemas/schemas.settings";
import type { Profile, BusinessTypeOption } from "@/features/core/types/types.settings";
import { profileData, businessTypes, workingHours } from "@/mock/settingsData";

export const QUERY_KEYS = {
   profile: ["profile"],
   businessTypes: ["business-types"],
   workingHours: ["working-hours"],
} satisfies Record<string, readonly string[]>;

export function useProfile() {
   return useQuery<Profile>({
      queryKey: QUERY_KEYS.profile,
      queryFn: () => {
         const validated = profileSchema.parse(profileData);
         return validated;
      },
   });
}

export function useBusinessTypes() {
   return useQuery<BusinessTypeOption[]>({
      queryKey: QUERY_KEYS.businessTypes,
      queryFn: () => {
         const validated = businessTypes.map((type) => businessTypeOptionSchema.parse(type));
         return validated;
      },
   });
}

export function useWorkingHours() {
   return useQuery<string[]>({
      queryKey: QUERY_KEYS.workingHours,
      queryFn: () => workingHours,
   });
}
