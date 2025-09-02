import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginSchema, SignUpSchema, LoginFormData, SignUpFormData } from '../schemas/auth';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password, data.remember);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    try {
      await signUp(data.name, data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    loginForm.reset();
    signUpForm.reset();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 1 }}
          >
            Deliverly
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Email Deliverability Management Platform
          </Typography>

          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={googleLoading ? <CircularProgress size={20} /> : <Google />}
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            {googleLoading ? 'Signing in...' : `${isSignUp ? 'Sign up' : 'Sign in'} with Google`}
          </Button>

          <Divider sx={{ width: '100%', mb: 3, color: 'text.secondary' }}>
            or
          </Divider>

          {/* Sign Up Form */}
          {isSignUp ? (
            <Box component="form" onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoComplete="name"
                autoFocus
                {...signUpForm.register('name')}
                error={!!signUpForm.formState.errors.name}
                helperText={signUpForm.formState.errors.name?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                {...signUpForm.register('email')}
                error={!!signUpForm.formState.errors.email}
                helperText={signUpForm.formState.errors.email?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                {...signUpForm.register('password')}
                error={!!signUpForm.formState.errors.password}
                helperText={signUpForm.formState.errors.password?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                {...signUpForm.register('confirmPassword')}
                error={!!signUpForm.formState.errors.confirmPassword}
                helperText={signUpForm.formState.errors.confirmPassword?.message}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    {...signUpForm.register('terms')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="#" color="primary">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" color="primary">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 1, mb: 2, alignItems: 'flex-start' }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          ) : (
            /* Sign In Form */
            <Box component="form" onSubmit={loginForm.handleSubmit(onLoginSubmit)} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...loginForm.register('email')}
                error={!!loginForm.formState.errors.email}
                helperText={loginForm.formState.errors.email?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                {...loginForm.register('password')}
                error={!!loginForm.formState.errors.password}
                helperText={loginForm.formState.errors.password?.message}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    {...loginForm.register('remember')}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ mt: 1, mb: 2 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          )}

          {/* Toggle between Sign In and Sign Up */}
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                component="button"
                variant="body2"
                onClick={toggleMode}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Link>
            </Typography>
          </Box>

          {/* Forgot Password Link (only show on sign in) */}
          {!isSignUp && (
            <Box textAlign="center" mt={1}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main',
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}