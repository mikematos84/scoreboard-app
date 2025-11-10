'use client';

import LoginPanel from "@/components/LoginPanel";
import Header from "@/components/Header";
import { Container, Box } from "@mui/material";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        { isAuthenticated ? (
          <Box>
            <h1>Welcome to Scoreboard App</h1>
            <p>You are logged in! Add your content here.</p>
            {/* Your main app content goes here */}
          </Box>
        ) : (
          <LoginPanel />
        )}
      </Container>
    </>
  );
}