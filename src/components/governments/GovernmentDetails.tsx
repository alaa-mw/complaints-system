import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import useDeleteData from "../../hooks/useDeleteData";
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
  const { data, isLoading, isError } = useFetchData<GovernmentDetailsResponse>(
    `/government/${id}`
  );

  const { showSnackbar } = useSnackbar();
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const {mutate:deleteEmployee} = useDeleteData(`/government/${id}/users`);

  const handleDeleteEmployee = (empId: number) => {
    setDeletingId(empId);
    deleteEmployee(
      { userIds: [empId] },
      {
        onSuccess: () => {
          showSnackbar("تم حذف الموظف من الجهة", "success");
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
          <IconButton color="success">
            <PersonAdd />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default GovernmentDetails;
