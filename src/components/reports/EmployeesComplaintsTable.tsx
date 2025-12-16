import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";

interface EmployeeItem {
  employee_id: number;
  employee_name: string;
  total_complaints: string | number;
}

interface Props {
  start?: string;
  end?: string;
}

const EmployeesComplaintsTable: React.FC<Props> = ({ start, end }) => {
  const { data, isLoading, isError, refetch, setQueryParams } =
    useFetchDataWithParams<EmployeeItem[]>(
      "/complaints/reports/employees-complaints-by-range",
      {
        start,
        end,
      }
    );
  console.log("EmployeesComplaintsTable data:", data);
  useEffect(() => {
    setQueryParams((p) => ({ ...(p || {}), start, end }));
  }, [start, end, setQueryParams]);

  const items = data?.data || [];

  return (
    <Card elevation={0}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            شكاوى الموظفين
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={160}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">حدث خطأ أثناء جلب البيانات</Alert>
        ) : items.length === 0 ? (
          <Alert severity="info">لا توجد بيانات لعرضها</Alert>
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>الموظف</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    مجموع الشكاوى
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.employee_id} hover>
                    <TableCell>{it.employee_name}</TableCell>
                    <TableCell>{Number(it.total_complaints)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesComplaintsTable;
