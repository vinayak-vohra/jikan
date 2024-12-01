import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<
  (typeof api)["tasks"]["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["tasks"]["bulk-update"]["$post"]
>;

export function useBulkUpdateTask() {
  const qc = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api["tasks"]["bulk-update"]["$post"]({ json });

      if (!response.ok) throw new Error("Failed to update tasks");

      return await response.json();
    },
    onSuccess: () => {
      // toast.success("Tasks updated");
      console.log("Kanban: bulk update success");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: logError,
  });
  return mutation;
}
