import { useQuery } from "@/mock/mock-react-query";
import {
  specializationSchema,
  serviceSchema,
  serviceRelationshipSchema,
} from "@/features/core/schemas/schemas.services";
import type { Specialization, Service, ServiceRelationship } from "@/features/core/types/types.services";
import { mockSpecializations, mockServices, mockServiceRelationships } from "@/mock/services-mock";

export const QUERY_KEYS = {
  specializations: ["specializations"],
  services: ["services"],
  relationships: ["service-relationships"],
  specializationServices: (specializationId: string) => ["specialization-services", specializationId],
} satisfies Record<string, readonly string[] | ((id: string) => readonly string[])>;

export function useSpecializations() {
  return useQuery<Specialization[]>({
    queryKey: QUERY_KEYS.specializations,
    queryFn: () => {
      const validated = mockSpecializations.map((spec) => specializationSchema.parse(spec));
      return validated;
    },
  });
}

export function useServices() {
  return useQuery<Service[]>({
    queryKey: QUERY_KEYS.services,
    queryFn: () => {
      const validated = mockServices.map((service) => serviceSchema.parse(service));
      return validated;
    },
  });
}

export function useServiceRelationships() {
  return useQuery<ServiceRelationship>({
    queryKey: QUERY_KEYS.relationships,
    queryFn: () => {
      const validated = serviceRelationshipSchema.parse(mockServiceRelationships);
      return validated;
    },
  });
}

export function useSpecializationServices(specializationId: string) {
  const { data: services } = useServices();
  const { data: relationships } = useServiceRelationships();

  return useQuery<Service[]>({
    queryKey: QUERY_KEYS.specializationServices(specializationId),
    queryFn: () => {
      if (!services || !relationships) return [];
      const serviceIds = relationships[specializationId] || [];
      return services.filter((service) => serviceIds.includes(service.id));
    },
    enabled: !!services && !!relationships && !!specializationId,
  });
}
