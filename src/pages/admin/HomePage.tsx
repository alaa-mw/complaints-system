import ComplaintsStatusPie from "../../components/reports/ComplaintsStatusPie";
import GovernmentComplaintsRadar from "../../components/reports/GovernmentComplaintsRadar";
import EmployeesComplaintsTable from "../../components/reports/EmployeesComplaintsTable";
import ComplaintsTimeStats from "../../components/reports/ComplaintsTimeStats";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";
import { RTLDatePicker } from "../../components/common/RTLDatePicker";
import { useState } from "react";
import ExceptionsTable from "../../components/reports/ExceptionsTable";
import ControllersTable from "../../components/reports/ControllersTable";

const HomePage = () => {
  const [date, setDate] = useState({
    start_date: "",
    end_date: "",
  });
  const [section, setSection] = useState<"system" | "tech">("system");

  return (
    <Container sx={{ paddingX: { xs: 2, md: 4 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        mb={3}>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={2}>
        الإحصائيات
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <ButtonGroup variant="contained" sx={{  flexDirection: 'row-reverse' }}>
          <Button
            color={section === "system" ? "primary" : "inherit"}
            onClick={() => setSection("system")}
          >
            أدائية
          </Button>
          <Button
            color={section === "tech" ? "primary" : "inherit"}
            onClick={() => setSection("tech")}
          >
            تقنية
          </Button>
        </ButtonGroup>
      </Box>
      </Stack>
      <Stack
        sx={{ p: 1, borderRadius: 1, boxShadow: 2 }}
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={3}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          تاريخ البدء
        </Typography>
        <RTLDatePicker
          value={date.start_date}
          onChange={(d) => setDate((prev) => ({ ...prev, start_date: d }))}
        />
        <Typography
          variant="subtitle1"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          تاريخ الانتهاء
        </Typography>
        <RTLDatePicker
          value={date.end_date}
          onChange={(d) => setDate((prev) => ({ ...prev, end_date: d }))}
          minDate={date.start_date}
        />
      </Stack>

      

      <Grid container spacing={3}>
        {section === "system" ? (
          <>
            {/* حول النظام */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex", // ⬅️ هذا هو المفتاح!
                flexDirection: "column",
              }}
            >
              {" "}
              <ComplaintsStatusPie
                start={date.start_date}
                end={date.end_date}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ flexGrow: 1 }}>
              <GovernmentComplaintsRadar
                start={date.start_date}
                end={date.end_date}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ComplaintsTimeStats year={new Date().getFullYear()} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {" "}
              <EmployeesComplaintsTable />
            </Grid>
          </>
        ) : (
          <>
            {/* تقنية */}
            <Grid size={{ xs: 12, md: 8 }}>
              {" "}
              <ExceptionsTable />
            </Grid>
            <Grid size={{ xs: 12, md: 4}}>
              {" "}
              <ControllersTable />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
