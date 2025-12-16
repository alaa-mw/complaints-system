import React from "react";
import useFetchData from "../../hooks/useFetchData";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { formatDate } from "../../utils/formatDate";
import {
  CalendarToday,
  CheckCircle,
  Email,
  Phone,
  VerifiedUser,
} from "@mui/icons-material";

interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  is_verified: boolean;
  role: string;
  created_at?: string;
  updated_at?: string;
}

const Profile: React.FC = () => {
  const { data, isLoading, isError } = useFetchData<ProfileData>(
    "/authentication/profile"
  );

  console.log("Profile data:", data);
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (isError)
    return <Alert severity="error">خطأ في جلب تفاصيل الملف الشخصي</Alert>;

  const profile = data?.data;

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: { xs: 2, sm: 3 } }}>
      <CardContent sx={{ p: 0 }}>
        <Stack
          direction="column"
          spacing={3}
          alignItems={{ xs: "center", sm: "flex-start" }}
        >
          {/* Avatar Section */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                fontSize: "2rem",
                fontWeight: "bold",
                boxShadow: 2,
              }}
            >
              {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
            </Avatar>
            {profile?.is_verified && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "success.main",
                  borderRadius: "50%",
                  p: 0.5,
                  border: "2px solid white",
                }}
              >
                <CheckCircle
                  fontSize="small"
                  sx={{ color: "white", fontSize: 16 }}
                />
              </Box>
            )}
          </Box>

          {/* Info Section */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Name & Title */}
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                wordBreak: "break-word",
                color: "text.primary",
              }}
            >
              {profile?.full_name || "غير معروف"}
            </Typography>

            {/* Contact Info */}
            <Stack spacing={1} mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Email
                  fontSize="small"
                  sx={{ color: "text.secondary", fontSize: 18 }}
                />
                <Typography variant="body1" color="text.primary">
                  {profile?.email}
                </Typography>
              </Stack>

              {profile?.phone_number && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone
                    fontSize="small"
                    sx={{ color: "text.secondary", fontSize: 18 }}
                  />
                  <Typography variant="body1" color="text.primary">
                    {profile.phone_number}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Status Chips */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              gap={1}
              sx={{ mb: 2 }}
            >
              <Chip
                label={profile?.role || "بدون دور"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: "medium" }}
              />
              <Chip
                label={profile?.is_verified ? "موثّق" : "غير موثّق"}
                color={profile?.is_verified ? "success" : "default"}
                size="small"
                variant={profile?.is_verified ? "filled" : "outlined"}
                icon={
                  profile?.is_verified ? (
                    <VerifiedUser fontSize="small" />
                  ) : undefined
                }
              />
            </Stack>

            {/* Metadata */}
            {profile?.created_at && (
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CalendarToday fontSize="inherit" />
                  انشئ في: {formatDate(profile.created_at)}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
    // <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
    //   <CardContent>
    //     <Stack direction="row" spacing={2} alignItems="center">
    //       <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
    //         {profile?.full_name?.[0] ?? "U"}
    //       </Avatar>
    //       <Box>
    //         <Typography variant="h6" fontWeight="bold">
    //           {profile?.full_name}
    //         </Typography>
    //         <Typography variant="body2" color="text.secondary">
    //           {profile?.email}
    //         </Typography>
    //         {profile?.phone_number && (
    //           <Typography variant="body2" color="text.secondary">
    //             {profile.phone_number}
    //           </Typography>
    //         )}
    //         <Stack direction="row" spacing={1} mt={1}>
    //           <Chip label={profile?.role} size="small" />
    //           <Chip
    //             label={profile?.is_verified ? "موثّق" : "غير موثّق"}
    //             color={profile?.is_verified ? "success" : "default"}
    //             size="small"
    //           />
    //         </Stack>
    //         {profile?.created_at && (
    //           <Typography
    //             variant="caption"
    //             color="text.secondary"
    //             display="block"
    //             mt={1}
    //           >
    //             انشئ في: {formatDate(profile.created_at)}
    //           </Typography>
    //         )}
    //       </Box>
    //     </Stack>
    //   </CardContent>
    // </Card>
  );
};

export default Profile;
