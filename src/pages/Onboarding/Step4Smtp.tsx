import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Science, CheckCircle, Error } from '@mui/icons-material';

export default function Step4Smtp() {
  const [config, setConfig] = useState({
    host: '',
    port: 587,
    username: '',
    password: '',
    tls: true,
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null); // Clear previous test results
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Mock API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success,
        message: success 
          ? 'SMTP connection successful! Configuration is valid.' 
          : 'Connection failed. Please check your credentials and try again.'
      });
      setTesting(false);
    }, 2000);
  };

  const isConfigValid = config.host && config.port && config.username && config.password;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        SMTP Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Configure your SMTP server settings for sending emails.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        These credentials will be used to send emails through your SMTP provider (Gmail, SendGrid, Mailgun, etc.).
      </Alert>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3} mb={3}>
        <TextField
          fullWidth
          label="SMTP Host"
          placeholder="smtp.gmail.com"
          value={config.host}
          onChange={(e) => handleChange('host', e.target.value)}
        />
        
        <TextField
          fullWidth
          label="Port"
          type="number"
          value={config.port}
          onChange={(e) => handleChange('port', parseInt(e.target.value))}
          helperText="Common ports: 587 (TLS), 465 (SSL), 25 (unsecured)"
        />
        
        <TextField
          fullWidth
          label="Username"
          value={config.username}
          onChange={(e) => handleChange('username', e.target.value)}
          helperText="Usually your email address"
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={config.password}
          onChange={(e) => handleChange('password', e.target.value)}
          helperText="App password or SMTP password"
        />
      </Box>
      
      <FormControlLabel
        control={
          <Switch
            checked={config.tls}
            onChange={(e) => handleChange('tls', e.target.checked)}
          />
        }
        label="Enable TLS/SSL"
        sx={{ mb: 3 }}
      />

      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={testing ? <CircularProgress size={16} /> : <Science />}
          onClick={handleTestConnection}
          disabled={!isConfigValid || testing}
        >
          {testing ? 'Testing Connection...' : 'Test Connection'}
        </Button>

        {testResult && (
          <Chip
            icon={testResult.success ? <CheckCircle /> : <Error />}
            label={testResult.success ? 'Success' : 'Failed'}
            color={testResult.success ? 'success' : 'error'}
            variant="outlined"
          />
        )}
      </Box>

      {testResult && (
        <Alert severity={testResult.success ? 'success' : 'error'}>
          {testResult.message}
        </Alert>
      )}
    </Box>
  );
}