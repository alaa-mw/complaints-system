import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Email, Person, Delete } from "@mui/icons-material";

export interface Employee {
  id: number;
  full_name: string;
  email: string;
}

interface Props {
  emp: Employee;
  onDelete: (id: number) => void;
  deleting?: boolean;
  disableDelete?: boolean;
}

const EmployeeListItem: React.FC<Props> = ({
  emp,
  onDelete,
  deleting = false,
  disableDelete = false,
}) => {
  return (
    <ListItem
      sx={{
        mx:2,
        py: 1.5,
        "&:hover": { bgcolor: "action.hover" },
        transition: "background-color 0.2s",
      }}
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="إرسال بريد">
            <IconButton edge="end" size="small">
              <Email fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="حذف موظف">
            <span>
              <IconButton
                edge="end"
                size="small"
                color="error"
                onClick={() => onDelete(emp.id)}
                disabled={deleting || disableDelete}
              >
                {deleting ? (
                  <CircularProgress size={18} />
                ) : (
                  <Delete fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "secondary.main" }}>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={emp.full_name} secondary={emp.email} />
    </ListItem>
  );
};

export default EmployeeListItem;
