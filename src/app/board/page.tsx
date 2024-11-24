"use client";
import Layout from "@/components/Layout";
import ListDetail from "@/components/ListDetail";
import TaskDetail from "@/components/TaskDetail";
import { generateUUID } from "@/utils/uuid";
import { MoreVert } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";
import { ApiResponse, Board, board, List, Task } from "@/utils/api";
import { toast } from "react-toastify";

const BoardPage: React.FC = () => {
  const [loadedBoard, setLoadedBoard] = useState<boolean>(false);
  const [listDetailDialog, setListDetailDialog] = useState<{
    open: boolean;
    listName: string;
    handle: (name: string) => void;
    remove: () => void;
  }>({
    open: false,
    listName: "",
    handle: () => {},
    remove: () => {},
  });
  const [boardData, setBoardData] = useState<Board>({
    board_id: "",
    title: "",
  });

  const [taskDetailDialog, setTaskDetailDialog] = useState<{
    open: boolean;
    task: Task;
    handle: (task: Task) => void;
    remove: () => void;
  }>({
    open: false,
    task: {
      task_id: "",
      title: "",
      description: "",
      position: 0,
    },
    handle: () => {},
    remove: () => {},
  });
  const [lists, setLists] = useState<List[]>([]);

  const [draggingType, setDraggingType] = useState<"list" | "task" | null>(
    null
  );

  useEffect(() => {
    if (loadedBoard) {
      updateBoard();
    }
  }, [lists]);

  const updateBoard = async () => {
    if (boardData.board_id) {
      const result: ApiResponse = await board(
        "PUT",
        `/${boardData.board_id}`,
        {},
        {
          lists: lists,
        }
      );
      if (result.status) {
      } else {
        toast.error(result.message);
      }
    }
  };

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

        if (lists.length === 0) {
          return;
        }
        const sourceList = lists[sourceListIndex];
        const destinationList = lists[destinationListIndex];

        const [movedTask] = (sourceList.tasks || []).splice(
          result.source.index,
          1
        );

        if (sourceListIndex === destinationListIndex) {
          (destinationList.tasks || []).splice(
            result.destination.index,
            0,
            movedTask
          );
        } else {
          (destinationList.tasks || []).splice(
            result.destination.index,
            0,
            movedTask
          );
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
        const updatedTask = [...(list.tasks || [])];
        updatedTask.push({
          task_id: generateUUID(),
          title: "New Task",
          description: "",
          position: 0,
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
      board_id: "",
      position: "",
    });
    setLists(updatedList);
  };

  const onBoardChange = async (id: string) => {
    setLoadedBoard(false);
    if (id) {
      const result: ApiResponse = await board("GET", `/${id}`, {}, {});
      if (result.status) {
        setBoardData({
          board_id: id,
          title: "",
        });

        setLists(result?.data?.data?.lists || []);
      } else {
        setLists([]);
      }
      setLoadedBoard(true);
    } else {
      setLists([]);
    }
  };

  return (
    <Layout onBoardChange={onBoardChange}>
      <Box>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Box
            sx={{
              width: "calc(100vw - 220px)",
              height: "calc(100vh - 70px)",
              overflowX: "auto",
              marginTop: "20px",
              marginLeft: "20px",
            }}
          >
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
                            background: "white",
                          }}
                        >
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            {...provided.dragHandleProps}
                            sx={{
                              background: (theme) => theme.palette.primary.main,
                              padding: 1,
                              userSelect: "none",
                            }}
                          >
                            <Typography sx={{ color: "white" }}>
                              {list.title}
                            </Typography>
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
                                  remove: () => {
                                    let updatedList = [...lists];
                                    updatedList = updatedList.filter(
                                      (item) => item.list_id !== list.list_id
                                    );

                                    setLists(updatedList);
                                  },
                                });
                              }}
                            >
                              <MoreVert sx={{ color: "white" }} />
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
                                {(list.tasks || []).map((task, taskIndex) => (
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
                                          // border: "1px solid red",
                                          boxShadow: "0px 0px 5px 0px #cecece",
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
                                              remove: () => {
                                                let updatedList = [...lists];
                                                updatedList = updatedList.map(
                                                  (item) => {
                                                    if (
                                                      item.list_id ===
                                                      list.list_id
                                                    ) {
                                                      let updatedTask = [
                                                        ...(item.tasks || []),
                                                      ];

                                                      updatedTask =
                                                        updatedTask.filter(
                                                          (item) =>
                                                            item.task_id !==
                                                            task.task_id
                                                        );

                                                      item.tasks = updatedTask;
                                                    }
                                                    return item;
                                                  }
                                                );
                                                setLists(updatedList);
                                              },
                                              handle: (newValue: Task) => {
                                                let updatedList = [...lists];
                                                updatedList = updatedList.map(
                                                  (item) => {
                                                    if (
                                                      item.list_id ===
                                                      list.list_id
                                                    ) {
                                                      let updatedTask = [
                                                        ...(item.tasks || []),
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
              remove: () => {},
            })
          }
          handle={listDetailDialog.handle}
          listName={listDetailDialog.listName}
          onRemove={listDetailDialog.remove}
        />
        <TaskDetail
          open={taskDetailDialog.open}
          onClose={() =>
            setTaskDetailDialog((prev) => ({ ...prev, open: false }))
          }
          task={taskDetailDialog.task}
          handle={taskDetailDialog.handle}
          onRemove={taskDetailDialog.remove}
        />
      </Box>
    </Layout>
  );
};
const AddTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Stack
      sx={{
        height: 40,
        background: "#eeeeee",
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.3s",
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
        background: "#eeeeee",
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.3s",
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
