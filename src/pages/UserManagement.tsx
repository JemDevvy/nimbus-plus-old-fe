import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    avatarUrl: "",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Project Manager",
    avatarUrl: "",
  },
  {
    id: 3,
    name: "Carol Lee",
    email: "carol@example.com",
    role: "Guest",
    avatarUrl: "",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    // Replace with API call in production
    setUsers(mockUsers);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    ]);
    setNewUser({ name: "", email: "", role: "" });
    setOpen(false);
  };

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10">
        <Container maxWidth="md" sx={{ py: 6 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                User Management
              </Typography>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Add User
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                            <Typography>{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={
                              user.role === "Admin"
                                ? "primary"
                                : user.role === "Project Manager"
                                ? "success"
                                : "default"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
        
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                  <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                      label="Name"
                      name="name"
                      value={newUser.name}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      name="email"
                      value={newUser.email}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Role"
                      name="role"
                      value={newUser.role}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Admin, Project Manager, Guest..."
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button variant="contained" onClick={handleAddUser}>
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </Container>
      </div>
    </div>
  );
}