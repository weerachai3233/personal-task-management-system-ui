"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ApiResponse, login } from "@/utils/api";
import { toast } from "react-toastify";

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result: ApiResponse = await login(data.email, data.password);
    if (!result.status) {
      return toast.error(result.message);
    }

    localStorage.setItem("token", result?.data?.token || "");
    router.push("/board");

  };

  const navigateToRegister = () => {
    router.replace("/register");
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100vw", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Paper elevation={3} sx={{ width: "400px", padding: "24px" }}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Stack>
          </form>
          <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
            <Typography variant="body2">{`Don't have an account?`}</Typography>
            <Link
              component="button"
              variant="body2"
              color="primary"
              onClick={navigateToRegister}
            >
              Register here
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default LoginPage;
