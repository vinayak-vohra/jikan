"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ITaskPopulated, STATUS } from "../../tasks.types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import MemberAvatar from "@/features/members/components/member-avatar";
import TaskDate from "../task-date";
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/lib/utils";
import TaskActions from "../task-actions";

// Omit<ITaskPopulated, "dueDate"> & { dueDate: string }
export const columns: ColumnDef<ITaskPopulated>[] = [
  // Name
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="line-clamp-1">{row.original.name}</p>;
    },
  },

  // Project
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium ">
          <ProjectAvatar name={project.name} image={project.image} size={6} />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },

  // Assignee
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium ">
          <MemberAvatar name={assignee.name} className="size-6" />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },

  // Due Date
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <TaskDate dueDate={row.original.dueDate} />;
    },
  },

  // Status
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{toTitleCase(status)}</Badge>;
    },
  },

  // Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const { $id, projectId } = row.original;
      return (
        <TaskActions id={$id} projectId={projectId}>
          <Button size="icon" variant="ghost">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
