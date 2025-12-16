/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
  Avatar,
  Stack,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Description,
  CalendarToday,
  Chat,
  Note,
  Add,
} from "@mui/icons-material";
// import useFetchData from "../hooks/useFetchData";
// import ComplaintVersions from "./ComplaintVersions";
// import {
//   ComplaintDetails as details,
//   RequestReply,
// } from "../interfaces/Complaint";
// import useSendData from "../hooks/useSendData";
// import { useSnackbar } from "../contexts/SnackbarContext";
import { io } from "socket.io-client";
import useFetchData from "../../hooks/useFetchData";
import ComplaintVersions from "./ComplaintVersions";
import {  ComplaintDetails as details, RequestReply } from "../../interfaces/Complaint";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { baseUrl } from "../../services/api-client";
import useSendData from "../../hooks/useSendData";
// import { baseUrl } from "../services/api-client";

const ComplaintDetails = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const socket = io(baseUrl + "/", {
      transports: ["websocket"],
    });

    // Join the complaint room
    socket.emit("joinComplaint", id);

    // Listen for new comments
    socket.on("newComment", (data) => {
      console.log("New comment received:", data);
      // Update your state here
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const {
    data: complaintDetails,
    isLoading,
    refetch,
  } = useFetchData<details>(
    isAdmin
      ? `/complaints/complaint-details-for-admin/${id}`
      : `/complaints/my-complaints-submitted-details/${id}`
  );

  const { data: complaintVersions } = useFetchData<details>(
     `/complaints/get-complaint-with-versions/${id}`
  );

  const { mutate: addRequest, isPending: isAddingRequest } = useSendData<any>(
    `/complaint-comments/info-request`
  );

  const { mutate: addNote, isPending: isAddingNote } = useSendData<any>(
    `/complaint-comments/employee-note`
  );

  const complaint = complaintDetails?.data;

  const handleAddRequest = () => {
    if (requestText.trim() && id) {
      addRequest(
        {
          complaint_id: parseInt(id, 10),
          comment_text: requestText,
        },
        {
          onSuccess: (response) => {
            console.log("request added");
            setRequestText("");
            setRequestDialogOpen(false);

            showSnackbar(response.message, "success");
            refetch(); // Refresh the data to show the new request
          },
          onError: (error) => {
            console.error("Failed to add request:", error);
          },
        }
      );
    }
  };

  const handleAddNote = () => {
    console.log("noteText", noteText);

    const idtonum = parseInt(id || "", 10);
    console.log("id type:", typeof idtonum);
    if (noteText.trim() && id) {
      addNote(
        {
          complaint_id: idtonum,
          comment_text: noteText,
        },
        {
          onSuccess: (response) => {
            setNoteText("");
            setNoteDialogOpen(false);

            showSnackbar(response.message, "success");
            console.log("note added");
            refetch(); // Refresh the data to show the new note
          },
          onError: (error) => {
            console.error("Failed to add note:", error);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  const getComplaintTypeColor = (type: string) => {
    switch (type) {
      case "info_request":
        return "primary";
      case "citizen_reply":
        return "success";
      case "employee_note":
        return "warning";
      default:
        return "default";
    }
  };

  const getComplaintTypeLabel = (type: string) => {
    switch (type) {
      case "info_request":
        return "طلب معلومات";
      case "citizen_reply":
        return "رد مواطن";
      case "employee_note":
        return "ملاحظة موظف";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "primary";
      case "قيد المعالجة":
        return "warning";
      case "مكتمل":
        return "success";
      case "ملغي":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case "employee":
        return "primary";
      case "admin":
        return "secondary";
      case "user":
        return "success";
      default:
        return "default";
    }
  };

  const MessageItem: React.FC<{ message: RequestReply }> = ({ message }) => (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" gap={2}>
        <Avatar sx={{ bgcolor: getUserRoleColor(message.user.role) }}>
          {message.user.full_name.charAt(0)}
        </Avatar>
        <Box flex={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={1}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {message.user.full_name}
              </Typography>
              <Chip
                label={getComplaintTypeLabel(message.complaintType)}
                color={getComplaintTypeColor(message.complaintType) as any}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip label={message.user.role} variant="outlined" size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(message.created_at)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
            {message.text}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  // Add Request Dialog
  const RequestDialog = () => (
    <Dialog
      open={requestDialogOpen}
      onClose={() => setRequestDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Chat />
          إضافة طلب معلومات جديد
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          // autoFocus
          multiline
          rows={4}
          fullWidth
          placeholder="اكتب طلب المعلومات هنا..."
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setRequestDialogOpen(false)}
          disabled={isAddingRequest}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleAddRequest}
          variant="contained"
          disabled={!requestText.trim() || isAddingRequest}
          startIcon={isAddingRequest ? <CircularProgress size={16} /> : <Add />}
        >
          {isAddingRequest ? "جاري الإضافة..." : "إضافة الطلب"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add Note Dialog
  const NoteDialog = () => (
    <Dialog
      open={noteDialogOpen}
      onClose={() => setNoteDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Note />
          إضافة ملاحظة موظف جديدة
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          rows={4}
          fullWidth
          placeholder="اكتب ملاحظتك هنا..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setNoteDialogOpen(false)}
          disabled={isAddingNote}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleAddNote}
          variant="contained"
          disabled={!noteText.trim() || isAddingNote}
          startIcon={isAddingNote ? <CircularProgress size={16} /> : <Add />}
        >
          {isAddingNote ? "جاري الإضافة..." : "إضافة الملاحظة"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            تفاصيل الشكوى
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            رقم المرجع: {complaint?.reference_number}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Complaint Details Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Description />
                معلومات الشكوى
              </Typography>

              <Stack spacing={2} mt={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    الحالة
                  </Typography>
                  <Chip
                    label={complaint?.status}
                    color={getStatusColor(complaint?.status || "") as any}
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    الاصدار الحالي
                  </Typography>
                  <Typography variant="body1">
                    {complaint?.version ?? "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <LocationOn fontSize="small" />
                    الموقع
                  </Typography>
                  <Typography variant="body1">{complaint?.location}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <CalendarToday fontSize="small" />
                    تاريخ الإنشاء
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(complaint?.created_at || "")}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    الوصف
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                    {complaint?.description}
                  </Typography>
                </Box>

                {complaint?.attachments &&
                  complaint?.attachments.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        المرفقات
                      </Typography>
                      <Stack spacing={0.5} mt={0.5}>
                        {complaint.attachments.map((attachment, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            component="a"
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            المرفق {index + 1}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Requests and Replies Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Chat />
                  الطلبات والردود ({complaint?.requestsAndReplies?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setRequestDialogOpen(true)}
                >
                  إضافة طلب
                </Button>
              </Box>

              <Box sx={{ maxHeight: 600, overflow: "auto" }}>
                {!complaint?.requestsAndReplies ||
                complaint.requestsAndReplies.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    لا توجد طلبات أو ردود
                  </Alert>
                ) : (
                  complaint.requestsAndReplies.map((message) => (
                    <MessageItem key={message.id} message={message} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Employee Notes Section - Always show this card */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Note />
                  ملاحظات الموظفين ({complaint?.employee_notes?.length || 0})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setNoteDialogOpen(true)}
                >
                  إضافة ملاحظة
                </Button>
              </Box>

              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {!complaint?.employee_notes ||
                complaint.employee_notes.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    لا توجد ملاحظات
                  </Alert>
                ) : (
                  complaint.employee_notes.map((note) => (
                    <MessageItem key={note.id} message={note} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Versions Section - Add below the details card */}
        {isAdmin && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mt: 3 }}>
              <ComplaintVersions versions={complaintVersions?.data.versions} />
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Dialogs */}
      <RequestDialog />
      <NoteDialog />
    </Container>
  );
};

export default ComplaintDetails;
