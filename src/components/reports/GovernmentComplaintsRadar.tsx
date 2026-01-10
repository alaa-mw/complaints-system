/* eslint-disable @typescript-eslint/no-explicit-any */
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
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

interface GovItem {
  government_id: number;
  government_name: string;
  complaints_count: string | number;
}

interface Props {
  start?: string;
  end?: string;
  height?: number;
}

const GovernmentComplaintsRadar: React.FC<Props> = ({
  start,
  end,
  height = 360,
}) => {
  const { data, isLoading, isError, refetch, setQueryParams } =
    useFetchDataWithParams<GovItem[]>(
      "/complaints/reports/government-complaints",
      {
        start,
        end,
      }
    );

  useEffect(() => {
    setQueryParams((p) => ({ ...(p || {}), start, end }));
  }, [start, end, setQueryParams]);

  const items: GovItem[] = data?.data || [];

  // console.log("GovernmentComplaintsRadar data:", data);
  const chartData = items.map((it) => ({
    name: it.government_name,
    complaints: Number(it.complaints_count) || 0,
  }));

  return (
    <Card elevation={3}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            شكاوى الجهات
          </Typography>
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
        ) : chartData.length === 0 ? (
          <Alert severity="info">لا توجد بيانات لعرضها</Alert>
        ) : (
          <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} />
                <Radar
                  name="شكاوى"
                  dataKey="complaints"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value: any) => [value, "شكاوى"]} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GovernmentComplaintsRadar;

// Usage: <GovernmentComplaintsRadar start="2025-12-01" end="2025-12-10" />
