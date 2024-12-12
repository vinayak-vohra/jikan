import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["tasks"][":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<(typeof api)["tasks"][":taskId"]["$patch"]>;

export function useUpdateTask() {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await api["tasks"][":taskId"]["$patch"]({ json, param });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}
