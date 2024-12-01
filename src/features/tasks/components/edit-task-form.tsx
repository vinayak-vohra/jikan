"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useFetchMembers } from "@/features/members/hooks";
import { MemberOptions } from "@/features/members/members.types";
import { useFetchProjects } from "@/features/projects/hooks";
import { ProjectOptions } from "@/features/projects/projects.types";
import { useWorkspaceId } from "@/features/workspaces/hooks";

import { useCreateTask } from "../hooks/use-create-task";
import { createTaskSchema } from "../tasks.schemas";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { STATUS } from "../tasks.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTaskById } from "../hooks/use-fetch-task-by-id";
import { Loader2Icon } from "lucide-react";
import { useUpdateTask } from "../hooks/use-update-task";
import { useEffect } from "react";

interface EditTaskFormProps {
  onCancel?: () => void;
  taskId: string;
}

type FormT = z.infer<typeof createTaskSchema>;

export default function EditTaskForm(props: EditTaskFormProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { data: initialTask, isLoading: isLoadingTask } = useFetchTaskById(
    props.taskId
  );

  const form = useForm<FormT>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = (data: FormT) => {
    // console.log(data);
    updateTask(
      {
        json: data,
        param: { taskId: props.taskId },
      },
      {
        onSuccess: () => {
          form.reset();
          props.onCancel?.();
        },
      }
    );
  };

  useEffect(() => {
    if (initialTask) {
      form.reset({
        name: initialTask.name,
        dueDate: new Date(initialTask.dueDate),
        assigneeId: initialTask.assigneeId,
        status: initialTask.status,
        projectId: initialTask.projectId,
      });
    }
  }, [initialTask, form]);

  if (isLoadingTask)
    return (
      <div className="w-full h-72 flex items-center justify-center">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );

  if (!initialTask) return null; // For type safety

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7 max-md:py-3">
        <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7 max-md:py-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter task name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AssigneeSelector form={form} />

            {form.getValues("status") !== undefined && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      {/* <FormMessage /> */}
                      <SelectContent>
                        {Object.values(STATUS).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <ProjectSelector form={form} />

            <div className="py-3 max-md:py-1">
              <Separator />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={props.onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type SelectorProps = {
  form: UseFormReturn<FormT>;
};

function AssigneeSelector({ form }: SelectorProps) {
  const workspaceId = useWorkspaceId();

  const { data: members, isLoading } = useFetchMembers(workspaceId);

  if (isLoading) return <Skeleton className="h-9 w-full" />;
  if (!members || form.getValues("assigneeId") === undefined) return null;

  const memberOptions: MemberOptions[] =
    members.documents.map((member) => ({
      $id: member.$id,
      name: member.name,
    })) || [];

  return (
    <FormField
      control={form.control}
      name="assigneeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assignee</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    defaultValue={field.value}
                    placeholder="Select Assignee"
                  />
                </SelectTrigger>
              </FormControl>
              {/* <FormMessage /> */}
              <SelectContent>
                {memberOptions.map((member) => (
                  <SelectItem key={member.$id} value={member.$id}>
                    <div className="flex gap-x-2 items-center">
                      <MemberAvatar name={member.name} className="size-6" />
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ProjectSelector({ form }: SelectorProps) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading } = useFetchProjects(workspaceId);

  if (isLoading) return <Skeleton className="h-9 w-full" />;
  if (!projects || form.getValues("projectId") === undefined) return null;

  const projectOptions: ProjectOptions[] =
    projects?.documents.map((project) => ({
      $id: project.$id,
      name: project.name,
      image: project.image,
    })) || [];

  return (
    <FormField
      control={form.control}
      name="projectId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            {isLoading && <Skeleton className="h-9 w-full" />}
            {!isLoading && (
              <>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                </FormControl>
                {/* <FormMessage /> */}
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project.$id} value={project.$id}>
                      <div className="flex gap-x-2 items-center">
                        <ProjectAvatar
                          name={project.name}
                          image={project.image}
                          size={6}
                        />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </>
            )}
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
