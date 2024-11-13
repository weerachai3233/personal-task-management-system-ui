import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
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
import React, { useEffect, useState, MouseEvent, ReactNode } from "react";
import { Menu } from "@mui/icons-material";

const Layout = ({ children }: { children: ReactNode }) => {
  const drawerWidth = 200;
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const [project, setProject] = useState<string>("");

  useEffect(() => {
    if (!isMobile) {
      setOpenDrawer(true);
    }
  }, [isMobile]);

  const handleAvatarClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
          <Select
            fullWidth
            value={project}
            onChange={(event: SelectChangeEvent) =>
              setProject(event.target.value)
            }
          >
            <MenuItem value={"Project1"}>Project1</MenuItem>
            <MenuItem value={"Project2"}>Project2</MenuItem>
            <MenuItem value={"Project3"}>Project3</MenuItem>
            <MenuItem value={"Project4"}>Project4</MenuItem>
          </Select>
          <Stack sx={{ flex: 1 }}>
            <ListItemButton divider>Board</ListItemButton>
            <ListItemButton divider>Board</ListItemButton>
            <ListItemButton selected divider>
              Board
            </ListItemButton>
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
          <ListItemButton>Logout</ListItemButton>
        </Stack>
      </Popover>
    </Stack>
  );
};

export default Layout;
