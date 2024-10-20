import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type RequestType = InferRequestType<typeof authApi.register.$post>;
type ResponseType = InferResponseType<typeof authApi.register.$post>;

export const useRegister = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await authApi.register.$post({ json });

      if (!response.ok) throw new Error("Failed to register");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registered successfully");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["current"] });
    },
    onError: logError
  });

  return mutation;
};
