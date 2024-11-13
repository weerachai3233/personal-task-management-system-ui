"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Box, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const BoardPage = () => {
  const [todos, setTodos] = useState([
    { id: "1", content: "Do the laundry" },
    { id: "2", content: "Buy groceries" },
    { id: "3", content: "Write code" },
    { id: "4", content: "Read a book" },
  ]);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    // If dropped outside the list, return early
    if (!destination) return;

    // If the item is dropped in the same place, return early
    if (destination.index === source.index) return;

    // Reorder the list items after drag
    const reorderedTodos = Array.from(todos);
    const [removed] = reorderedTodos.splice(source.index, 1); // Remove the item from the source position
    reorderedTodos.splice(destination.index, 0, removed); // Insert it at the new position

    setTodos(reorderedTodos); // Update the state with the new order
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Todo Board
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="list1"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  padding: 2,
                  backgroundColor: "#f4f4f4",
                  borderRadius: 2,
                  width: 300,
                }}
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          backgroundColor: "white",
                          padding: 2,
                          marginBottom: 1,
                          borderRadius: 1,
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography>{todo.content}</Typography>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}{" "}
                {/* Placeholder to handle spacing while dragging */}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Layout>
  );
};

export default BoardPage;
