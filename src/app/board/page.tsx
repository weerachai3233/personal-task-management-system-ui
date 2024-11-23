"use client";
import ListDetail from "@/components/ListDetail";
import TaskDetail from "@/components/TaskDetail";
import { generateUUID } from "@/utils/uuid";
import { MoreVert } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";

export interface TaskType {
  task_id: string;
  title: string;
  description: string;
}
export interface ListType {
  list_id: string;
  title: string;
  tasks: TaskType[];
}

const BoardPage: React.FC = () => {
  const [listDetailDialog, setListDetailDialog] = useState<{
    open: boolean;
    listName: string;
    handle: (name: string) => void;
  }>({
    open: false,
    listName: "",
    handle: () => {},
  });

  const [taskDetailDialog, setTaskDetailDialog] = useState<{
    open: boolean;
    task: TaskType;
    handle: (task: TaskType) => void;
  }>({
    open: false,
    task: {
      task_id: "",
      title: "",
      description: "",
    },
    handle: () => {},
  });
  const [lists, setLists] = useState<ListType[]>([]);

  // const [lists, setLists] = useState<ListType[]>([
  //   {
  //     list_id: "1",
  //     title: "To Do",
  //     tasks: [
  //       {
  //         task_id: "1",
  //         title: "Task 1",
  //         description: "Description for Task 1",
  //       },
  //       {
  //         task_id: "2",
  //         title: "Task 2",
  //         description: "Description for Task 2",
  //       },
  //     ],
  //   },
  //   {
  //     list_id: "2",
  //     title: "In Progress",
  //     tasks: [
  //       {
  //         task_id: "3",
  //         title: "Task 3",
  //         description: "Description for Task 3",
  //       },
  //       {
  //         task_id: "4",
  //         title: "Task 4",
  //         description: "Description for Task 4",
  //       },
  //     ],
  //   },
  //   {
  //     list_id: "3",
  //     title: "Done",
  //     tasks: [
  //       {
  //         task_id: "5",
  //         title: "Task 5",
  //         description: "Description for Task 5",
  //       },
  //     ],
  //   },
  // ]);

  const [draggingType, setDraggingType] = useState<"list" | "task" | null>(
    null
  );

  const onDragStart = (start: DragStart) => {
    if (String(start?.draggableId).includes("list")) {
      setDraggingType("list");
    } else if (String(start?.draggableId).includes("task")) {
      setDraggingType("task");
    }
  };

  const onDragEnd = (result: DropResult) => {
    try {
      if (!result?.destination) return;

      const type = result.draggableId.includes("list") ? "list" : "task";

      if (type === "list") {
        const updatedLists = [...lists];
        const [removed] = updatedLists.splice(result.source.index, 1);
        updatedLists.splice(result.destination.index, 0, removed);
        setLists(updatedLists);
      } else if (type === "task") {
        const sourceListIndex = lists.findIndex(
          (list) => `task-${list.list_id}` === result.source.droppableId
        );
        const destinationListIndex = lists.findIndex(
          (list) => `task-${list.list_id}` === result?.destination?.droppableId
        );

        const sourceList = lists[sourceListIndex];
        const destinationList = lists[destinationListIndex];

        const [movedTask] = sourceList.tasks.splice(result.source.index, 1);

        if (sourceListIndex === destinationListIndex) {
          destinationList.tasks.splice(result.destination.index, 0, movedTask);
        } else {
          destinationList.tasks.splice(result.destination.index, 0, movedTask);
        }

        const updatedLists = [...lists];
        updatedLists[sourceListIndex] = sourceList;
        updatedLists[destinationListIndex] = destinationList;
        setLists(updatedLists);
      }

      setDraggingType(null);
    } catch {}
  };

  const handleAddTaskButton = (listId: string) => {
    let updatedList = [...lists];
    updatedList = updatedList.map((list) => {
      if (list.list_id === listId) {
        const updatedTask = [...list.tasks];
        updatedTask.push({
          task_id: generateUUID(),
          title: "New Task",
          description: "",
        });
        list.tasks = updatedTask;
      }
      return list;
    });
    setLists(updatedList);
  };

  const handleAddListButton = () => {
    const updatedList = [...lists];
    updatedList.push({
      list_id: "new" + generateUUID(),
      title: "List name",
      tasks: [],
    });
    setLists(updatedList);
  };
  // if (!isClient) {
  //   return null;
  // }

  return (
    <Box>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Box sx={{ width: "100vw", height: "100vh", overflowX: "auto" }}>
          <Droppable
            key={"list-drop"}
            droppableId={"list-drop"}
            isDropDisabled={draggingType === "task"}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
            direction="horizontal"
          >
            {(provided) => (
              <Stack
                direction={"row"}
                spacing={1}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map((list, listIndex) => (
                  <Draggable
                    draggableId={"list" + list.list_id}
                    key={list.list_id}
                    index={listIndex}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          width: 200,
                          minWidth: 200,
                          border: "1px solid blue",
                        }}
                      >
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          {...provided.dragHandleProps}
                          sx={{
                            background: "pink",
                            padding: 1,
                            userSelect: "none",
                          }}
                        >
                          <Typography>{list.title}</Typography>
                          <IconButton
                            size={"small"}
                            onClick={() => {
                              setListDetailDialog({
                                open: true,
                                listName: list.title,
                                handle: (name: string) => {
                                  let updatedList = [...lists];

                                  updatedList = updatedList.map((item) => {
                                    if (item.list_id === list.list_id) {
                                      item.title = name;
                                    }
                                    return item;
                                  });

                                  setLists(updatedList);
                                },
                              });
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>

                        <Droppable
                          key={`task${list.list_id}`}
                          droppableId={`task-${list.list_id}`}
                          isDropDisabled={draggingType === "list"}
                          isCombineEnabled={false}
                          ignoreContainerClipping={false}
                          direction="vertical"
                        >
                          {(provided) => (
                            <Stack
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              spacing={1}
                              sx={{
                                padding: 1,
                              }}
                            >
                              {list.tasks.map((task, taskIndex) => (
                                <Draggable
                                  key={`task` + task?.task_id}
                                  draggableId={`task` + task?.task_id}
                                  index={taskIndex}
                                >
                                  {(provided) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{
                                        border: "1px solid red",
                                        padding: 1,
                                        borderRadius: 1,
                                        background: "#fff",
                                        userSelect: "none",
                                      }}
                                      onClick={(e) => {
                                        if (e.detail === 2) {
                                          setTaskDetailDialog({
                                            open: true,
                                            task: task,
                                            handle: (newValue: TaskType) => {
                                              let updatedList = [...lists];
                                              updatedList = updatedList.map(
                                                (item) => {
                                                  if (
                                                    item.list_id ===
                                                    list.list_id
                                                  ) {
                                                    let updatedTask = [
                                                      ...item.tasks,
                                                    ];

                                                    updatedTask =
                                                      updatedTask.map(
                                                        (taskEl) => {
                                                          if (
                                                            taskEl.task_id ===
                                                            task.task_id
                                                          ) {
                                                            taskEl.description =
                                                              newValue.description;
                                                            taskEl.title =
                                                              newValue.title;
                                                          }
                                                          return taskEl;
                                                        }
                                                      );

                                                    item.tasks = updatedTask;
                                                  }
                                                  return item;
                                                }
                                              );
                                              setLists(updatedList);
                                            },
                                          });
                                        }
                                      }}
                                    >
                                      {task.title}
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <AddTaskButton
                                onClick={() =>
                                  handleAddTaskButton(list.list_id)
                                }
                              />
                            </Stack>
                          )}
                        </Droppable>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <AddListButton onClick={handleAddListButton} />
              </Stack>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
      <ListDetail
        open={listDetailDialog.open}
        onClose={() =>
          setListDetailDialog({
            open: false,
            listName: "",
            handle: () => {},
          })
        }
        handle={listDetailDialog.handle}
        listName={listDetailDialog.listName}
      />
      <TaskDetail
        open={taskDetailDialog.open}
        onClose={() =>
          setTaskDetailDialog((prev) => ({ ...prev, open: false }))
        }
        task={taskDetailDialog.task}
        handle={taskDetailDialog.handle}
      />
    </Box>
  );
};
const AddTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Stack
      sx={{
        height: 40,
        background: "#c9c9c9",
        borderRadius: 2,
        cursor: "pointer",
        ":hover": {
          background: "#e2e2e2",
        },
      }}
      justifyContent={"center"}
      alignItems={"center"}
      onClick={onClick}
    >
      <Typography sx={{ userSelect: "none" }}>Add Task</Typography>
    </Stack>
  );
};
const AddListButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Stack
      sx={{
        width: 200,
        minWidth: 200,
        height: 40,
        background: "#c9c9c9",
        borderRadius: 2,
        cursor: "pointer",
        ":hover": {
          background: "#e2e2e2",
        },
      }}
      justifyContent={"center"}
      alignItems={"center"}
      onClick={onClick}
    >
      <Typography sx={{ userSelect: "none" }}>Add List</Typography>
    </Stack>
  );
};
export default BoardPage;
