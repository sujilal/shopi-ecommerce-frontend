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
  Alert,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../hooks/useAuth";
import { USER_LOGIN, ADMIN_LOGIN } from "../../graphql/mutations/login";
import "./LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userLoginMutation, { loading: userLoading }] = useMutation(USER_LOGIN);
  const [adminLoginMutation, { loading: adminLoading }] = useMutation(ADMIN_LOGIN);

  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(loginType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginTypeChange = (e) => {
    const type = e.target.value;
    setLoginType(type);
    setUserRole(type);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let data;

      if (loginType === "user") {
        const response = await userLoginMutation({
          variables: {
            email: formData.email,
            password: formData.password
          }
        });
        data = response.data?.userLogin;
      } else {
        const response = await adminLoginMutation({
          variables: {
            email: formData.email,
            password: formData.password
          }
        });
        data = response.data?.adminLogin;
      }

      if (data) {
        const userData = {
          ...data.user,
          role: loginType
        };
        login(userData, data.authToken);
        navigate({ to: "/products" });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const isLoading = userLoading || adminLoading;

  return (
    <Box className="login-page">
      <Paper elevation={3} className="login-form">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Login as:
          </Typography>
          <RadioGroup
            row
            value={loginType}
            onChange={handleLoginTypeChange}
          >
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="User"
              disabled={isLoading}
            />
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Admin"
              disabled={isLoading}
            />
          </RadioGroup>
        </Box>

        <form onSubmit={handleSubmit} className="form-group">
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            disabled={isLoading}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            disabled={isLoading}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            className="submit-btn"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        {loginType === "user" && (
          <Typography align="center" className="form-footer">
            Don't have an account?{" "}
            <Link
              href="/register"
              sx={{ cursor: "pointer", textDecoration: "none" }}
            >
              Register here
            </Link>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LoginPage;