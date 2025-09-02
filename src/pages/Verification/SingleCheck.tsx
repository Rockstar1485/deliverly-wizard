import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Search, CheckCircle, Warning, Error } from '@mui/icons-material';

interface VerificationResult {
  email: string;
  result: 'valid' | 'risky' | 'invalid';
  score: number;
  details: {
    syntax: boolean;
    mx: boolean;
    disposable: boolean;
    role: boolean;
  };
}

export default function SingleCheck() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!email) return;

    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      const mockResult: VerificationResult = {
        email,
        result: Math.random() > 0.7 ? 'valid' : Math.random() > 0.5 ? 'risky' : 'invalid',
        score: Math.floor(Math.random() * 100),
        details: {
          syntax: true,
          mx: Math.random() > 0.2,
          disposable: Math.random() > 0.8,
          role: Math.random() > 0.7,
        },
      };
      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'valid':
        return 'success';
      case 'risky':
        return 'warning';
      case 'invalid':
        return 'error';
      default:
        return 'default';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'valid':
        return <CheckCircle />;
      case 'risky':
        return <Warning />;
      case 'invalid':
        return <Error />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={3}>
          Single Email Verification
        </Typography>
        
        <Box display="flex" gap={2} mb={4}>
          <TextField
            fullWidth
            label="Email Address"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <Search />}
            onClick={handleVerify}
            disabled={!email || loading}
            sx={{ minWidth: 140 }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </Box>

        {result && (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            <Box>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  {getResultIcon(result.result)}
                  <Typography variant="h4" fontWeight="bold" sx={{ ml: 1 }}>
                    {result.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    / 100
                  </Typography>
                </Box>
                
                <Chip
                  label={result.result.toUpperCase()}
                  color={getResultColor(result.result) as any}
                  variant="outlined"
                  size="medium"
                />
              </Paper>
            </Box>

            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Verification Details
                </Typography>
                
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Syntax Valid</Typography>
                  <Chip
                    label={result.details.syntax ? 'PASS' : 'FAIL'}
                    color={result.details.syntax ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">MX Record</Typography>
                  <Chip
                    label={result.details.mx ? 'PASS' : 'FAIL'}
                    color={result.details.mx ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Disposable Email</Typography>
                  <Chip
                    label={result.details.disposable ? 'YES' : 'NO'}
                    color={result.details.disposable ? 'warning' : 'success'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Role Account</Typography>
                  <Chip
                    label={result.details.role ? 'YES' : 'NO'}
                    color={result.details.role ? 'warning' : 'success'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}