import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import theme from "../styles/mainThem";
import { RegisterData } from "./RegisterStepper";
import useSendDataNoToken from "../hooks/useSendDataNoToken";

interface RegisterFormProps {
  onNextStep: () => void;
  formData: RegisterData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;
}

const RegisterForm = ({
  onNextStep,
  formData,
  setFormData,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signUp } = useSendDataNoToken(
    `/authentication/${formData.role}/sign-up`
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRole: string | null
  ) => {
    if (newRole !== null) {
      setFormData((prev) => ({
        ...prev,
        role: newRole as "admin" | "employee",
      }));
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    signUp(formData, {
      onSuccess: (response) => {
        console.log("response",response);
        setIsLoading(false);
        onNextStep();
      },
      onError: (error) => {
        setIsLoading(false);
        console.log("error:", error);
      },
    });
  };

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="subtitle2" sx={{ color: "gray", mb: 1 }}>
          أهلاً بك في نظام الشكاوي ..!
        </Typography>
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          التسجيل لأول مرة
        </Typography>
      </Box>

      <form onSubmit={handleSubmitRegistration}>
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
          label="الاسم الكامل"
          name="full_name"
          type="text"
          variant="outlined"
          value={formData.full_name}
          onChange={handleChange}
          sx={{ mb: 3 }}
          required
        />
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
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="تأكيد كلمة المرور"
          name="password_confirmation"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password_confirmation}
          onChange={handleChange}
          sx={{ mb: 3 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            background:
              theme.palette.gradient?.primary || theme.palette.primary.main,
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "تسجيل"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
          لديك حساب بالفعل؟{" "}
          <a href="/" style={{ color: theme.palette.primary.main }}>
            سجل الدخول
          </a>
        </Typography>
      </form>
    </>
  );
};

export default RegisterForm;
