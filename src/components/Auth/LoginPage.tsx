import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../styles/mainThem";
import useSendDataNoToken from "../../hooks/useSendDataNoToken";
import { useNavigate } from "react-router-dom";
import TokenService from "../../services/tokenService";
import { getFcmTokenAsString } from "../../firebase/firebaseConfig";
import { useSnackbar } from "../../contexts/SnackbarContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
    fcm_token: "", // start empty
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getFcmTokenAsString();
        setFormData((prev) => ({ ...prev, fcm_token: token }));
      } catch (err) {
        console.error("Failed to get FCM token:", err);
      }
    })();
  }, []);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { mutate: signIn } = useSendDataNoToken<{
    accessToken: string;
    refreshToken: string;
  }>("/authentication/sign-in");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRole: string | null
  ) => {
    if (newRole !== null) {
      setFormData((prev) => ({ ...prev, role: newRole }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData is submitted", formData);
    signIn(formData, {
      onSuccess: (response) => {
        TokenService.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
        TokenService.setUserRole(formData.role);
        navigate(`/${formData.role}`);
      },
      onError: (error) => {
        showSnackbar(error.message, "error");
        console.error("error:", error);
      },
    });
  };
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        p: 4,
        mt: 1,
        backgroundColor: "white",
        borderRadius: 2,
        border: `1px solid ${theme.palette.tertiary.main}`,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ color: "gray", mb: 1 }}>
          نظام الشكاوي الحكومية
        </Typography>
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          تسجيل الدخول
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ToggleButtonGroup
            value={formData.role}
            exclusive
            onChange={handleRoleChange}
            aria-label="User role"
            sx={{
              "& .MuiToggleButton-root": {
                px: 3,
                py: 1,
                border: `1px solid ${theme.palette.primary.main}`,
                "&.Mui-selected": {
                  backgroundColor: `${theme.palette.primary.main}`,
                  color: "white",
                  "& + .MuiToggleButton-root": {
                    borderLeft: `1px solid ${theme.palette.primary.main}`,
                  },
                },
                "&:not(.Mui-selected)": {
                  color: theme.palette.primary.main,
                },
              },
              // RTL group container
              "&.MuiToggleButtonGroup-root": {
                flexDirection: "row-reverse", // Reverse button order for RTL
              },
            }}
          >
            <ToggleButton value="admin" aria-label="admin" sx={{ width: 90 }}>
              مشرف عام
            </ToggleButton>
            <ToggleButton
              value="employee"
              aria-label="employee"
              sx={{ width: 90 }}
            >
              موظف
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 3 }}
          required
        />

        <TextField
          fullWidth
          label="كلمة المرور"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 3 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          size="large"
          sx={{
            py: 1.5,
            mb: 2,
            //   background: `${theme.palette.gradient.primary}`,
          }}
        >
          {/* {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : ( */}
          دخول
          {/* )} */}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
          ليس لديك حساب؟{" "}
          <a href="/register" style={{ color: "primary.main" }}>
            سجل الآن
          </a>
        </Typography>
      </form>
    </Paper>
  );
};

export default LoginPage;
