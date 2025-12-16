/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import usePatchData from "../../hooks/usePatchData";
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";

type Choice = {
  id: number;
  value: string;
  label: string;
  color: "success" | "error";
};
const choices: Choice[] = [
  { id: 3, value: "منجزة", label: "منجزة", color: "success" },
  { id: 2, value: "مرفوضة", label: "مرفوضة", color: "error" },
];

const ChangeStatusButton = ({
  complaintId,
  chooseStatus = false,
}: {
  complaintId: number;
  chooseStatus?: boolean;
}) => {
  const { mutate: changeStatus } = usePatchData(
    `/complaints/change-status/${complaintId}`
  );

  const { showSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const exec = (statusValue: string) => {
    changeStatus(
      { status: statusValue },
      {
        onSuccess: (response) => {
          showSnackbar(response.message, "success");
          closeMenu();
        },
        onError: (error) => {
          console.error("change status error", error);
          showSnackbar(error.message, "error");
        },
      }
    );
  };

  if (!chooseStatus) {
    return (
      <Button
        size="small"
        variant="contained"
        onClick={() => exec("قيد المعالجة")}
      >
       بدء التنفيذ
      </Button>
    );
  }

  return (
    <>
      <Button size="small" variant="contained" onClick={openMenu}>
        تغيير الحالة
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {choices.map((c) => (
          <MenuItem key={c.id} onClick={() => exec(c.value)}>
            <ListItemText>{c.label}</ListItemText>
            <ListItemIcon>
              <Chip label={c.label} size="small" color={c.color as any} />
            </ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ChangeStatusButton;
