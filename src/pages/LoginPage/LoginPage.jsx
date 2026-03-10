import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../hooks/useAuth";
import { LOGIN_USER } from "../../graphql/mutations/login";
import "./LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_USER);
  const [formData, setFormData] = useState({
    email: "test@gmail.com",
    password: " password123"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await loginMutation({
        variables: {
          email: formData.email,
          password: formData.password
        }
      });

      if (data?.login) {
        login(data.login.user, data.login.token);
        navigate({ to: "/products" });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Box className="login-page">
      <Paper elevation={3} className="login-form">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Alert severity="info" sx={{ mb: 2 }}>
          Test credentials: test@gmail.com / password123
        </Alert>

        <form onSubmit={handleSubmit} className="form-group">
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            // value={formData.email}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            // value={formData.password}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            className="submit-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Typography align="center" className="form-footer">
          Don't have an account?{" "}
          <Link
            href="/register"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;