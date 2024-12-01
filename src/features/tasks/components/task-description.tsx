import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { ITaskPopulated } from "../tasks.types";
import { useUpdateTask } from "../hooks/use-update-task";

interface TaskDescriptionProps {
  task: ITaskPopulated;
}

export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate: updateTask, isPending } = useUpdateTask();

  const toggleIsEditing = () => setIsEditing((prev) => !prev);

  const handleSave = () => {
    updateTask(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSettled() {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="bg-muted p-4 shadow-lg border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Description</p>
        <Button
          variant={isEditing ? "destructive" : "secondary"}
          size="sm"
          onClick={toggleIsEditing}
        >
          {isEditing && <XIcon className="size-4 mr-1" />}
          {!isEditing && <PencilIcon className="size-4 mr-1" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Separator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a description..."
            rows={4}
            disabled={isPending}
          />
          <Button
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="w-full">
          {task.description ?? (
            <div className="m-4 text-center text-muted-foreground">
              No description set.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
