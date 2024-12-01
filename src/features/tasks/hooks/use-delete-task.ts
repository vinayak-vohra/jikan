import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["tasks"][":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["tasks"][":taskId"]["$delete"]
>;

export function useDeleteTask() {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api["tasks"][":taskId"]["$delete"]({ param });

      if (!response.ok) throw new Error("Failed to delete task");

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task Deleted");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["tasks", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}
