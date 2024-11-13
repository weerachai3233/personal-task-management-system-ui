'use client'
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Stack, Paper, Typography, TextField, Button, Link } from "@mui/material";
import { useRouter } from "next/navigation";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<IFormInput>();
  const router = useRouter()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data); // Handle form submission
  };

  const navigateToLogin = () => {
    router.replace('/login')
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
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                type="text"
                fullWidth
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
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
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Stack>
          </form>
          <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
            <Typography variant="body2">Already have an account?</Typography>
            <Link
              component="button"
              variant="body2"
              color="primary"
              onClick={navigateToLogin}  // Navigate to the Login page
            >
              Login here
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default RegisterPage;