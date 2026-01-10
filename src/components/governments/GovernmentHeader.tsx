import React from "react";
import { Avatar, CardHeader, Chip, Stack, Typography } from "@mui/material";
import { Business } from "@mui/icons-material";

interface Props {
  name?: string;
  employeeCount?: number;
  action?: React.ReactNode;
}

const GovernmentHeader: React.FC<Props> = ({
  name,
  employeeCount = 0,
  action,
}) => {
  return (
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Business />
        </Avatar>
      }
      action={action}
      title={
        <Typography variant="h5" fontWeight="bold">
          {name}
        </Typography>
      }
      subheader={
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Chip
            size="small"
            label={`${employeeCount} موظف`}
            color="primary"
            variant="outlined"
          />
        </Stack>
      }
    />
  );
};

export default GovernmentHeader;
