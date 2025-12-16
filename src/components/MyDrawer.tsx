// import logo from "../../assets/logo.png";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // Avatar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
// import drawerFrame from "../../assets/drawerFrame.png";
import {Logout } from "@mui/icons-material";
import NavItem from "./NavItem";
// import theme from "../../styles/mainThem";
// import NavItem from "./NavItem";
// import useSendData from "../../hooks/useSendData";
// import { useDispatch } from "react-redux";
// import { logoutSuccess } from "../../features/auth/Redux/authSlice";
// import { rolesConfig } from "../../rolesConfig";
// import { useNavigate } from "react-router-dom";
// import { useSelectedCourse } from "../../contexts/SelectedCourseContext";
import TokenService from '../services/tokenService';
interface MyDrawerProps {
  handleDrawerClose?: () => void;
  sidebardata: unknown;
}

const MyDrawer = ({ handleDrawerClose, sidebardata }: MyDrawerProps) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { selectedCourseId, selectedCourseName } = useSelectedCourse();

  // const { mutate: logout } = useSendData(
  //   `${rolesConfig[localStorage.getItem("userRole") || ""].apiPrefix}/logout`,
  //   undefined
  // );
  const handleLogout = () => {
    TokenService.clearTokens();
    window.location.href = "/";
    // logout(undefined, {
    //   onSuccess: () => {
    //     dispatch(logoutSuccess());
    //     window.location.href = "/";
    //   },
    // });
  };

  const role = TokenService.getUserRole();
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        height: "100vh",
        display: "flex",
        flexDirection: "column",

        // backgroundImage: `url(${drawerFrame})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <Toolbar sx={{ fontWeight: "bold" }}>
        {/* <Avatar
          src={logo}
          alt="Ajyal logo"
          sx={{
            bgcolor: "#fff",
            ml: 2,
          }}
        /> */}
        <Typography
          variant="h6"
          fontWeight={"bold"}
          color="primary.contrastText"
        >
          نظام الشكاوي
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "#fff" }} />
      {/* Main Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {sidebardata[role].map((item, index) => {
          return (
            <Box key={index}>
              <NavItem
                // eslint-disable-next-line no-constant-binary-expression
                path={`/${role}${item.path}` || ""}
                title={item.title}
                icon={item.icon}
              />
            </Box>
          );
        })}
      </List>
      <Divider sx={{ bgcolor: "#fff" }} />
      {/* Secondary Navigation */}
      <List sx={{ justifySelf: "flex-end" }}>
        {["تسجيل الخروج"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ color: "primary.contrastText" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyDrawer;
