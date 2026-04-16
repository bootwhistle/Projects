import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  Box, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',      path: '/' },
  { label: 'Watchlist', path: '/watchlist' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Chat',      path: '/chat' },
  { label: 'Compare',   path: '/compare' },
];

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {/* Logo */}
          <ShowChartIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 0, cursor: 'pointer', fontWeight: 700, mr: 4, color: 'white' }}
            onClick={() => navigate('/')}
          >
            Stock<span style={{ color: theme.palette.primary.main }}>otron</span>
          </Typography>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {NAV_LINKS.map(link => (
                <Button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: isActive(link.path) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive(link.path) ? 700 : 400,
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 220, pt: 2 }}>
          <List>
            {NAV_LINKS.map(link => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  selected={isActive(link.path)}
                  onClick={() => { navigate(link.path); setOpen(false); }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
