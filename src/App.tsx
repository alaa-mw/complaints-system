import { ThemeProvider } from "@emotion/react";
import LoginPage from "./components/LoginPage";
import arabicThem from "./styles/arabicThem";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import RegisterStepper from "./components/RegisterStepper";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/admin/HomePage";
import EmployeeHomePage from "./pages/employee/EmployeeHomePage";
import AccountsPage from "./pages/admin/AccountsPage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import GovComplaintsPage from "./pages/employee/GovComplaintsPage";
import SubmittedComplaintsPage from "./pages/employee/SubmittedComplaintsPage";
import ComplaintDetails from "./components/ComplaintDetails";

function App() {
  return (
    <>
      <ThemeProvider theme={arabicThem}>
        <CssBaseline />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterStepper />} />

          <Route path="/admin" element={<AdminDashboard />}>
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route index element={<HomePage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
          </Route>

          <Route path="/employee" element={<EmployeeDashboard />}>
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route index element={<EmployeeHomePage />} />
            {/* <Route path="accounts" element={<AccountsPage />} /> */}
            <Route path="complaints" element={<GovComplaintsPage />} />
            <Route path="submittedcomplaints" element={<SubmittedComplaintsPage />} />
            <Route path="submittedcomplaints/:id" element={<ComplaintDetails />} />
          </Route>
        </Routes>

        {/* <EmployeeDashboard/> */}
      </ThemeProvider>
    </>
  );
}

export default App;
