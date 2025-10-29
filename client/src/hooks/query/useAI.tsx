import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/services/api";

export const useSuggestCategory = () => {
  return useMutation({
    mutationFn: async (data: { description: string }) => {
      const response = await aiApi.suggestCategory(data);
      return response.data.data;
    },
    gcTime: 0,
  });
};
