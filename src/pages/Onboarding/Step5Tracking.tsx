import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import { ContentCopy, Refresh } from '@mui/icons-material';

export default function Step5Tracking() {
  const [config, setConfig] = useState({
    trackingDomain: '',
    bounceWebhookUrl: '',
    eventWebhookUrl: '',
    signingSecret: 'wh_' + Math.random().toString(36).substring(2, 15),
  });

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const generateNewSecret = () => {
    const newSecret = 'wh_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setConfig(prev => ({ ...prev, signingSecret: newSecret }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Tracking & Webhooks
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Configure email tracking and webhook endpoints for event notifications.
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} mb={3}>
        <TextField
          fullWidth
          label="Tracking Domain (Optional)"
          placeholder="track.yourdomain.com"
          value={config.trackingDomain}
          onChange={(e) => handleChange('trackingDomain', e.target.value)}
          helperText="Custom domain for click and open tracking. Requires CNAME setup."
        />
        
        <TextField
          fullWidth
          label="Bounce Webhook URL"
          placeholder="https://yourapp.com/webhooks/bounce"
          value={config.bounceWebhookUrl}
          onChange={(e) => handleChange('bounceWebhookUrl', e.target.value)}
          helperText="Endpoint to receive bounce notifications"
        />
        
        <TextField
          fullWidth
          label="Event Webhook URL"
          placeholder="https://yourapp.com/webhooks/events"
          value={config.eventWebhookUrl}
          onChange={(e) => handleChange('eventWebhookUrl', e.target.value)}
          helperText="Endpoint to receive delivery, open, and click events"
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Webhook Signing Secret
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TextField
            fullWidth
            label="Signing Secret"
            value={config.signingSecret}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <>
                  <IconButton
                    onClick={() => handleCopy(config.signingSecret)}
                    size="small"
                  >
                    <ContentCopy />
                  </IconButton>
                  <IconButton
                    onClick={generateNewSecret}
                    size="small"
                  >
                    <Refresh />
                  </IconButton>
                </>
              ),
            }}
          />
        </Box>
        
        <Alert severity="info">
          Use this secret to verify webhook signatures and ensure requests are coming from Deliverly.
        </Alert>
      </Paper>

      {config.trackingDomain && (
        <Paper sx={{ p: 3, bgcolor: 'grey.900' }}>
          <Typography variant="h6" mb={2}>
            DNS Configuration for Tracking Domain
          </Typography>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="body2" color="text.secondary">
              CNAME Record
            </Typography>
            <Button
              size="small"
              startIcon={<ContentCopy />}
              onClick={() => handleCopy(`${config.trackingDomain} CNAME track.deliverly.io`)}
            >
              Copy
            </Button>
          </Box>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
            }}
          >
            {config.trackingDomain} CNAME track.deliverly.io
          </Box>
        </Paper>
      )}
    </Box>
  );
}