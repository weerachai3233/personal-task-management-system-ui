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

const ListDetail: React.FC<{
  listName?: string;
  open: boolean;
  onClose?: () => void;
  handle?: (value: string) => void;
}> = ({ open, onClose, handle, listName }) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (listName) {
      setText(listName);
    }
  }, [listName]);

  const submitButton = () => {
    if (!text) {
      //
      return;
    }

    handle && handle(text);
    onClose && onClose();
  };

  return (
    <Dialog open={open} onClose={onClose && onClose} sx={{}}>
      <Box sx={{ width: 400 }}>
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
          <Typography sx={{ color: "white" }} variant={"h5"}>
            Change list name.
          </Typography>
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
            label={"List name"}
            fullWidth
            value={text}
            onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
              event.target.select()
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setText(event.target.value)
            }
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === "Enter") {
                submitButton();
              }
            }}
          />
        </Box>

        {/* Footer */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          sx={{ padding: 1 }}
        >
          <Button variant={"contained"} onClick={submitButton}>
            Ok
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ListDetail;
