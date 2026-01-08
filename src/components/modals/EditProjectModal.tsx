import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

interface Project {
  id: number;
  name: string;
  projectDescription?: string;

  client?: string;
  council?: string;
  projectImage?: string;
  createdAt?: string;
  buildingClass?: string;
  postcode?: string;
  projectsStage?: string;
  address?: string;
  state?: string;
  suburb?: string;
  country?: string;
}

interface EditProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdated?: (project: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ open, project, onClose, onUpdated }) => {
  const [form, setForm] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(project);
    setError("");
  }, [project, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/projects/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update project");
      const updated = await res.json();
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            name="name"
            value={form?.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Project Description"
            name="projectDescription"
            value={form?.projectDescription || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
          <TextField
            label="Project Status"
            name="projectsStage"
            value={form?.projectsStage || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client"
            name="client"
            value={form?.client || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Building Class"
            name="buildingClass"
            value={form?.buildingClass || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={form?.address || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Suburb"
            name="suburb"
            value={form?.suburb || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="State"
            name="state"
            value={form?.state || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Postcode"
            name="postcode"
            value={form?.postcode || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Country"
            name="country"
            value={form?.country || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
                    <TextField
            label="Created At"
            name="createdAt"
            value={form?.createdAt || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;
