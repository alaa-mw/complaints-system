import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";

interface StatusItem {
  status: string;
  count: number;
  percentage: number;
}

interface ReportData {
  total: number;
  statuses: StatusItem[];
}

interface ComplaintsStatusPieProps {
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
  height?: number;
}

const ComplaintsStatusPie: React.FC<ComplaintsStatusPieProps> = ({
  start,
  end,
  height = 320,
}) => {
  const { data, isLoading, isError, refetch, setQueryParams } =
    useFetchDataWithParams<ReportData>(
      "/complaints/reports/complaints-status",
      { start, end }
    );

  useEffect(() => {
    setQueryParams((p) => ({ ...(p || {}), start, end }));
  }, [start, end, setQueryParams]);

  const statuses = data?.data?.statuses || [];
  const total = data?.data?.total ?? statuses.reduce((s, i) => s + i.count, 0);

  const pieData = statuses.map((s) => ({
    name: s.status,
    value: s.count,
    percentage: s.percentage,
  }));

  const COLORS = ["#92e895ff", "#ffbe5cff", "#f77e75ff", "#76aedcff", "#d582e4ff"];

  return (
    <Card elevation={3} sx={{flexGrow:1}}>
      <CardContent sx={{ maxWidth: "400px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              نسب الشكاوي
            </Typography>
            <Typography variant="caption" color="text.secondary">
              المجموع: {total}
            </Typography>
          </Box>
          <IconButton onClick={() => refetch()} size="small">
            <RefreshIcon />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={height}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">حدث خطأ أثناء جلب البيانات</Alert>
        ) : pieData.length === 0 ? (
          <Alert severity="info">لا توجد بيانات لعرضها</Alert>
        ) : (
          <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={height * 0.2}
                  outerRadius={Math.min(120, height * 0.4)}
                  label={(entry) =>
                    `${entry?.name ?? ""} (${entry?.value ?? 0})`
                  }
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const d = pieData.find(
                      (p) => p.name === name && p.value === value
                    );
                    return [`${value}`, d ? `${d.percentage}%` : name];
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintsStatusPie;
