'use client';
import { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, loginUser } from '@/store/slices/authSlice';

export default function LoginPanel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    
    const { isLoading, error } = useAppSelector(state => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError())
        const result = await dispatch(loginUser({ username, password }));
        console.info(result);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <h1>Login</h1>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {error && (
                <Box sx={{ color: 'red', mt: 1 }}>
                    {error}
                </Box>
            )}
        </Box>
    );
}