import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logError } from "@/lib/utils";
import { api } from "@/lib/rpc";

type RequestType = InferRequestType<(typeof api)["auth"]["login"]["$post"]>;
type ResponseType = InferResponseType<(typeof api)["auth"]["login"]["$post"]>;

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();
  // const searchParams = useSearchParams();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api["auth"]["login"]["$post"]({ json });

      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");

      // TODO: redirect based on url query params
      // const next = searchParams.get("next");
      // if (next) router.push(next);

      router.refresh();
      qc.invalidateQueries({ queryKey: ["current"] });
    },
    onError: logError,
  });
  return mutation;
}
