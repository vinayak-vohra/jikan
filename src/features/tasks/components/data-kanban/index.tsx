import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ITaskPopulated, STATUS, TaskUpdatePayload } from "../../tasks.types";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

interface DataKanbanProps {
  data: ITaskPopulated[];
  onChange: (payload: TaskUpdatePayload[]) => void;
}

const boards: STATUS[] = [
  STATUS.BACKLOG,
  STATUS.TODO,
  STATUS.IN_PROGRESS,
  STATUS.IN_REVIEW,
  STATUS.DONE,
];

type TaskState = {
  [key in STATUS]: ITaskPopulated[];
};

export default function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = React.useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [STATUS.BACKLOG]: [],
      [STATUS.TODO]: [],
      [STATUS.IN_PROGRESS]: [],
      [STATUS.IN_REVIEW]: [],
      [STATUS.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as STATUS].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  React.useEffect(() => {
    const newTasks: TaskState = {
      [STATUS.BACKLOG]: [],
      [STATUS.TODO]: [],
      [STATUS.IN_PROGRESS]: [],
      [STATUS.IN_REVIEW]: [],
      [STATUS.DONE]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as STATUS].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = React.useCallback((result: DropResult) => {
    // console.log(result);
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceStatus = source.droppableId as STATUS;
    const destinationStatus = destination.droppableId as STATUS;

    let updatePayload: TaskUpdatePayload[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // remove task from source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // safety
      if (!movedTask) return prevTasks;

      const modifiedTask =
        sourceStatus !== destinationStatus
          ? { ...movedTask, status: destinationStatus }
          : movedTask;

      // update source column
      newTasks[sourceStatus] = sourceColumn;

      // insert task into destination column
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, modifiedTask);
      newTasks[destinationStatus] = destinationColumn;

      // add to update payload
      updatePayload.push({
        $id: modifiedTask.$id,
        status: modifiedTask.status,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      // update positions of tasks in destination column
      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== modifiedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatePayload.push({
              $id: task.$id,
              status: destinationStatus,
              position: newPosition,
            });
          }
        }
      });

      // update positions of tasks in source column
      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });

    onChange(updatePayload);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-secondary rounded min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] p-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        index={index}
                        draggableId={task.$id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
