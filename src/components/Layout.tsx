import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState, MouseEvent, ReactNode, FC } from "react";
import { Menu } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import {
  ApiResponse,
  Board,
  Project,
  project as projectApi,
  board as boardApi,
} from "@/utils/api";
import { toast } from "react-toastify";
import AddProjectDialog from "./AddProjectDialog";
import AddBoardDialog from "./AddBoardDialog";

const Layout: FC<{
  children: ReactNode;
  onBoardChange: (id: string) => void;
}> = ({ children, onBoardChange }) => {
  const auth = useAuth();
  const drawerWidth = 200;
  const isMobile = useMediaQuery("(max-width:600px)");

  const [projectDialog, setProjectDialog] = useState<{
    open: boolean;
    type: "NEW" | "EDIT";
    handle: (name: string) => void;
  }>({
    open: false,
    type: "NEW",
    handle: () => {},
  });

  const [boardDialog, setBoardDialog] = useState<{
    open: boolean;
    type: "NEW" | "EDIT";
    handle: (name: string) => void;
  }>({
    open: false,
    type: "NEW",
    handle: () => {},
  });

  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const [project, setProject] = useState<string>("");
  const [projectList, setProjectList] = useState<Project[]>([]);

  const [board, setBoard] = useState<string>("");
  const [boardList, setBoardList] = useState<Board[]>([]);

  useEffect(() => {
    if (!isMobile) {
      setOpenDrawer(true);
    }
  }, [isMobile]);

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    onBoardChange(board);
  }, [board]);

  useEffect(() => {
    if (project) {
      getBoard();
    }
  }, [project]);

  const addProjectButton = () => {
    setProjectDialog({
      open: true,
      type: "NEW",
      handle: (value: string) => {
        addProject(value);
      },
    });
  };
  const addBoardButton = () => {
    setBoardDialog({
      open: true,
      type: "NEW",
      handle: (value: string) => {
        addBoard(value);
      },
    });
  };

  const getBoard = async () => {
    const result: ApiResponse = await boardApi(
      "GET",
      "",
      {
        project_id: project,
      },
      {}
    );
    if (result.status) {
      setBoardList(result?.data?.boards || []);
    } else {
      setBoardList([]);
      toast.error(result.message);
    }
  };
  const getProject = async () => {
    const result: ApiResponse = await projectApi("GET", {}, {});
    if (result.status) {
      setProjectList(result?.data?.projects || []);
    } else {
      setProjectList([]);
      toast.error(result.message);
    }
  };

  const addBoard = async (boardName: string) => {
    if (!boardName) {
      toast.error("Board name is required.");
      return;
    }
    if (!project) {
      toast.error("Please select project.");
      return;
    }
    const result: ApiResponse = await boardApi(
      "POST",
      "",
      {},
      {
        project_id: project,
        title: boardName,
      }
    );
    if (result.status) {
      toast.success(result.message);
      getBoard();
    } else {
      toast.error(result.message);
    }
  };

  const addProject = async (projectName: string) => {
    if (!projectName) {
      toast.error("Project name is required.");
      return;
    }
    if (!auth.user?.user_id) {
      toast.error("User is not found.");
      return;
    }

    const result: ApiResponse = await projectApi(
      "POST",
      {},
      {
        user_id: auth.user.user_id,
        title: "project_name1",
        description: "description on project name",
      }
    );
    if (result.status) {
      toast.success(result.message);
      getProject();
    } else {
      toast.error(result.message);
    }
  };

  // const getBoardDetail = async () => {
  //   const result: ApiResponse = await boardApi("GET", `/${board}`, {}, {});
  //   if (result.status) {
  //     console.log(result.data.data);
  //   }
  // };

  const handleAvatarClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const logoutButton = () => {
    auth.logout();
  };

  return (
    <Stack>
      <AppBar>
        <Stack direction={"row"}>
          <Box
            sx={{
              width: openDrawer && !isMobile ? drawerWidth : 0,
              transition: "0.2s",
            }}
          ></Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{ padding: "0px 10px", height: 54, flex: 1 }}
          >
            {isMobile && (
              <IconButton onClick={toggleDrawer} size={"small"}>
                <Menu sx={{ color: "white" }} />
              </IconButton>
            )}
            <Typography>PTMS</Typography>
            <Box sx={{ flex: 1 }}></Box>
            <ButtonBase onClick={handleAvatarClick}>
              <Avatar sx={{ width: 30, height: 30 }} />
            </ButtonBase>
          </Stack>
        </Stack>
      </AppBar>
      <Drawer
        open={openDrawer}
        variant={isMobile ? "temporary" : "persistent"}
        onClose={() => setOpenDrawer(false)}
      >
        <Stack sx={{ width: drawerWidth }}>
          <Button onClick={addProjectButton}>Add Project</Button>
          <Select
            fullWidth
            value={project}
            onChange={(event: SelectChangeEvent) =>
              setProject(event.target.value)
            }
          >
            {projectList.map((item, index) => (
              <MenuItem key={index} value={item.project_id}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
          <Stack sx={{ flex: 1 }}>
            {boardList.map((item, index) => (
              <ListItemButton
                key={index}
                divider
                selected={item.board_id === board}
                onClick={() => setBoard(item.board_id)}
              >
                {item.title}
              </ListItemButton>
            ))}
            <Button onClick={addBoardButton}>Add Board</Button>
          </Stack>
        </Stack>
      </Drawer>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          paddingTop: "48px",
          paddingLeft: openDrawer && !isMobile ? drawerWidth + "px" : "0px",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => setAnchorEl(null)}
      >
        <Stack>
          <ListItemButton>
            <Stack>
              <Typography>Weerachai Ruecha</Typography>
              <Typography>weerachai_ruecha</Typography>
            </Stack>
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={logoutButton}>Logout</ListItemButton>
        </Stack>
      </Popover>

      <AddProjectDialog
        open={projectDialog.open}
        onClose={() =>
          setProjectDialog({
            open: false,
            type: "NEW",
            handle: () => {},
          })
        }
        handle={projectDialog.handle}
      />
      <AddBoardDialog
        open={boardDialog.open}
        onClose={() =>
          setBoardDialog({
            open: false,
            type: "NEW",
            handle: () => {},
          })
        }
        handle={boardDialog.handle}
      />
    </Stack>
  );
};

export default Layout;
