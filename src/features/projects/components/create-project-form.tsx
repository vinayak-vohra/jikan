"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7 max-md:py-3">
        <CardTitle className="text-xl font-bold">
          Create a new Project
        </CardTitle>
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
