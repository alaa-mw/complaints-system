import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { PersonAdd, Save, Clear } from "@mui/icons-material";
import useSendData from "../../hooks/useSendData";

interface EmployeeFormData {
  full_name: string;
  email: string;
  phone_number: string;
}

interface EmployeeResponse {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

const AddEmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof EmployeeFormData, boolean>>
  >({});

  const {
    mutate: addEmployee,
    isPending,
    isError,
    error,
    isSuccess,
  } = useSendData<EmployeeResponse>("/authentication/employees");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};

    // Validate full name
    if (!formData.full_name.trim()) {
      newErrors.full_name = "الاسم الكامل مطلوب";
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "الاسم الكامل يجب أن يكون على الأقل حرفين";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // Validate phone number
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "رقم الهاتف مطلوب";
    } else if (!/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
    } else if (formData.phone_number.length < 7) {
      newErrors.phone_number = "رقم الهاتف يجب أن يكون على الأقل 7 أرقام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      full_name: true,
      email: true,
      phone_number: true,
    });

    if (validateForm()) {
      console.log("Submitting employee data:", formData);
      addEmployee(formData, {
        onSuccess: (response) => {
          console.log("Employee added successfully:", response);
          handleReset();
        },
        onError: (error) => {
          console.error("Failed to add employee:", error);
        },
      });
    }
  };

  const handleReset = () => {
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
    });
    setErrors({});
    setTouched({});
  };

  const getFieldError = (field: keyof EmployeeFormData): string => {
    return touched[field] ? errors[field] || "" : "";
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 800, margin: "auto" }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <PersonAdd sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            إضافة موظف جديد
          </Typography>
          <Typography variant="body1" color="text.secondary">
            قم بإضافة بيانات الموظف الجديد إلى النظام
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Success Message */}
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            تم إضافة الموظف بنجاح!
          </Alert>
        )}

        {/* Error Message */}
        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error?.message || "حدث خطأ أثناء إضافة الموظف"}
          </Alert>
        )}

        {/* Form */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Full Name Field */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="الاسم الكامل"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError("full_name")}
                  helperText={getFieldError("full_name")}
                  disabled={isPending}
                  placeholder="أدخل الاسم الكامل للموظف"
                />
              </Grid>

              {/* Email Field */}
              <Grid size={{ xs: 12, md: 6 }}>
                {" "}
                <TextField
                  fullWidth
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError("email")}
                  helperText={getFieldError("email")}
                  disabled={isPending}
                  placeholder="employee@example.com"
                />
              </Grid>

              {/* Phone Number Field */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError("phone_number")}
                  helperText={getFieldError("phone_number")}
                  disabled={isPending}
                  placeholder="123456789"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleReset}
                    disabled={isPending}
                    size="large"
                  >
                    مسح الحقول
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      isPending ? <CircularProgress size={20} /> : <Save />
                    }
                    disabled={isPending}
                    size="large"
                    sx={{ minWidth: 120 }}
                  >
                    {isPending ? "جاري الحفظ..." : "حفظ الموظف"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Form Guidelines */}
        <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: "grey.50" }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            ملاحظات هامة:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ul style={{ paddingRight: "20px", margin: 0 }}>
              <li>الاسم الكامل يجب أن يحتوي على الأقل حرفين</li>
              <li>البريد الإلكتروني يجب أن يكون بصيغة صحيحة</li>
              <li>رقم الهاتف يجب أن يحتوي على أرقام فقط</li>
              <li>جميع الحقول إلزامية</li>
            </ul>
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
