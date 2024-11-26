import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, FormControl, InputLabel, FormControlLabel, Switch, IconButton, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';


const schema = yup.object({
  name: yup.string().required('Role name is required').min(3, 'Role name must be at least 3 characters long'),
  permissions: yup.object({
    read: yup.boolean(),
    write: yup.boolean(),
    delete: yup.boolean(),
  }).required('Permissions are required'),
}).required();

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetch('http://localhost:2004/roles')
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error('Error fetching roles:', error));
  }, []);

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    reset(role || { name: '', permissions: { read: false, write: false, delete: false } });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingRole(null);
  };

  const handleSaveRole = (data) => {
    if (editingRole) {
      fetch(`http://localhost:2004/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingRole, ...data }),
      })
        .then((response) => response.json())
        .then((updatedRole) => {
          const updatedRoles = roles.map((role) =>
            role.id === updatedRole.id ? updatedRole : role
          );
          setRoles(updatedRoles);
          toast.success('Role updated successfully!');
        })
        .catch((error) => toast.error('Error updating role'));
    } else {
      fetch('http://localhost:2004/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((newRole) => {
          setRoles([...roles, newRole]);
          toast.success('Role added successfully!');
        })
        .catch((error) => toast.error('Error adding role'));
    }
    handleCloseModal();
  };

  const handleDeleteRole = (id) => {
    fetch(`http://localhost:2004/roles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setRoles(roles.filter((role) => role.id !== id));
        toast.success('Role deleted successfully!');
      })
      .catch((error) => toast.error('Error deleting role'));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Role Management</Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: '#4CAF50', color: '#fff', marginBottom: '20px' }}
        onClick={() => handleOpenModal()}
        startIcon={<AddIcon />}
      >
        Add New Role
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow key={index}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.permissions.read && 'Read '}
                  {role.permissions.write && 'Write '}
                  {role.permissions.delete && 'Delete '}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(role)}
                    sx={{ marginRight: '10px' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          width: 400,
          margin: 'auto',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24
        }}>
          <Typography variant="h6" gutterBottom>{editingRole ? 'Edit Role' : 'Add New Role'}</Typography>
          
          {errors.name && <Alert severity="error" sx={{ marginBottom: '10px' }}>{errors.name.message}</Alert>}
          {errors.permissions && <Alert severity="error" sx={{ marginBottom: '10px' }}>{errors.permissions.message}</Alert>}

          <form onSubmit={handleSubmit(handleSaveRole)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Role Name"
                  fullWidth
                  {...field}
                  sx={{ marginBottom: '20px' }}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
              <InputLabel>Permissions</InputLabel>
              <div>
                <FormControlLabel
                  control={<Controller
                    name="permissions.read"
                    control={control}
                    render={({ field }) => <Switch {...field} />}
                  />}
                  label="Read"
                />
                <FormControlLabel
                  control={<Controller
                    name="permissions.write"
                    control={control}
                    render={({ field }) => <Switch {...field} />}
                  />}
                  label="Write"
                />
                <FormControlLabel
                  control={<Controller
                    name="permissions.delete"
                    control={control}
                    render={({ field }) => <Switch {...field} />}
                  />}
                  label="Delete"
                />
              </div>
            </FormControl>

            <Button
              variant="contained"
              sx={{ backgroundColor: '#4CAF50', color: '#fff' }}
              fullWidth
              type="submit"
              startIcon={<SaveIcon />}
            >
              {editingRole ? 'Update Role' : 'Save Role'}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default RoleManagement;
