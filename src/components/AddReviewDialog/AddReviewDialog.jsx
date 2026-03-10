import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating,
    Button,
    Box,
    CircularProgress,
    Alert,
    Typography
} from "@mui/material";

const AddReviewDialog = ({ open, onClose, onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        comment: "",
        rating: 0,
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleRatingChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            rating: newValue
        }));
        setError("");
    };

    const handleSubmit = async () => {
        if (!formData.comment.trim()) {
            setError("Please enter a comment");
            return;
        }
        if (formData.rating === 0) {
            setError("Please select a rating");
            return;
        }

        try {
            await onSubmit(formData);
            setFormData({ comment: "", rating: 0 });
        } catch (err) {
            setError(err.message || "Failed to add review");
        }
    };

    const handleClose = () => {
        setFormData({ comment: "", rating: 0 });
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Review</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Rating</Typography>
                    <Rating
                        value={formData.rating}
                        onChange={handleRatingChange}
                        disabled={loading}
                        size="large"
                    />
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Share your experience with this product..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit Review"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddReviewDialog;