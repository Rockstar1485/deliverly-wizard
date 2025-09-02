import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Warning, Error, Refresh } from '@mui/icons-material';

const mockConfiguration = {
  domain: 'example.com',
  company: 'Acme Inc',
  sendingEmail: 'noreply@example.com',
  dnsProvider: 'Cloudflare',
  region: 'US',
  spf: 'v=spf1 include:_spf.google.com ~all',
  dkim: {
    selector: 'default',
    configured: true,
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'noreply@example.com',
    tested: true,
  },
  tracking: {
    domain: 'track.example.com',
    webhooks: 2,
  },
};

const dnsStatus = {
  spf: 'verified',
  dkim: 'pending',
  trackingCname: 'error',
};

export default function Step6Review() {
  const [finishing, setFinishing] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleCheckDns = async () => {
    setChecking(true);
    // Mock API call
    setTimeout(() => {
      setChecking(false);
    }, 2000);
  };

  const handleFinish = async () => {
    setFinishing(true);
    // Mock API call
    setTimeout(() => {
      setFinishing(false);
      // Navigate to dashboard
    }, 3000);
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
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Review & Finish
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Review your configuration and check DNS status before completing setup.
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={4}>
        {/* Configuration Summary */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Configuration Summary
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Domain
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {mockConfiguration.domain}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Company
                </Typography>
                <Typography variant="body1">
                  {mockConfiguration.company}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Sending Email
                </Typography>
                <Typography variant="body1">
                  {mockConfiguration.sendingEmail}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  DNS Provider
                </Typography>
                <Typography variant="body1">
                  {mockConfiguration.dnsProvider}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Region
                </Typography>
                <Typography variant="body1">
                  {mockConfiguration.region}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* DNS Status */}
        <Box>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  DNS Status
                </Typography>
                <Button
                  size="small"
                  startIcon={checking ? <CircularProgress size={16} /> : <Refresh />}
                  onClick={handleCheckDns}
                  disabled={checking}
                >
                  Recheck
                </Button>
              </Box>
              
              <Box mb={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    SPF Record
                  </Typography>
                  <Chip
                    icon={getStatusIcon(dnsStatus.spf)}
                    label={dnsStatus.spf}
                    size="small"
                    color={getStatusColor(dnsStatus.spf) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box mb={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    DKIM Record
                  </Typography>
                  <Chip
                    icon={getStatusIcon(dnsStatus.dkim)}
                    label={dnsStatus.dkim}
                    size="small"
                    color={getStatusColor(dnsStatus.dkim) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    Tracking CNAME
                  </Typography>
                  <Chip
                    icon={getStatusIcon(dnsStatus.trackingCname)}
                    label={dnsStatus.trackingCname}
                    size="small"
                    color={getStatusColor(dnsStatus.trackingCname) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        DNS changes can take up to 24 hours to propagate. You can complete setup now and check status later from the Credentials page.
      </Alert>

      <Button
        variant="contained"
        size="large"
        onClick={handleFinish}
        disabled={finishing}
        startIcon={finishing ? <CircularProgress size={20} /> : undefined}
        sx={{ px: 4 }}
      >
        {finishing ? 'Finishing Setup...' : 'Complete Setup'}
      </Button>
    </Box>
  );
}