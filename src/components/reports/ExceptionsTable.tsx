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

interface ExceptionStat {
  action: string;
  controller: string;
  exceptionName: string;
  count: string | number;
}

const ExceptionsTable: React.FC = () => {
  const { data, isLoading, error } = useFetchData<ExceptionStat[]>(
    "/audit-stats/exceptions"
  );
//  const mockData: ExceptionStat[] = [
//     {
//       action: "GET /audit-stats/exceptions",
//       controller: "AuditStatsController",
//       exceptionName: "TypeError",
//       count: 1,
//     },
//     {
//       action: "GET /audit-stats/controllers",
//       controller: "AuditStatsController",
//       exceptionName: "TypeError",
//       count: 1,
//     },
//   ];

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
          لا توجد استثناءات
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Top Exceptions
      </Typography>
      <TableContainer sx={{width:{ xs: '90vw', md: 'auto'}}}>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>Exception</TableCell>
              <TableCell>Controller</TableCell>
              <TableCell>Action</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={idx}>
                <TableCell>{it.exceptionName}</TableCell>
                <TableCell>{it.controller}</TableCell>
                <TableCell
                  sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                >
                  {it.action}
                </TableCell>
                <TableCell align="right">{Number(it.count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ExceptionsTable;
