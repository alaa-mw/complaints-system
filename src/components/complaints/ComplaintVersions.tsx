import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  CardHeader,
} from "@mui/material";
import { ComplaintVersion } from "../../interfaces/Complaint";
import compareVersions from "../../utils/compareVersions";

interface Props {
  versions?: ComplaintVersion[];
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const ComplaintVersions: React.FC<Props> = ({ versions }) => {
  if (!versions || versions.length === 0)
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6">نسخ الشكوى</Typography>
          <Typography variant="body2">
            لا توجد نسخ محفوظة لهذه الشكوى
          </Typography>
        </CardContent>
      </Card>
    );

  // sort descending by version number
  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Card elevation={2}>
      <CardHeader title="نسخ الشكوى" />
      <CardContent>
        <Stack spacing={2}>
          {sorted.map((v, idx) => {
            const previous =
              idx + 1 < sorted.length ? sorted[idx + 1] : undefined;
            const changes = previous
              ? compareVersions<ComplaintVersion>(v, previous, [
                  "location",
                  "description",
                  "status",
                ])
              : {};

            const locationChanged = Boolean(changes["location"]);
            const descriptionChanged = Boolean(changes["description"]);
            const statusChanged = Boolean(changes["status"]);

            return (
              <Box
                key={v.id}
                sx={{
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    الاصدار {v.version} — {formatDate(v.changed_at)}
                  </Typography>
                  <Chip
                    label={v.status}
                    color={statusChanged ? "error" : "primary"}
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    color={locationChanged ? "error" : "text.secondary"}
                  >
                    <strong>الموقع:</strong> {v.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: descriptionChanged ? "error.main" : undefined,
                    }}
                  >
                    {v.description}
                  </Typography>
                </Box>

                {v.attachments && v.attachments.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, flexWrap: "wrap" }}
                  >
                    {v.attachments.map((att) => (
                      <Button
                        href={att.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={att.id}
                        variant="outlined"
                        size="small"
                      >
                        مرفق {att.id}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ComplaintVersions;
