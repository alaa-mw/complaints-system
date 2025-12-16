/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { STATUS_OPTIONS } from "../../static/statusEnum";
import { FetchResponse } from "../../services/api-client";
import { ComplaintsPaginationResponse } from "../../interfaces/Complaint";

interface Props {
  queryParams: Record<string, any>;
  setQueryParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  complaintsResponse?: FetchResponse<ComplaintsPaginationResponse> | undefined;
}

const ComplaintsFilters = ({
  queryParams,
  setQueryParams,
  complaintsResponse,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Stack direction="row" spacing={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-filter-label">الحالة</InputLabel>
          <Select
            labelId="status-filter-label"
            value={queryParams.status}
            label="الحالة"
            onChange={(e) =>
              setQueryParams((prev) => ({
                ...prev,
                status: e.target.value as string,
                page: 1,
              }))
            }
          >
            <MenuItem value="">الكل</MenuItem>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.id}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Pagination
        count={complaintsResponse?.data.totalPages ?? 1}
        page={queryParams.page}
        onChange={(_, page) => setQueryParams((prev) => ({ ...prev, page }))}
        color="primary"
      />
    </Box>
  );
};

export default ComplaintsFilters;
