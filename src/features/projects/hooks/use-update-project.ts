import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { projectsApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<
  (typeof projectsApi)[":projectId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof projectsApi)[":projectId"]["$patch"]
>;

export function useUpdateProject() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await projectsApi[":projectId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) throw new Error("Failed to update project");

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated");
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}
