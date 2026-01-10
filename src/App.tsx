import { ThemeProvider } from "@mui/material/styles";
import LoginPage from "./components/Auth/LoginPage";
import arabicThem from "./styles/arabicThem";
import { CssBaseline } from "@mui/material";
import { Box, Fab, Tooltip } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { Route, Routes, useNavigate } from "react-router-dom";
import RegisterStepper from "./components/Auth/RegisterStepper";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/admin/HomePage";
import EmployeeHomePage from "./pages/employee/EmployeeHomePage";
import AccountsPage from "./pages/admin/AccountsPage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import GovComplaintsPage from "./pages/employee/GovComplaintsPage";
import SubmittedComplaintsPage from "./pages/employee/SubmittedComplaintsPage";
import ComplaintDetails from "./components/complaints/ComplaintDetails";
import { useEffect, useState } from "react";
import { getFirebaseToken, messaging } from "./firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";
import ProtectedRoute from "./pages/ProtectedRoute";
import TokenService from "./services/tokenService";
import AddEmployeeForm from "./components/accounts/AddEmployeeForm";
import GovernmentsPage from "./components/governments/GovernmentsPage";
import darkTheme from "./styles/darkTheme";

function App() {
  const navigate = useNavigate();
  const userToken = TokenService.getAccessToken();
  const userRole = TokenService.getUserRole();
  const [themeName, setThemeName] = useState<"dark" | "arabic">(() => {
    const saved = localStorage.getItem("appTheme");
    return saved === "dark" || saved === "arabic"
      ? (saved as "dark" | "arabic")
      : "dark";
  });

  const activeTheme = themeName === "dark" ? darkTheme : arabicThem;
  useEffect(() => {
    if (userToken && userRole) {
      navigate(`/${userRole.toLowerCase()}`);
    }
  }, [userRole, userToken]);

  useEffect(() => {
    getFirebaseToken();
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      if (payload.notification) {
        // Construct a readable message from the payload
        const messageTitle = payload.notification.title || "New Notification";
        const messageBody =
          payload.notification.body || "You have a new message.";

        // Show the alert
        alert(`${messageTitle}\n\n${messageBody}`);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next = themeName === "dark" ? "arabic" : "dark";
    setThemeName(next);
    try {
      localStorage.setItem("appTheme", next);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterStepper />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="*" element={<div>later</div>} />
              <Route index element={<HomePage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="accounts/add" element={<AddEmployeeForm />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="governments" element={<GovernmentsPage />} />
              {/* <Route path="governments/:id" element={<GovernmentDetails />} /> */}
              <Route
                path="complaints/:id"
                element={<ComplaintDetails isAdmin={true} />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employee" element={<EmployeeDashboard />}>
              <Route path="*" element={<div>later</div>} />
              {/* <Route index element={<EmployeeHomePage />} /> */}
              <Route path="accounts" element={<div>later</div>} />
              <Route path="complaints" element={<GovComplaintsPage />} />
              <Route
                path="submittedcomplaints"
                element={<SubmittedComplaintsPage />}
              />
              <Route
                path="submittedcomplaints/:id"
                element={<ComplaintDetails />}
              />
            </Route>
          </Route>
        </Routes>
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
          }}
        >
          <Tooltip
            title={
              themeName === "dark"
                ? "تغيير للوضع النهاري"
                : "تغيير للوضع الليلي"
            }
          >
            <Fab
              color="primary"
              onClick={toggleTheme}
              aria-label="toggle-theme"
            >
              <PaletteIcon />
            </Fab>
          </Tooltip>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
