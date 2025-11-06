'use client';
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function LoginPanel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
                console.info(data);

            if (!res.ok) {
                const data = await res.json();
                console.info(data);
                setError(data.error || 'Login failed.');
            } else {
                // maybe redirect or signal success
                // For now just indicate success
                setError(null);
                // window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
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
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            {error && (
                <Box sx={{ color: 'red', mt: 1 }}>
                    {error}
                </Box>
            )}
        </Box>
    );
}