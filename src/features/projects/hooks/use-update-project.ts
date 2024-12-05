import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["projects"][":projectId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["projects"][":projectId"]["$patch"]
>;

export function useUpdateProject() {
  const qc = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await api["projects"][":projectId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}
