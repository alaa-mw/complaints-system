import { Paper } from "@mui/material";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import OTPForm from "./OTPForm";
import theme from "../../styles/mainThem";

type Step = "registration" | "verification";

export interface RegisterData {
  role: "admin" | "employee";
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  otp: string;
}

const RegisterStepper = () => {
  const [step, setStep] = useState<Step>("registration");

  const [formData, setFormData] = useState<RegisterData>({
    role: "employee",
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    otp: "",
  });

  const handleNextStep = () => {
    setStep("verification");
  };

  const handlePrevStep = () => {
    setStep("registration");
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          p: 4,
          mt: 1,
          // backgroundColor: "white",
          borderRadius: 2,
          border: `1px solid ${theme.palette.tertiary?.main || "#ccc"}`,
        }}
      >
        {step === "registration" ? (
          <RegisterForm
            onNextStep={handleNextStep}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <OTPForm
            formData={formData}
            setFormData={setFormData}
            onPrevStep={handlePrevStep}
          />
        )}
      </Paper>
    </>
  );
};

export default RegisterStepper;
