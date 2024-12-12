"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BsBuildingFillAdd } from "react-icons/bs";

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
import { useCreateWorkspace } from "@/features/workspaces/hooks";
import { createWorkSpaceSchema } from "@/features/workspaces/workspaces.schemas";

interface CreateWorkpaceFormProps {
  onCancel?: () => void;
  defaultName?: string;
}

export default function CreateWorkpaceForm(props: CreateWorkpaceFormProps) {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: props.defaultName ?? "",
    },
  });
  const router = useRouter();

  const onSubmit = ({ name, image }: z.infer<typeof createWorkSpaceSchema>) => {
    createWorkspace(
      {
        form: {
          name,
          image: image ?? "", // prevent "undefined" being sent as string
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
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
          <BsBuildingFillAdd className="size-8" />
        </div>
        <CardTitle className="text-xl">Create New Workspace</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-2 pb-4">
        <Form {...form}>
          <form
            id="create-workspace-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter workspace name" />
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
                          alt="workspace-image"
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
                    <FormMessage />
                    <div className="flex flex-col">
                      <p className="text-sm">Workspace Icon</p>
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
        {props.onCancel && (
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            className="w-36"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        )}
        {!props.onCancel && <span />}
        <Button
          type="submit"
          className="w-36"
          form="create-workspace-form"
          variant="primary"
          disabled={isPending}
        >
          Create Workspace
        </Button>
      </CardFooter>
    </Card>
  );
}
