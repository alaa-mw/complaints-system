import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import useFetchData from "../../hooks/useFetchData";

interface ControllerStat {
  controller: string;
  count: string | number;
}

const ControllersTable: React.FC = () => {
  const { data, isLoading, error } = useFetchData<ControllerStat[]>(
    "/audit-stats/controllers"
  );

  // const mockData: ControllerStat[] = [
  //   { controller: "AuditStatsController", count: 2 },
  //   { controller: "AuditStatsController2", count: 4 },
  // ];

  const items = data?.data || [];

  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">حدث خطأ أثناء جلب البيانات</Typography>
      </Paper>
    );
  }

  if (!items.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          لا توجد بيانات
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Top Controllers
      </Typography>
      <TableContainer sx={{ width: { xs: "90vw", md: "auto" } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Controller</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={idx}>
                <TableCell>{it.controller}</TableCell>
                <TableCell align="right">{Number(it.count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ControllersTable;
