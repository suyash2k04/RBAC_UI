import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };


  const mobileLinks = (
    <Box sx={{ width: 250 }} onClick={() => toggleDrawer(false)}>
      <Button component={Link} to="/" color="inherit" fullWidth>
        Dashboard
      </Button>
      <Button component={Link} to="/users" color="inherit" fullWidth>
        User Management
      </Button>
      <Button component={Link} to="/roles" color="inherit" fullWidth>
        Role Management
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            RBAC Dashboard
          </Typography>


          {isMobile ? (
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => toggleDrawer(true)}
              aria-label="menu"
              sx={{ display: { xs: 'block', sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 'bold' }}>
                Dashboard
              </Button>
              <Button component={Link} to="/users" color="inherit" sx={{ fontWeight: 'bold' }}>
                User Management
              </Button>
              <Button component={Link} to="/roles" color="inherit" sx={{ fontWeight: 'bold' }}>
                Role Management
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {mobileLinks}
      </Drawer>
    </>
  );
};

export default Navbar;
