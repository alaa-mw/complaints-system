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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Block, LockOpen, Refresh } from "@mui/icons-material";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatDate } from "../../utils/formatDate";
import useSendData from "../../hooks/useSendData";
import { useNavigate } from "react-router-dom";

interface Account {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  is_verified: boolean;
  role: string;
  fcm_token?: string | null;
  created_at: string;
  updated_at: string;
  is_blocked?: boolean;
}

interface AccountsPaginationResponse {
  data: Account[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

const AccountsTable: React.FC = () => {
  const [accountId, setAccountId] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { showSnackbar } = useSnackbar();
  const navigate= useNavigate();

  const { data, isLoading, refetch, setQueryParams } =
    useFetchDataWithParams<AccountsPaginationResponse>("/users/all-users", {
      role: "user",
      //   page: 1,
    });
  const { mutate: block } = useSendData<null>(`/users/${accountId}/block`);

  const handleToggleBlock = async (account: Account) => {
    setAccountId(account.id);
    block(
      {},
      {
        onSuccess: (response) => {
          showSnackbar(response.message, "success");
          refetch();
        },
        onError: (error) => {
          showSnackbar(error.message, "success");
        },
      }
    );
  };

  const ROLES: { value: string; label: string }[] = [
    { value: "user", label: "مستخدم" },
    { value: "employee", label: "موظف" },
    { value: "admin", label: "مدير" },
  ];

  const handleRoleChange = (role: string) => {
    setQueryParams((p) => ({
      ...p,
      role: role,
    }));
  };

  const MobileAccountCard = ({ account }: { account: Account }) => (
    <MuiCard sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <MuiCardContent>
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {account.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {account.email}
              </Typography>
            </Box>
            <Chip label={account.role} size="small" />
          </Box>

          <Divider />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatDate(account.created_at)}
              </Typography>
            </Box>
            <Box>
              <Button
                onClick={() => handleToggleBlock(account)}
                variant={account.is_blocked ? "contained" : "outlined"}
                color={account.is_blocked ? "success" : "error"}
                startIcon={account.is_blocked ? <LockOpen /> : <Block />}
                size="small"
              >
                {account.is_blocked ? "رفع الحظر" : "حظر"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </MuiCardContent>
    </MuiCard>
  );

  const TabletTableView = () => (
    <TableContainer component={Paper} elevation={1} sx={{ maxHeight: "70vh" }}>
      <Table stickyHeader aria-label="accounts table" size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              الاسم
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
              البريد الإلكتروني
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 100 }}>
              الدور
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              الحالة
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>
              الإجراءات
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.data.map((account) => (
            <TableRow key={account.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {account.full_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{account.email}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={account.role} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={account.is_blocked ? "محظور" : "نشط"}
                  color={account.is_blocked ? "error" : ("success" as any)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleToggleBlock(account)}
                  variant={account.is_blocked ? "contained" : "outlined"}
                  color={account.is_blocked ? "success" : "error"}
                  startIcon={account.is_blocked ? <LockOpen /> : <Block />}
                >
                  {account.is_blocked ? "رفع الحظر" : "حظر"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const DesktopTableView = () => (
    <TableContainer component={Paper} elevation={2} sx={{ maxHeight: "70vh" }}>
      <Table stickyHeader aria-label="accounts table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
              الاسم
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 220 }}>
              البريد الإلكتروني
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              الدور
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              التحقق
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
              الحظر
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
          {data?.data.data.map((account) => (
            <TableRow key={account.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {account.full_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{account.email}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={account.role} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={account.is_verified ? "مفعل" : "غير مفعل"}
                  color={account.is_verified ? "success" : ("default" as any)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={account.is_blocked ? "محظور" : "غير محظور"}
                  color={account.is_blocked ? "error" : ("success" as any)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(account.created_at)}
                </Typography>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleToggleBlock(account)}
                  variant={account.is_blocked ? "contained" : "outlined"}
                  color={account.is_blocked ? "success" : "error"}
                  startIcon={account.is_blocked ? <LockOpen /> : <Block />}
                >
                  {account.is_blocked ? "رفع الحظر" : "حظر"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (isLoading) {
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
        <Box
          display={{sx:"list-item" ,md:"flex"}}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            حسابات المستخدمين
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" gap={1}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>الدور</InputLabel>
              <Select
                label="الدور"
                onChange={(e) => handleRoleChange(e.target.value as string)}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              تحديث
            </Button>
            <Button
            variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("add")}
            >
              إضافة حساب 
            </Button>
          </Stack>
        </Box>

        {isMobile ? (
          <Box>
            {data?.data.data.map((account) => (
              <MobileAccountCard key={account.id} account={account} />
            ))}
          </Box>
        ) : isTablet ? (
          <TabletTableView />
        ) : (
          <DesktopTableView />
        )}

        {data?.data.data.length === 0 && !isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            لا توجد حسابات لعرضها
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsTable;
