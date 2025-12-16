import React from "react";
import { List, Box, Divider, Typography } from "@mui/material";
import EmployeeListItem, { Employee } from "./EmployeeListItem";

interface Props {
  employees?: Employee[];
  deletingId?: number | null;
  onDelete: (id: number) => void;
}

const EmployeesList: React.FC<Props> = ({
  employees = [],
  deletingId = null,
  onDelete,
}) => {
  if (!employees || employees.length === 0) {
    return (
      <Box
        sx={{ p: 3, textAlign: "center", bgcolor: "grey.50", borderRadius: 1 }}
      >
        <Typography variant="body1" color="text.secondary">
          لا يوجد موظفين مسجلين
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
      {employees.map((emp, index) => (
        <div key={emp.id}>
          <EmployeeListItem
            emp={emp}
            onDelete={onDelete}
            deleting={deletingId === emp.id}
          />
          {index < employees.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </div>
      ))}
    </List>
  );
};

export default EmployeesList;
