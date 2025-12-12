import { ThemeProvider } from "@emotion/react";
import LoginPage from "./components/Auth/LoginPage";
import arabicThem from "./styles/arabicThem";
import { CssBaseline } from "@mui/material";
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
import ComplaintDetails from "./components/ComplaintDetails";
import { useEffect } from "react";
import { getFirebaseToken, messaging } from "./firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";
import ProtectedRoute from "./pages/ProtectedRoute";
import TokenService from "./services/tokenService";

function App() {
  const navigate = useNavigate();
  const userToken = TokenService.getAccessToken();
  const userRole = TokenService.getUserRole();
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

  return (
    <>
      <ThemeProvider theme={arabicThem}>
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
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route
                path="complaints/:id"
                element={<ComplaintDetails isAdmin={true} />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employee" element={<EmployeeDashboard />}>
              <Route path="*" element={<div>later</div>} />
              <Route index element={<EmployeeHomePage />} />
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
      </ThemeProvider>
    </>
  );
}

export default App;
