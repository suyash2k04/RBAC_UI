import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; 
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation Schema using Yup
const schema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  role: yup.string().required('Role is required'),
}).required();

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const status = watch('status');

  useEffect(() => {
    // Fetch users
    fetch('http://localhost:2004/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch roles (if available from your API)
    fetch('http://localhost:2004/roles')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    reset(user || { name: '', email: '', role: '', status: true });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = (data) => {
    const userData = { ...data, status: data.status };

    if (editingUser) {
      // Update user in API
      fetch(`http://localhost:2004/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
        .then(response => response.json())
        .then(updatedUser => {
          setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
          toast.success('User updated successfully!');
        })
        .catch(error => toast.error('Failed to update user'));

    } else {
      // Create new user in API
      fetch('http://localhost:2004/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
        .then(response => response.json())
        .then(newUser => {
          setUsers([...users, newUser]);
          toast.success('User added successfully!');
        })
        .catch(error => toast.error('Failed to add user'));
    }
    handleCloseModal();
  };

  const handleDeleteUser = (email) => {
    fetch(`http://localhost:2004/users/${email}`, { method: 'DELETE' })
      .then(() => {
        setUsers(users.filter(user => user.email !== email));
        toast.success('User deleted successfully!');
      })
      .catch(error => toast.error('Failed to delete user'));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Button variant="contained" sx={{ backgroundColor: '#4CAF50', color: '#fff', marginBottom: '20px' }} onClick={() => handleOpenModal()}>
        Add New User
      </Button>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(user)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.email)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          width: 400,
          margin: 'auto',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24
        }}>
          <Typography variant="h6" gutterBottom>{editingUser ? 'Edit User' : 'Add New User'}</Typography>
          <form onSubmit={handleSubmit(handleSaveUser)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Name"
                  fullWidth
                  {...field}
                  sx={{ marginBottom: '20px' }}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Email"
                  fullWidth
                  {...field}
                  sx={{ marginBottom: '20px' }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
              <InputLabel>Role</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select {...field} label="Role">
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControlLabel
              control={<Controller
                name="status"
                control={control}
                defaultValue={editingUser?.status || true}
                render={({ field }) => (
                  <Switch {...field} />
                )}
              />}
              label={`Status: ${status ? 'Active' : 'Inactive'}`}
            />
            <Button variant="contained" sx={{ backgroundColor: '#4CAF50', color: '#fff' }} fullWidth type="submit">
              {editingUser ? 'Save Changes' : 'Add User'}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManagement;
