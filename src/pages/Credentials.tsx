import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy,
  Refresh,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

const mockCredentials = {
  spf: 'v=spf1 include:_spf.google.com ~all',
  dkim: {
    selector: 'default',
    record: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4P4bVjt8+TKqmnJl8...',
  },
  tracking: {
    domain: 'track.example.com',
    cname: 'track.example.com CNAME track.deliverly.io',
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'noreply@example.com',
  },
};

const mockDnsStatus = {
  spf: 'verified',
  dkim: 'pending',
  tracking: 'error',
};

export default function Credentials() {
  const [checking, setChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState(mockDnsStatus);

  const handleCheckDns = async () => {
    setChecking(true);
    
    // Mock API call
    setTimeout(() => {
      // Simulate status changes
      setDnsStatus({
        spf: 'verified',
        dkim: Math.random() > 0.5 ? 'verified' : 'pending',
        tracking: Math.random() > 0.7 ? 'verified' : 'error',
      });
      setChecking(false);
    }, 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          DNS Credentials
        </Typography>
        <Button
          variant="outlined"
          startIcon={checking ? <CircularProgress size={16} /> : <Refresh />}
          onClick={handleCheckDns}
          disabled={checking}
        >
          {checking ? 'Checking DNS...' : 'Recheck DNS'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        DNS changes can take up to 24 hours to propagate. Make sure to add these records to your DNS provider.
      </Alert>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* SPF Record */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">SPF Record</Typography>
            <Chip
              icon={getStatusIcon(dnsStatus.spf)}
              label={dnsStatus.spf}
              color={getStatusColor(dnsStatus.spf) as any}
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            TXT Record for @ (root domain)
          </Typography>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {mockCredentials.spf}
          </Box>
          
          <Button
            startIcon={<ContentCopy />}
            onClick={() => handleCopy(mockCredentials.spf)}
          >
            Copy SPF Record
          </Button>
        </Paper>

        {/* DKIM Record */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">DKIM Record</Typography>
            <Chip
              icon={getStatusIcon(dnsStatus.dkim)}
              label={dnsStatus.dkim}
              color={getStatusColor(dnsStatus.dkim) as any}
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            TXT Record for {mockCredentials.dkim.selector}._domainkey
          </Typography>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {mockCredentials.dkim.record}
          </Box>
          
          <Button
            startIcon={<ContentCopy />}
            onClick={() => handleCopy(mockCredentials.dkim.record)}
          >
            Copy DKIM Record
          </Button>
        </Paper>

        {/* Tracking Domain */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Tracking Domain</Typography>
            <Chip
              icon={getStatusIcon(dnsStatus.tracking)}
              label={dnsStatus.tracking}
              color={getStatusColor(dnsStatus.tracking) as any}
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            CNAME Record for tracking domain
          </Typography>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {mockCredentials.tracking.cname}
          </Box>
          
          <Button
            startIcon={<ContentCopy />}
            onClick={() => handleCopy(mockCredentials.tracking.cname)}
          >
            Copy CNAME Record
          </Button>
        </Paper>

        {/* SMTP Configuration */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            SMTP Configuration
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Host
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {mockCredentials.smtp.host}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Port
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {mockCredentials.smtp.port}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {mockCredentials.smtp.username}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}