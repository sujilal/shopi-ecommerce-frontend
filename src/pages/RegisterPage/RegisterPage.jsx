import React, { useState } from "react";
import {
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
import { CREATE_USER } from "../../graphql/mutations/login";
import "./RegisterPage.scss";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [createUserMutation, { loading }] = useMutation(CREATE_USER);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        try {
            const { data } = await createUserMutation({
                variables: {
                    payload: {
                        email: formData.email,
                        password: formData.password,
                        displayName: formData.name,
                        provider: "local"
                    }
                }
            });

            if (data?.createUser) {
                register(data.createUser.user, data.createUser.authToken);
                navigate({ to: "/products" });
            }
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <Box className="register-page">
            <Paper elevation={3} className="register-form">
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create Account
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit} className="form-group">
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
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
                        {loading ? <CircularProgress size={24} /> : "Register"}
                    </Button>
                </form>

                <Typography align="center" className="form-footer">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                    >
                        Login here
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default RegisterPage;
