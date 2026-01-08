// Utility to convert date string to yyyy-MM-dd format for input[type="date"]

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Paper,
  Checkbox
} from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import EditIcon from '@mui/icons-material/Edit';
import type { SelectAllRounded } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";

const statusOptions = [
  'requested',
  'in progress',
  'pending info',
  'responded',
  'closed',
  'overdue',
  'draft',
  'on hold',
  'cancelled'
];

const disciplineOptions = [
  "Architect",
  "Structural Engineer",
  "Civil Engineer",
  "MEP Engineer",
  "Quantity Surveyor/Cost Consultant",
  "Building Surveyor/Certifier",
  "Town Planner",
  "Landscape Architect",
  "BIM Manager/Coordinator",
  "Interior Designer"
];

interface EditAndCommentRfiPopUpProps {
  open: boolean;
  onClose: () => void;
  rfi: any;
  onEditRfi: (payload: any, files: File[]) => Promise<{ type: 'comment' | 'edit' } | void>;
  // onAddComment: (comment: string, files: File[], status: string) => Promise<void>;
  loading: boolean;
  error: string;
  selectedProject?: any;
  members: any[];
}

const EditAndCommentRfiPopUp: React.FC<EditAndCommentRfiPopUpProps> = ({
    open,
    onClose,
    rfi,
    members,
    onEditRfi,
    // onAddComment,
    loading,
    error,
    selectedProject
  }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(rfi || {});
  const [selectedRequestTo, setSelectedRequestTo] = useState<string[]>(rfi?.requestTo || []);
  const [comment, setComment] = useState("");
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [status, setStatus] = useState(rfi?.status || "requested");
  const statusValue = (status || '').toLowerCase();
  const fieldsDisabled = !editMode || statusValue === 'closed' || statusValue === 'cancelled';
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [comments, setComments] = useState<Array<any>>(rfi?.comments || []);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    setForm(rfi || {});
    setStatus(rfi?.status || "requested");
    setComment("");
    setEditMode(false);
    setCommentFiles([]);
    setEditFiles([]);
    setSelectedRequestTo(rfi?.requestTo || []);
    // Fetch latest comments when modal opens or rfi changes
    if (rfi?.id && open) {
      fetchComments(rfi.id);
    }
  }, [rfi, open]);

  // Fetch comments from backend
  const fetchComments = async (rfiId: string) => {
    setCommentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };
  // Handle Request To change
  const handleRequestToChange = (e: any) => {
    const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
    setSelectedRequestTo(value);
    setForm({ ...form, requestTo: value });
  };

  // Handle RFI field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle RFI status change
  const handleStatusChange = (e: any) => {
    setStatus(e.target.value);
    setForm({ ...form, status: e.target.value });
  };

  // Handle PATCH (edit RFI)
  const handleEditRfi = async () => {
    await onEditRfi(form, editFiles);
    setEditMode(false);
  };

  // Handle POST (add comment)
  const handleAddComment = async () => {
    await onAddComment(comment, commentFiles);
    setComment("");
    setCommentFiles([]);
  };

  // Unified submit handler
  const handleUnifiedSubmit = async () => {
    // Map requestTo and ccTo to user IDs
    const requestToIds = Array.isArray(selectedRequestTo)
      ? selectedRequestTo.map(name => {
          const member = members.find(m => m.name === name);
          return member && member.userId ? String(member.userId) : name;
        })
      : [];
    const ccToIds = Array.isArray(form.ccTo)
      ? form.ccTo.map(name => {
          const member = members.find(m => m.name === name);
          return member && member.userId ? String(member.userId) : name;
        })
      : [];

    // Format requiredResponseDate as YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    };



    // Always send all required fields
    const payload = {
      id: form.id || rfi?.id,
      subject: form.subject || rfi?.subject || "",
      discipline: form.discipline || rfi?.discipline || "",
      requestTo: requestToIds,
      ccTo: ccToIds,
      rfiDescription: form.rfiDescription || rfi?.rfiDescription || "",
      requiredResponseDate: formatDate(form.requiredResponseDate || rfi?.requiredResponseDate || ""),
      requestedDate: formatDate(form.requestedDate || rfi?.requestedDate || new Date().toISOString().slice(0, 10)),
      comment: comment,
      status: typeof status === 'string' ? status : (Array.isArray(status) ? status[0] : String(status)),
      attachedFiles: form.attachedFiles || rfi?.attachedFiles || [],
    };
    try {
      const result = await onEditRfi(payload, editFiles.concat(commentFiles));
      if (comment) {
        setSnackbarMsg("Comment added successfully!");
        setSnackbarOpen(true);
        setComment("");
        setCommentFiles([]);
        setEditFiles([]);
        // Fetch latest comments from backend
        if (form.id || rfi?.id) {
          await fetchComments(form.id || rfi?.id);
        }
        // Do NOT close the modal after comment
      } else {
        setSnackbarMsg("RFI updated successfully!");
        setSnackbarOpen(true);
        setEditMode(false);
        setComment("");
        setCommentFiles([]);
        setEditFiles([]);
        if (result && result.type === 'edit') {
          onClose(); // Only close after edit
        }
      }
    } catch {
      setSnackbarMsg("Failed to submit. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const style = {                    
    pointerEvents: editMode ? 'auto' : 'none',
    backgroundColor: editMode ? '#f5f5f5' : '#fff',
    color: 'black !important',
    opacity: 1,
    borderRadius: '10px',
    // Override MUI inherit styling
    '&.MuiInputBase-root': {
      color: 'black !important',
      backgroundColor: editMode ? '#f5f5f5' : '#fff !important',
      borderRadius: '10px !important',
    },
    '& input': {
      color: 'black !important',
      backgroundColor: editMode ? '#f5f5f5' : '#fff !important',
    },
    '& fieldset': {
      borderRadius: '10px !important',
    }
  };

      function toInputDateFormat(dateStr: string) {
      if (!dateStr) return "";
      // If already in yyyy-MM-dd, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    }

  return (
  <>
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth     PaperProps={{
      sx: {
        borderRadius: '20px', // or match your Box color
        boxShadow: 'none', // optional: remove Paper shadow if you want only your Box border
      }
    }}>
      <Box sx={{ border: '3px dashed #1976d2 !important', borderRadius: '20px', p: 2, backgroundColor: 'transparent' }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {selectedProject?.name || "RFI Details"}
        <Box>
          <Button onClick={onClose} color="primary" variant="outlined" sx={{ mr: 2 }}>Back to RFI Register</Button>
          {!editMode && (
          <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon />}
        onClick={() => setEditMode(true)}
        sx={{ mr: 2 }}
          >
        Edit RFI
          </Button>
        )}
        </Box>

      </DialogTitle>
      <DialogContent>
        <Masonry columns={2} spacing={2}>
          <Box mb={2} display="flex" flexDirection="column" gap={2}>
          <Box mb={2} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Subject"
          name="subject"
          value={form.subject || ""}
          onChange={handleFormChange}
          sx={{...style, mt: 2}}
          disabled={statusValue === 'closed' || statusValue === 'cancelled'}
            slotProps={{
            input: {
            readOnly: !editMode,
            },
            }}
        />
        <FormControl>
          <InputLabel>Discipline</InputLabel>
          <Select
            value={form.discipline || ""}
            label="Discipline"
            name="discipline"
            onChange={handleFormChange}
            sx={{ ...style,
            textTransform: 'capitalize',
            }}
            readOnly={!editMode}
            // Do not use disabled, use pointerEvents and style for custom look
          >
            {disciplineOptions.map(opt => (
          <MenuItem sx={{ textTransform: 'capitalize' }} key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Description"
          name="rfiDescription"
          value={form.rfiDescription || "No Description"}
          onChange={handleFormChange}
          fullWidth
          multiline
          sx={style}
          disabled={statusValue === 'closed' || statusValue === 'cancelled'}
            slotProps={{
            input: {
            readOnly: !editMode,
            },
            }}
        />
        <FormControl margin="normal" sx={style}>
          <InputLabel>Request to</InputLabel>
          <Select
            label="Request To"
            name="requestTo"
            multiple
            value={selectedRequestTo}
            onChange={e => {
              // value is array of userIds
              setSelectedRequestTo(e.target.value as string[]);
              setForm({ ...form, requestTo: e.target.value });
            }}
            renderValue={selected =>
              Array.isArray(selected)
                ? members
                    .filter(m => selected.includes(m.userId))
                    .map(m => m.name)
                    .join(', ')
                : ''
            }
          >
            {Array.isArray(members) && members.map((member: any, idx: number) => (
              <MenuItem key={member.userId || idx} value={member.userId}>
                <Checkbox checked={selectedRequestTo.indexOf(member.userId) > -1} />
                <Typography>{member.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status || ""}
            label="Status"
            onChange={handleStatusChange}
            sx={{ ...style,
            textTransform: 'capitalize',
            }}
            readOnly={!editMode}
            // Do not use disabled, use pointerEvents and style for custom look
          >
            {statusOptions.map(opt => (
          <MenuItem sx={{ textTransform: 'capitalize' }} key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <DatePicker
            label="Controlled picker"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            /> */}
        <TextField
          label="Required Response Date"
          name="requiredResponseDate"
          value={form.requiredResponseDate || ""}
          onChange={handleFormChange}
          InputLabelProps={{ shrink: true }}
          disabled={statusValue === 'closed' || statusValue === 'cancelled'}
          hidden={editMode}
          sx={style}
        />
        <TextField
          label="Required Response Date"
          name="requiredResponseDate"
          type="date"
          value={toInputDateFormat(form.requiredResponseDate) || ""}
          onChange={handleFormChange}
          InputLabelProps={{ shrink: true }}
          required
          disabled={statusValue === 'closed' || statusValue === 'cancelled'}
          helperText={`Current:  ${form.requiredResponseDate}`}
          hidden={!editMode}
          sx={style}
        />
        </Box>
          

        </Box>

        <Box mt={3} sx={{ border: '1px solid #ccc', borderRadius: '10px', p: 2 }}>
          {/* Existing comments section */}
          {commentsLoading ? (
            <Box mt={2}><CircularProgress size={24} /></Box>
          ) : comments && comments.length > 0 ? (
            <Box mt={2}>
              <Typography variant="subtitle1"><b>Comments:</b></Typography>
              {comments.map((comment: any, index: number) => (
                <Box key={index} mb={1}>
                  <Typography variant="caption"><b>{comment.createdAt?.split('T')[0]}</b></Typography>
                  <Typography variant="body2"><b>{comment.author}:</b> {comment.comment}</Typography>
                  {comment.attachedFiles && comment.attachedFiles.length > 0 && (
                    <Box mt={1}>
                      {comment.attachedFiles.map((file: any, fileIndex: number) => {
                        const fileUrl = typeof file === 'string' ? file : file.url || '';
                        const fileName = decodeURIComponent(fileUrl.split('/').pop().split('?')[0].split('_')[1]);
                        return (
                          <Button
                            key={fileIndex}
                            variant="outlined"
                            size="small"
                            href={fileUrl}
                            target="_blank"
                            rel="noopener"
                            download={fileName}
                            sx={{ ml: 1 }}
                          >
                            <FileDownloadOutlinedIcon fontSize="small" />
                            <span style={{ marginLeft: 4 }}>{fileName}</span>
                          </Button>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">No comments yet.</Typography>
          )}
          <Typography variant="subtitle2"><b>Add Comment</b></Typography>
          <TextField
        label="Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        minRows={2}
        disabled={statusValue === 'closed' || statusValue === 'cancelled'}
        sx={{backgroundColor: '#f5f5f5'}}
          />
          <Box mt={2}>
        <Button variant="outlined" component="label" disabled={statusValue === 'closed' || statusValue === 'cancelled'}>
          Attach File(s)
          <input type="file" multiple hidden onChange={e => setCommentFiles(Array.from(e.target.files || []))} />
        </Button>
        {commentFiles.length > 0 && (
          <Typography variant="caption" ml={2}>
            {commentFiles.map(f => f.name).join(", ")}
          </Typography>
        )}
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Masonry>
      </DialogContent>

        <DialogActions>
          <Button
    onClick={handleUnifiedSubmit}
    variant="contained"
    color="primary"
    disabled={loading || (!editMode && !comment)}
  >
    {loading ? <CircularProgress size={24} /> : editMode ? "Save and Submit" : "Submit"}
   </Button>
        </DialogActions>
      </Box>
    </Dialog>
    {/* Snackbar for success/failure */}
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarMsg.includes("success") ? "success" : "error"}
        sx={{ minWidth: 300 }}
      >
        {snackbarMsg}
      </Alert>
    </Snackbar>
    </>
  );
};

export default EditAndCommentRfiPopUp;