import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-full p-10 flex items-center justify-center">
      <LoaderCircleIcon className="size-16 text-muted-foreground animate-spin" />
    </div>
  );
}
