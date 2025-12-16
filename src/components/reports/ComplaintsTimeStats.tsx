import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  ButtonGroup,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface DailyItem {
  date: string;
  count: string | number;
}

interface WeeklyItem {
  week: string;
  count: string | number;
}

interface MonthlyItem {
  month: string;
  count: string | number;
}

interface ReportResponse {
  daily?: DailyItem[];
  weekly?: WeeklyItem[];
  monthly?: MonthlyItem[];
}

type Granularity = "daily" | "weekly" | "monthly";

const ComplaintsTimeStats: React.FC<{ year?: number; height?: number }> = ({
  year = new Date().getFullYear(),
  height = 320,
}) => {
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const { data, isLoading, isError, refetch, setQueryParams } =
    useFetchDataWithParams<ReportResponse>(
      "/complaints/reports/complaint-stats",
      {
        year,
      }
    );

  console.log("ComplaintsTimeStats data:", data);
  useEffect(() => {
    setQueryParams((p) => ({ ...(p || {}), year }));
  }, [year, setQueryParams]);

  const daily = data?.data.daily || [];
  const weekly = data?.data.weekly || [];
  const monthly = data?.data.monthly || [];

  const chartData =
    granularity === "daily"
      ? daily.map((d) => ({ name: d.date, value: Number(d.count) || 0 }))
      : granularity === "weekly"
      ? weekly.map((w) => ({ name: w.week, value: Number(w.count) || 0 }))
      : monthly.map((m) => ({ name: m.month, value: Number(m.count) || 0 }));

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
            إحصائيات زمنية للشكاوى ({year})
          </Typography>
          <Box>
            <ButtonGroup size="small" sx={{ mr: 1 }}>
              <Button
                variant={granularity === "daily" ? "contained" : "outlined"}
                onClick={() => setGranularity("daily")}
              >
                يومي
              </Button>
              <Button
                variant={granularity === "weekly" ? "contained" : "outlined"}
                onClick={() => setGranularity("weekly")}
              >
                أسبوعي
              </Button>
              <Button
                variant={granularity === "monthly" ? "contained" : "outlined"}
                onClick={() => setGranularity("monthly")}
              >
                شهري
              </Button>
            </ButtonGroup>
            <IconButton onClick={() => refetch()} size="small">
              <RefreshIcon />
            </IconButton>
          </Box>
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
        ) : chartData.length === 0 ? (
          <Alert severity="info">لا توجد بيانات لعرضها</Alert>
        ) : (
          <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {granularity === "monthly" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintsTimeStats;

// Usage: <ComplaintsTimeStats year={2025} />
