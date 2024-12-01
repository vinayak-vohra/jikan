import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IConfirmationDialog, useConfirmation } from "@/hooks/use-confirmation";
import { useRouter } from "next/navigation";
import { useDeleteProject, useProjectId, useUpdateProject } from "../../hooks";

const dialogInfo: IConfirmationDialog = {
  title: "Delete Project",
  description: (
    <span>
      Are you sure you want to delete this Project ?
      <br />
      <br />
      This action is irreversible, and all tasks will be permanently removed.
    </span>
  ),
  variant: "destructive",
};

export function ProjectDeleteCard() {
  const router = useRouter();
  const { isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const projectId = useProjectId();

  const [DeleteDialog, confirmDelete] = useConfirmation(dialogInfo);

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteProject(
      { param: { projectId } },
      { onSuccess: () => router.push("/") }
    );
  };
  return (
    <>
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none py-2">
        <CardHeader className="px-7 py-3">
          <CardTitle className="flex flex-row gap-x-4 items-center text-destructive text-lg">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="py-3 px-7">
          <div className="flex flex-col py-1.5 gap-y-2">
            <Label>Delete Project</Label>
            <p className="text-xs text-muted-foreground">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
          </div>
          <div className="py-3">
            <Separator />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              disabled={isUpdating || isDeleting}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
