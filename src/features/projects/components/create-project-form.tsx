"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid2x2PlusIcon, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { createProjectSchema } from "@/features/projects/projects.schemas";
import { useCreateProject } from "@/features/projects/hooks";
import { useWorkspaceId } from "@/features/workspaces/hooks";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export default function CreateProjectForm(props: CreateProjectFormProps) {
  const { mutate: createProject, isPending } = useCreateProject();
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const onSubmit = ({ name, image }: z.infer<typeof createProjectSchema>) => {
    createProject(
      {
        form: {
          name,
          image: image ?? "", // prevent "undefined" being sent as string
          workspaceId,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleImageReset = (fieldOnChange: (...ev: any[]) => void) => {
    fieldOnChange(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  return (
    <Card className="w-full lg:px-4 max-w-lg mx-auto border-none shadow-none">
      <CardHeader className="flex pb-4 max-md:pt-4 flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-blue-100 text-blue-500">
          <Grid2x2PlusIcon className="size-8" />
        </div>
        <CardTitle className="text-xl">Create New Project</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-2 pb-4">
        <Form {...form}>
          <form
            id="create-project-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-16 relative rounded-md overflow-hidden">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          alt="project-image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar
                        className="size-16 cursor-pointer"
                        onClick={() => fileUploadRef.current?.click()}
                      >
                        <AvatarFallback>
                          <ImageUpIcon className="size-8 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm">Project Icon</p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, JPG, PNG, or SVG, max 1mb
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg, .jpeg, .png, .svg"
                        ref={fileUploadRef}
                        onChange={handleImageUpload}
                        disabled={isPending}
                      />
                      <div className="flex my-0.5 gap-x-2">
                        <Button
                          type="button"
                          size="xs"
                          variant="secondary"
                          className="w-fit"
                          disabled={isPending}
                          onClick={() => fileUploadRef.current?.click()}
                        >
                          Upload Image
                        </Button>
                        {form.getValues().image && (
                          <Button
                            type="button"
                            size="xs"
                            variant="secondary"
                            className="w-fit bg-red-200 hover:bg-red-300 text-red-900"
                            disabled={isPending}
                            onClick={() => handleImageReset(field.onChange)}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-4 border-t">
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          className="w-36"
          onClick={props.onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-36"
          form="create-project-form"
          variant="primary"
          disabled={isPending}
        >
          Create Project
        </Button>
      </CardFooter>
    </Card>
  );
}
