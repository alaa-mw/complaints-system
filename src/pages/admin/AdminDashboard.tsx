import { useRef } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveDrawer, {
  drawerWidth,
} from "../../components/ResponsiveDrawer";
import { sidebarData } from "../../static/sidebarData";

const AdminDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Create the ref
  console.log("containerRef:", containerRef.current);
  return (
    <>
      <Box ref={containerRef}>
        <ResponsiveDrawer
          container={containerRef.current}
          sidebardata={sidebarData}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: {
              xs: 1,
              s: 1, //how add new
              sm: 3,
              md: 3,
              lg: 3,
              xl: 3,
            },
            pt: { xs: 7, s: 7 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginRight: { sm: `${drawerWidth}px` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
