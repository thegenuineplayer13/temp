import { useQuery } from "@/mock/mock-react-query";
import { clientSchema } from "@/features/core/schemas/schemas.clients";
import type { Client } from "@/features/core/types/types.clients";
import { mockClients } from "@/mock/clients-mock";

export const QUERY_KEYS = {
  clients: ["clients"],
  client: (id: string) => ["client", id],
} satisfies Record<string, readonly string[] | ((id: string) => readonly string[])>;

export function useClients() {
  return useQuery<Client[]>({
    queryKey: QUERY_KEYS.clients,
    queryFn: () => {
      const validated = mockClients.map((client) => clientSchema.parse(client));
      return validated;
    },
  });
}

export function useClient(id: string) {
  const { data: clients } = useClients();

  return useQuery<Client | undefined>({
    queryKey: QUERY_KEYS.client(id),
    queryFn: () => {
      if (!clients) return undefined;
      return clients.find((client) => client.id === id);
    },
    enabled: !!clients && !!id,
  });
}
