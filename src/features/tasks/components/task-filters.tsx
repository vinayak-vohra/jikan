import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFetchMembers } from "@/features/members/hooks";
import { MemberOptions } from "@/features/members/members.types";
import { useFetchProjects } from "@/features/projects/hooks";
import { ProjectOptions } from "@/features/projects/projects.types";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { STATUS } from "../tasks.types";
import { UserIcon, ListChecksIcon, FolderIcon } from "lucide-react";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import DatePicker from "@/components/ui/date-picker";

interface TaskFiltersProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

export default function TaskFilters(props: TaskFiltersProps) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } =
    useFetchProjects(workspaceId);

  const { data: members, isLoading: isLoadingMembers } =
    useFetchMembers(workspaceId);

  const projectOptions: ProjectOptions[] =
    projects?.documents.map((project) => ({
      $id: project.$id,
      name: project.name,
      image: project.image,
    })) || [];

  const memberOptions: MemberOptions[] =
    members?.documents.map((member) => ({
      $id: member.$id,
      name: member.name,
    })) || [];

  const [filters, setFilters] = useTaskFilters();

  const onValueChange = (key: keyof typeof filters) => (value: string) => {
    setFilters({ [key]: value === "all" ? null : value });
  };

  const onStatusChange = onValueChange("status");
  const onAssigneeChange = onValueChange("assigneeId");
  const onProjectChange = onValueChange("projectId");

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Status Filter */}
      <Select
        defaultValue={filters.status || undefined}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {Object.values(STATUS).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      {!props.hideAssigneeFilter && (
        <Select
          defaultValue={filters.assigneeId || undefined}
          onValueChange={onAssigneeChange}
        >
          <SelectTrigger className="w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <SelectValue placeholder="All Assignees" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center size-6 rounded-full border bg-muted">
                  <UserIcon className="size-4" />
                </div>
                <span>All Assignees</span>
              </div>
            </SelectItem>
            {memberOptions.map((member) => (
              <SelectItem key={member.$id} value={member.$id}>
                <div className="flex items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-6 text-xs" />
                  <span>{member.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Project Filter */}
      {!props.hideProjectFilter && (
        <Select
          defaultValue={filters.projectId || undefined}
          onValueChange={onProjectChange}
        >
          <SelectTrigger className="w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center size-6 rounded-full border bg-muted">
                  <FolderIcon className="size-4" />
                </div>
                <span>All Projects</span>
              </div>
            </SelectItem>
            {projectOptions.map((project) => (
              <SelectItem key={project.$id} value={project.$id}>
                <div className="flex items-center gap-x-2">
                  <ProjectAvatar
                    image={project.image}
                    name={project.name}
                    size={6}
                  />
                  <span>{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Due Date Filter */}
      <DatePicker
        className="w-full lg:w-auto h-9"
        placeholder="Due Date"
        value={filters.dueDate ? new Date(filters.dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date?.toISOString() || null });
        }}
      />
    </div>
  );
}
