"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { useCreateTask } from "../hooks";
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
import { CalendarPlusIcon } from "lucide-react";
import { useCreateTaskModal } from "@/providers/task-modal-provider";

interface CreateTaskFormProps {
  onCancel?: () => void;
}

type FormT = z.infer<typeof createTaskSchema>;

export default function CreateTaskForm({ onCancel }: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId();
  const { status } = useCreateTaskModal();

  const { mutate: createTask, isPending } = useCreateTask();

  const form = useForm<FormT>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: { status },
  });

  const onSubmit = (data: FormT) => {
    createTask(
      {
        json: {
          ...data,
          workspaceId,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full lg:px-4 max-w-lg mx-auto border-none shadow-none">
      <CardHeader className="flex pb-4 max-md:pt-4 flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-blue-100 text-blue-500">
          <CalendarPlusIcon className="size-8" />
        </div>
        <CardTitle className="text-xl">Create New Task</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-2 pb-4">
        <Form {...form}>
          <form
            id="create-task-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
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

            <ProjectSelector form={form} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-4 border-t">
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          className="w-36"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-36"
          form="create-task-form"
          variant="primary"
          disabled={isPending}
        >
          Create Task
        </Button>
      </CardFooter>
    </Card>
  );
}

type SelectorProps = {
  form: UseFormReturn<FormT>;
};

function AssigneeSelector({ form }: SelectorProps) {
  const workspaceId = useWorkspaceId();

  const { data: members, isLoading } = useFetchMembers(workspaceId);

  const memberOptions: MemberOptions[] =
    members?.documents.map((member) => ({
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
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            {isLoading && <Skeleton className="h-9 w-full" />}
            {!isLoading && (
              <>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                </FormControl>
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
            )}
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
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            {isLoading && <Skeleton className="h-9 w-full" />}
            {!isLoading && (
              <>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                </FormControl>
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
