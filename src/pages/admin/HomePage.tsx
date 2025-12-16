import ComplaintsStatusPie from "../../components/reports/ComplaintsStatusPie";
import GovernmentComplaintsRadar from "../../components/reports/GovernmentComplaintsRadar";
import EmployeesComplaintsTable from "../../components/reports/EmployeesComplaintsTable";
import ComplaintsTimeStats from "../../components/reports/ComplaintsTimeStats";
import { Grid, Stack, Typography } from "@mui/material";
import { RTLDatePicker } from "../../components/common/RTLDatePicker";
import { useState } from "react";

const HomePage = () => {
  const [date, setDate] = useState({
    start_date: "",
    end_date: "",
  });
  return (
    <>
      <Stack
        sx={{ backgroundColor: "white", p: 1, borderRadius: 2 }}
        direction="row"
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
          تاريخ البدء *
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
          تاريخ الانتهاء *
        </Typography>
        <RTLDatePicker
          value={date.end_date}
          onChange={(d) => setDate((prev) => ({ ...prev, end_date: d }))}
          minDate={date.start_date}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          {" "}
          <ComplaintsStatusPie start={date.start_date} end={date.end_date} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
      </Grid>
    </>
  );
};

export default HomePage;
