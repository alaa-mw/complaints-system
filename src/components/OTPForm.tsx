import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import theme from "../styles/mainThem";
import { RegisterData } from "./RegisterStepper";
import useSendDataNoToken from "../hooks/useSendDataNoToken";
import { useNavigate } from "react-router-dom";

interface OTPFormProps {
  formData: RegisterData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;
  onPrevStep: () => void;
}

const OTPForm = ({ formData, setFormData, onPrevStep }: OTPFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const [resendCooldown, setResendCooldown] = useState(0);

  const { mutate: verifyOtp } = useSendDataNoToken(`/otps/verify-otp`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    verifyOtp(formData, {
      onSuccess: (response) => {
        setIsLoading(false);
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("userRole", formData.role);
        navigate(`${formData.role}/`);
      },
      onError: (error) => {
        setIsLoading(false);
        console.log("error:", error);
      },
    });

  };

  // const handleResendOTP = async () => {
  //   setResendCooldown(60);

  //   // Start countdown
  //   const countdown = setInterval(() => {
  //     setResendCooldown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(countdown);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   try {
  //     // Simulate resend OTP API call
  //     // await resendOTP(formData.email);
  //     // showSnackbar("تم إرسال رمز تحقق جديد", "info");
  //   } catch (error) {
  //     console.error("Resend OTP error:", error);
  //     // showSnackbar("فشل في إرسال الرمز", "error");
  //   }
  // };

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
        <IconButton
          onClick={onPrevStep}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="subtitle2" sx={{ color: "gray", mb: 1 }}>
          خطوة التحقق
        </Typography>
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          التحقق من البريد الإلكتروني
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}
      >
        تم إرسال رمز التحقق إلى بريدك الإلكتروني:
        <br />
        <strong>{formData.email}</strong>
      </Typography>

      <form onSubmit={handleSubmitOTP}>
        <TextField
          fullWidth
          label="رمز التحقق"
          name="otp"
          type="text"
          variant="outlined"
          value={formData.otp}
          onChange={handleChange}
          sx={{ mb: 3 }}
          placeholder="أدخل الرمز المكون من 6 أرقام"
          inputProps={{ maxLength: 6 }}
          required
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
          disabled={isLoading || formData.otp.length !== 6}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحقق"}
        </Button>

        {/* <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            لم تستلم الرمز؟
          </Typography>
          <Button
            variant="text"
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
            sx={{ color: theme.palette.primary.main }}
          >
            {resendCooldown > 0 
              ? `إعادة الإرسال بعد ${resendCooldown} ثانية` 
              : "إعادة إرسال الرمز"
            }
          </Button>
        </Box> */}
      </form>
    </>
  );
};

export default OTPForm;
