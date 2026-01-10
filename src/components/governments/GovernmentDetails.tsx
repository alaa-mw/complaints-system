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
  Skeleton,
  Alert,
} from "@mui/material";
import { People } from "@mui/icons-material";

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

const GovernmentDetails: React.FC<{ governmentId?: string }> = ({
  governmentId,
}) => {
  const { id: routeId } = useParams<{ id: string }>();
  const fetchId = governmentId ?? routeId;
  const { data, isLoading, isError, refetch } =
    useFetchData<GovernmentDetailsResponse>(`/government/${fetchId}`);

  const { showSnackbar } = useSnackbar();
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { mutate: deleteEmployee } = useDeleteData(
    `/government/${fetchId}/users`
  );

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
        <Card sx={{ width: 800, mx: "auto", mt: 2, p: 2 }}>
          <Skeleton variant="text" width="50%" height={36} />
          <Skeleton variant="text" width="30%" height={20} />

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="text" width={180} />
                </Box>
                <Skeleton variant="text" width={60} />
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>
    );
  if (isError) return <Alert severity="error">خطأ في جلب بيانات الجهة</Alert>;

  const gov = data?.data;

  return (
    <Card sx={{ maxWidth: 800, minWidth: 340, mx: "auto", mt: 2 }}>
      {/* Header with action menu */}
      <GovernmentHeader
        name={gov?.name}
        employeeCount={gov?.emmployees?.length || 0}
      />

      <Divider />

      <CardContent>
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
    </Card>
  );
};

export default GovernmentDetails;
