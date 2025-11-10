'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
         // unwrap() will throw if the action is rejected
        await dispatch(logoutUser()).unwrap();
        // Only redirect if logout succeeds
      router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setIsLoggingOut(false);
      }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Scoreboard App
        </Typography>
        {isAuthenticated && user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/users">
              Users
            </Button>
            <Typography variant="body1">
              Welcome, {user.username}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ({user.role})
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Please log in
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}