import React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Grid,
  useTheme,
  IconButton,
  Skeleton,
} from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import useFetchData from "../../hooks/useFetchData";
import GovernmentDetails from "./GovernmentDetails";

interface Government {
  id: number;
  name: string;
  description?: string;
}

const GovernmentsPage: React.FC = () => {
  const theme = useTheme();
  const { data, isLoading } = useFetchData<Government[]>("/government/all");
  const governments = data?.data || [];
  const [selectedId, setSelectedId] = React.useState<string | null>(
    governments.length > 0 ? governments[0].id.toString() : null
  );

  React.useEffect(() => {
    if (!selectedId && governments.length > 0) {
      setSelectedId(governments[0].id.toString());
    }
  }, [governments, selectedId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "100vh",
      }}
    >
      {/* Toolbar: horizontal scrollable cards */}
      <Box sx={{ width: {xs:"90vw",md:"auto"}, overflowX: "auto", pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ px: 1 }}>
          {isLoading
            ? // skeleton placeholders while loading
              Array.from({ length: 4 }).map((_, i) => (
                <Paper
                  key={i}
                  elevation={1}
                  sx={{
                    minWidth: 200,
                    maxWidth: 260,
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton width="60%" height={20} />
                  </Box>
                  <Skeleton width="80%" height={12} />
                </Paper>
              ))
            : // map governments to small cards
              governments.map((gov) => {
                const isSelected = selectedId === gov.id.toString();
                return (
                  <Paper
                    key={gov.id}
                    onClick={() => setSelectedId(gov.id.toString())}
                    elevation={isSelected ? 6 : 1}
                    sx={{
                      minWidth: 200,
                      maxWidth: 260,
                      p: 2,
                      cursor: "pointer",
                      borderRadius: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                      flexDirection: "column",
                      border: `2px solid ${
                        isSelected ? theme.palette.primary.main : "transparent"
                      }`,
                      backgroundColor: isSelected
                        ? theme.palette.primary.light + "10"
                        : "background.paper",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.primary.main + "22",
                          color: theme.palette.primary.main,
                        }}
                      >
                        <LocationCityIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {gov.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, textAlign: "right" }}
                    >
                      {gov.description}
                    </Typography>
                  </Paper>
                );
              })}
        </Stack>
      </Box>

      {/* Details area below */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid sx={{xs:12}} >
          {selectedId ? (
            <GovernmentDetails governmentId={selectedId} />
          ) : (
            <Paper sx={{ p: 3, width: 800 }}>
              <Typography>اختر جهة لعرض التفاصيل</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GovernmentsPage;
