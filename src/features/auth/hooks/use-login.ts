import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type RequestType = InferRequestType<typeof authApi.login.$post>;
type ResponseType = InferResponseType<typeof authApi.login.$post>;

/**
 * Custom hook for handling user login using React Query's mutation.
 *
 * @returns The mutation object containing the login mutation function,
 *          and various properties related to the mutation state
 *          (e.g., isLoading, isError).
 */
export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await authApi.login.$post({ json });

      if (!response.ok) throw new Error(response.statusText);

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      const next = searchParams.get("next");

      if (next) router.push(next);
      router.refresh();
      qc.invalidateQueries({ queryKey: ["current"] });
    },
    onError: logError,
  });
  return mutation;
}
