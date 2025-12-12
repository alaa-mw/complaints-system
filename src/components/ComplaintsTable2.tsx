/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Refresh,
  LocationOn,
  Description,
  Category,
  Business,
  CalendarToday,
} from "@mui/icons-material";
import { Complaint } from "../interfaces/Complaint";
import { getStatusColor } from "../utils/getStatusColor";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

interface ComplaintsTableProps {
  complaints: Complaint[];
  loading: boolean;
  refetch?: () => void;
}
const ComplaintsTable = ({
  complaints,
  loading,
  refetch,
}: ComplaintsTableProps) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const ViewVersions = ({ complaintId }: { complaintId: number }) => {
    const navigate = useNavigate();
    return (
      <Tooltip title="عرض التعديلات">
        <IconButton
          size="small"
          color="primary"
          onClick={() => navigate(`${complaintId}`)}
        >
          <Visibility />
        </IconButton>
      </Tooltip>
    );
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
                <strong>النوع:</strong> {complaint?.complaintType?.name}
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
            <ViewVersions complaintId={complaint.id} />
          </Box>
        </Stack>
      </MuiCardContent>
    </MuiCard>
  );

  // Tablet-optimized Table View
  const TabletTableView = () => (
    <TableContainer component={Paper} elevation={1} sx={{ maxHeight: "70vh" }}>
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
          {complaints?.map((complaint) => (
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
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {complaint?.complaintType?.name} -{" "}
                  {complaint?.complaintType?.governmentEntity?.name}
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
                  <ViewVersions complaintId={complaint.id} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          {complaints?.map((complaint) => (
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
                    {complaint?.complaintType?.name}
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
                  <ViewVersions complaintId={complaint.id} />
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
            الشكاوي الواردة
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
            {complaints?.map((complaint) => (
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

        {complaints?.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            لا توجد شكاوي لعرضها
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintsTable;
