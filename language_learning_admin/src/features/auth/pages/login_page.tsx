import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { loginAdmin } from "../api/auth_api";
import type { ReactNode, SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router";

import { LoadingButton } from "@/components/buttons/loading_button";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils/error_utils";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (result) => {
      localStorage.setItem("access_token", result.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(result.user));

      if (remember) {
        localStorage.setItem("remember_admin_email", email);
      } else {
        localStorage.removeItem("remember_admin_email");
      }

      const destination =
        (
          location.state as {
            from?: {
              pathname?: string;
            };
          } | null
        )?.from?.pathname ?? "/dashboard";

      navigate(destination, { replace: true });
    },
  });

  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email);
  const passwordError = submitted && password.length < 8;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setSubmitted(true);

    const validEmail = /^\S+@\S+\.\S+$/.test(email);
    const validPassword = password.length >= 8;

    if (!validEmail || !validPassword) {
      return;
    }

    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password,
    });
  }

  return (
    <Stack component="form" spacing={2.2} onSubmit={handleSubmit} noValidate>
      <Box>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 800 }}>
          Đăng nhập quản trị
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.7, fontSize: 11 }}>
          Nhập thông tin tài khoản để tiếp tục
        </Typography>
      </Box>

      <Box>
        <FieldLabel>Email</FieldLabel>
        <TextField
          fullWidth
          autoComplete="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          helperText={
            emailError ? "Vui lòng nhập đúng địa chỉ email." : undefined
          }
          placeholder="Nhập email quản trị"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon
                    sx={{ color: "text.secondary", fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box>
        <FieldLabel>Mật khẩu</FieldLabel>
        <TextField
          fullWidth
          autoComplete="current-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          helperText={
            passwordError ? "Mật khẩu phải có ít nhất 8 ký tự." : undefined
          }
          placeholder="Nhập mật khẩu"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{ color: "text.secondary", fontSize: 18 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    edge="end"
                    size="small"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
          }
          label="Ghi nhớ đăng nhập"
          sx={{ m: 0, "& .MuiFormControlLabel-label": { fontSize: 10 } }}
        />
        <Button size="small" sx={{ minWidth: 0, fontSize: 10 }}>
          Quên mật khẩu?
        </Button>
      </Stack>
      {loginMutation.isError && (
        <Alert severity="error">{getErrorMessage(loginMutation.error)}</Alert>
      )}
      <LoadingButton
        size="large"
        type="submit"
        variant="contained"
        loading={loginMutation.isPending}
        loadingText="Đang đăng nhập..."
        sx={{
          minHeight: 47,
          fontWeight: 750,
        }}
      >
        Đăng nhập
      </LoadingButton>

      <Alert
        icon={<SecurityOutlinedIcon />}
        severity="info"
        sx={{
          justifyContent: "center",
          color: "text.secondary",
          bgcolor: "#f2eff8",
          "& .MuiAlert-message": { fontSize: 10 },
          "& .MuiAlert-icon": { color: "#a39bad", fontSize: 18 },
        }}
      >
        Trang đăng nhập chỉ dành cho quản trị viên.
      </Alert>
    </Stack>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ mb: 0.7, fontSize: 11, fontWeight: 700 }}>
      {children}
    </Typography>
  );
}
