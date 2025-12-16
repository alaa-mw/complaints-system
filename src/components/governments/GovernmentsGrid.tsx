import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import useFetchData from "../../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

interface Government {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const GovernmentsGrid: React.FC = () => {
  const { data, isLoading } = useFetchData<Government[]>("/government/all");
  const navigate = useNavigate();

  return (
    <Box>
      <Grid container spacing={2}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          data?.data.map((g) => (
            <Grid sx={{ xs: 12, md:6}} key={g.id}>
              <Card sx={{ height: "100%", minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {g.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {g.description}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate(`${g.id}`)}
                  >
                    عرض
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default GovernmentsGrid;
