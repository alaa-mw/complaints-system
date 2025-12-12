/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider,
  Stack,
} from "@mui/material";
import {
  Visibility,
  MoreVert,
  Refresh,
  LocationOn,
  Description,
  Category,
  Business,
  CalendarToday,
} from "@mui/icons-material";
import { Complaint } from "../interfaces/Complaint";
import useFetchData from "../hooks/useFetchData";
import usePatchData from "../hooks/usePatchData";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../contexts/SnackbarContext";

// Status options
const STATUS_OPTIONS = [
  //   { value: "جديد", label: "جديد", color: "primary" },
  //   { value: "قيد المعالجة", label: "قيد المعالجة", color: "warning" },
  { value: "منجزة", label: "منجزة", color: "success" },
  { value: "مرفوضة", label: "مرفوضة", color: "error" },
];

const ComplaintsSubmittedTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // const [complaints, setComplaints] = useState<Complaint[]>([]);
  // const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );

  const { data: complaints, isLoading: loading , refetch } = useFetchData<Complaint[]>(
    "/complaints/my-complaints-submitted"
  );
  const { mutate: changeStatus } = usePatchData(
    `/complaints/change-status/${selectedComplaint?.id}`
  );

  const { showSnackbar } = useSnackbar();

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    setActionLoading(complaintId);
    changeStatus(
      {
        status: newStatus,
      },
      {
        onSuccess: (response) => {
          showSnackbar(response.message, "success");
          refetch();
          console.log("response:", response);
        },
        onError: (error) => {
          console.log("error:", error);
        },
      }
    );

    setActionLoading(null);
    setAnchorEl(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    complaint: Complaint
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaint);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComplaint(null);
  };

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.color || "default";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  // Mobile Card View
  const MobileComplaintCard = ({ complaint }: { complaint: Complaint }) => (
    <MuiCard sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <MuiCardContent>
        <Stack spacing={2}>
          {/* Header with Reference and Status */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              #{complaint.reference_number}
            </Typography>
            <Chip
              label={complaint.status}
              color={getStatusColor(complaint.status) as any}
              size="small"
            />
          </Box>

          <Divider />

          {/* Complaint Details */}
          <Stack spacing={1.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>الموقع:</strong> {complaint.location}
              </Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" gap={1}>
              <Description color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>الوصف:</strong> {complaint.description}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Category color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>النوع:</strong> {complaint.complaintType.name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Business color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>الجهة:</strong>{" "}
                {complaint?.complaintType?.governmentEntity?.name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>التاريخ:</strong> {formatDate(complaint.created_at)}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {/* Actions */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tooltip title="عرض التفاصيل">
              <IconButton size="small" color="primary">
                <Visibility />
              </IconButton>
            </Tooltip>

            <Tooltip title="تغيير الحالة">
              <Button
                variant="outlined"
                size="small"
                endIcon={
                  actionLoading === complaint.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <MoreVert />
                  )
                }
                onClick={(e) => handleMenuOpen(e, complaint)}
                disabled={actionLoading === complaint.id}
              >
                تغيير الحالة
              </Button>
            </Tooltip>
          </Box>
        </Stack>
      </MuiCardContent>
    </MuiCard>
  );

  // Tablet-optimized Table View
  const TabletTableView = () => {
    const navigate = useNavigate();
    return (
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ maxHeight: "70vh" }}
      >
        <Table stickyHeader aria-label="complaints table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
                رقم المرجع
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
                الموقع
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                الوصف
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
                الحالة
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: 100 }}>
                الإجراءات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints?.data.map((complaint) => (
              <TableRow key={complaint.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {complaint.reference_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      {complaint.location}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={complaint.description}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {complaint.description}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {complaint.complaintType.name} -{" "}
                    {complaint.complaintType.governmentEntity?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <Tooltip title="عرض التفاصيل">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/employee/submittedcomplaints/${complaint.id}`
                          )
                        }
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="تغيير الحالة">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, complaint)}
                        disabled={actionLoading === complaint.id}
                      >
                        {actionLoading === complaint.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <MoreVert fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Desktop Full Table View
  const DesktopTableView = () => (
    <TableContainer component={Paper} elevation={2} sx={{ maxHeight: "70vh" }}>
      <Table stickyHeader aria-label="complaints table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              رقم المرجع
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              الموقع
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
              الوصف
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              نوع الشكوى
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              الجهة الحكومية
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              الحالة
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              تاريخ الإنشاء
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              الإجراءات
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints?.data.map((complaint) => (
            <TableRow key={complaint.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {complaint.reference_number}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">{complaint.location}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Tooltip title={complaint.description}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {complaint.description}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Category fontSize="small" color="action" />
                  <Typography variant="body2">
                    {complaint.complaintType.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Business fontSize="small" color="action" />
                  <Typography variant="body2">
                    {complaint?.complaintType?.governmentEntity?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={complaint.status}
                  color={getStatusColor(complaint.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDate(complaint.created_at)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="عرض التفاصيل">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="تغيير الحالة">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, complaint)}
                      disabled={actionLoading === complaint.id}
                    >
                      {actionLoading === complaint.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <MoreVert />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={0} sx={{ background: "transparent" }}>
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            الشكاوي المحجوزة
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            // onClick={fetchComplaints} fix
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            تحديث
          </Button>
        </Box>

        {/* Responsive Content */}
        {isMobile ? (
          // Mobile View - Cards
          <Box>
            {complaints?.data.map((complaint) => (
              <MobileComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </Box>
        ) : isTablet ? (
          // Tablet View - Simplified Table
          <TabletTableView />
        ) : (
          // Desktop View - Full Table
          <DesktopTableView />
        )}

        {complaints?.data.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            لا توجد شكاوي لعرضها
          </Alert>
        )}

        {/* Status Change Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {STATUS_OPTIONS.map((status) => (
            <MenuItem
              key={status.value}
              onClick={() =>
                selectedComplaint &&
                handleStatusChange(selectedComplaint.id, status.value)
              }
              disabled={selectedComplaint?.status === status.value}
            >
              <Chip
                label={status.label}
                color={status.color as any}
                size="small"
                sx={{ mr: 1 }}
              />
              تغيير إلى {status.label}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ComplaintsSubmittedTable;
