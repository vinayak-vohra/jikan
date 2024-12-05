import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<(typeof api)["tasks"]["$post"], 200>;
type RequestType = InferRequestType<(typeof api)["tasks"]["$post"]>;

export function useCreateTask() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api["tasks"]["$post"]({ json });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    },
    onSuccess: () => {
      toast.success("New Task created");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: logError,
  });
  return mutation;
}
