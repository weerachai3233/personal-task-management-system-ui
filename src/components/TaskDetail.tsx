import { TaskType } from "@/app/board/page";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const TaskDetail: React.FC<{
  task: TaskType;
  open: boolean;
  onClose?: () => void;
  handle?: (value: TaskType) => void;
  onRemove?: () => void;
}> = ({ open, onClose, handle, task, onRemove }) => {
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // useEffect(() => {
  //   if (listName) {
  //     setText(listName);
  //   }
  // }, [listName]);

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);
  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  const removeButton = () => {
    onRemove && onRemove();
    onClose && onClose();
  };

  const submitButton = () => {
    const payload: TaskType = {
      task_id: task.task_id,
      title: title,
      description: description,
    };

    handle && handle(payload);
    onClose && onClose();
  };

  return (
    <Dialog open={open} sx={{}} fullWidth>
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            padding: 1,
            background: (theme) => theme.palette.primary.main,
          }}
        >
          <TextField
            variant="standard"
            InputProps={{
              sx: { fontSize: 20 },
            }}
            inputProps={{
              sx: {
                color: "white",
              },
            }}
            value={title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(event.target.value)
            }
          />
          <IconButton size={"small"} onClick={onClose && onClose}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        </Stack>
        {/* Content */}
        <Box
          sx={{
            padding: 2,
          }}
        >
          <TextField
            label={"Description"}
            fullWidth
            value={description}
            // onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
            //   event.target.select()
            // }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(event.target.value)
            }
            onKeyDown={(event: React.KeyboardEvent) => {
              // if (event.key === "Enter") {
              //   submitButton();
              // }
            }}
            multiline
            rows={4}
          />
        </Box>

        {/* Footer */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ padding: 1 }}
        >
          <Button variant="contained" color={"error"} onClick={removeButton}>
            Remove
          </Button>
          <Button variant={"contained"} onClick={submitButton}>
            Ok
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default TaskDetail;
