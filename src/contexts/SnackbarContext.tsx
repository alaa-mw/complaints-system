import React, { createContext, useContext, useState } from "react";
import { AlertColor, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import theme from "../styles/mainThem";

interface SnackbarContextType {
  showSnackbar: (message: string, severity: AlertColor) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showSnackbar = (msg: string, sev: AlertColor = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const hideSnackbar = () => setOpen(false);

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar: showSnackbar, hideSnackbar }}
    >
      {children}
      <Snackbar
        open={open}
        // autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor:
              severity === "success"
                ? theme.palette.snackbar.success
                : severity === "error"
                ? theme.palette.snackbar.error
                : severity === "warning"
                ? theme.palette.snackbar.warning
                : theme.palette.snackbar.info,

            "& .MuiAlert-message": {
              px: 1,
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
