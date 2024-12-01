import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["projects"][":projectId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["projects"][":projectId"]["$delete"]
>;

export function useDeleteProject() {
  const qc = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api["projects"][":projectId"]["$delete"]({
        param,
      });
      if (!response.ok) throw new Error("Failed to delete project");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project deleted");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}
