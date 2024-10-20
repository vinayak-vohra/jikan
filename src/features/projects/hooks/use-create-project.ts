import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { projectsApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<typeof projectsApi.$post, 200>;
type RequestType = InferRequestType<typeof projectsApi.$post>;

export function useCreateProject() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await projectsApi.$post({ form });

      if (!response.ok) throw new Error("Failed to create project");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("New project created");
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: logError,
  });
  return mutation;
}
