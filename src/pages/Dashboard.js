import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState({
    users: 0,
    roles: 0,
    permissions: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:2004/users');
        const rolesResponse = await fetch('http://localhost:2004/roles');
        const users = await usersResponse.json();
        const roles = await rolesResponse.json();

        setData({
          users: users.length,
          roles: roles.length,
          permissions: roles.reduce((acc, role) => {
            acc += Object.values(role.permissions).filter(Boolean).length;
            return acc;
          }, 0)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4">{data.users}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#2196F3', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Roles</Typography>
              <Typography variant="h4">{data.roles}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#FFC107', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Permissions</Typography>
              <Typography variant="h4">{data.permissions}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
