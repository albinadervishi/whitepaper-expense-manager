import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/services/api";
import type { CreateTeamData } from "@/types";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await teamApi.getAll();
      return response.data.data;
    },
  });
};

export const useTeam = (id?: string) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await teamApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamData) => teamApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTeamData> }) =>
      teamApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
