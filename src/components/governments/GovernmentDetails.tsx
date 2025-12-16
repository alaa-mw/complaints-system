import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import useDeleteData from "../../hooks/useDeleteData";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";
import useSendData from "../../hooks/useSendData";
import { useSnackbar } from "../../contexts/SnackbarContext";
import GovernmentHeader from "./GovernmentHeader";
import EmployeesList from "./EmployeesList";
import type { Employee as EmployeeType } from "./EmployeeListItem";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { People, Description, MoreVert, PersonAdd } from "@mui/icons-material";

interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  is_verified: boolean;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface GovernmentDetailsResponse {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  emmployees?: Employee[];
}

const GovernmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } =
    useFetchData<GovernmentDetailsResponse>(`/government/${id}`);

  const { showSnackbar } = useSnackbar();
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { mutate: deleteEmployee } = useDeleteData(`/government/${id}/users`);

  // Add employee dialog state
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null
  );

  // Fetch users with role=employee for selection
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    refetch: refetchAccounts,
  } = useFetchDataWithParams<{ data: Employee[] }>("/users/all-users", {
    role: "employee",
  
  });

  const { mutate: addEmployee, isPending: isAddingEmployee } = useSendData<{
    message: string;
    status: string;
  }>(`/government/${id}/users`);

  const handleAddEmployee = (userId: number) => {
    if (!id) return;
    setSelectedUserId(userId);
    addEmployee(
      { userIds: [userId] },
      {
        onSuccess: (res) => {
          showSnackbar(res.message || "تمت الإضافة", "success");
          setAddDialogOpen(false);
          refetch();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "حدث خطأ";
          showSnackbar(msg, "error");
        },
        onSettled: () => setSelectedUserId(null),
      }
    );
  };

  const handleDeleteEmployee = (empId: number) => {
    setDeletingId(empId);
    deleteEmployee(
      { userIds: [empId] },
      {
        onSuccess: () => {
          showSnackbar("تم حذف الموظف من الجهة", "success");
          refetch();
        },
        onError: () => {
          showSnackbar("حدث خطأ أثناء الحذف", "error");
        },
        onSettled: () => setDeletingId(null),
      }
    );
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">خطأ في جلب بيانات الجهة</Alert>;

  const gov = data?.data;

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
      {/* Header with action menu */}
      <GovernmentHeader
        name={gov?.name}
        employeeCount={gov?.emmployees?.length || 0}
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
      />

      <Divider />

      <CardContent>
        {/* Description section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Description color="action" fontSize="small" />
            <Typography
              variant="subtitle1"
              color="text.primary"
              fontWeight="medium"
            >
              الوصف
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              borderLeft: "4px solid",
              borderColor: "primary.light",
            }}
          >
            {gov?.description || "لا يوجد وصف متاح"}
          </Typography>
        </Box>

        {/* Employees section */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <People color="action" />
            <Typography variant="h6" fontWeight="medium">
              الموظفين ({gov?.emmployees?.length || 0})
            </Typography>
          </Stack>

          <EmployeesList
            employees={gov?.emmployees as EmployeeType[] | undefined}
            deletingId={deletingId}
            onDelete={handleDeleteEmployee}
          />
        </Box>
      </CardContent>

      {/* Footer actions */}
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Tooltip title="إضافة موظف">
          <IconButton
            color="success"
            onClick={() => {
              setAddDialogOpen(true);
              refetchAccounts();
            }}
          >
            <PersonAdd />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Add Employee Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>إضافة موظف إلى الجهة</DialogTitle>
        <DialogContent>
          {isAccountsLoading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {accountsData?.data?.data &&
                accountsData.data.data.length === 0 && (
                  <Alert severity="info">لا يوجد موظفين لعرضهم</Alert>
                )}
              {accountsData?.data?.data &&
                accountsData.data.data.length > 0 && (
                  <Box sx={{ display: "grid", gap: 1 }}>
                    {accountsData.data.data.map((acc: Employee) => (
                      <Box
                        key={acc.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          borderBottom: "1px solid",
                        }}
                      >
                        <Box>
                          <Typography fontWeight="bold">
                            {acc.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {acc.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Button
                            size="small"
                            disabled={
                              isAddingEmployee || selectedUserId === acc.id
                            }
                            onClick={() => handleAddEmployee(acc.id)}
                          >
                            {isAddingEmployee && selectedUserId === acc.id
                              ? "جارٍ الإضافة..."
                              : "اختيار"}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={isAddingEmployee}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default GovernmentDetails;
