import { AlertTriangleIcon } from "lucide-react";

type ErrorPageProps = {
  message?: string;
};

export default function ErrorPage({
  message = "Something went wrong.",
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <AlertTriangleIcon className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}
