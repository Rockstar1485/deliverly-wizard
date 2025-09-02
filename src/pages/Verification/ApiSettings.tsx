import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ContentCopy,
  Visibility,
  VisibilityOff,
  Refresh,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockUsageData = [
  { date: '2024-01-01', requests: 450 },
  { date: '2024-01-02', requests: 680 },
  { date: '2024-01-03', requests: 520 },
  { date: '2024-01-04', requests: 890 },
  { date: '2024-01-05', requests: 750 },
  { date: '2024-01-06', requests: 620 },
  { date: '2024-01-07', requests: 940 },
];

export default function ApiSettings() {
  const [apiKey, setApiKey] = useState('vapi_live_abc123def456ghi789jkl012mno345');
  const [showApiKey, setShowApiKey] = useState(false);
  const [neverbounceKey, setNeverbounceKey] = useState('');
  const [parallelism, setParallelism] = useState(5);
  const [dailyCap, setDailyCap] = useState(10000);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    // Show toast notification
  };

  const handleRegenerateApiKey = () => {
    const newKey = 'vapi_live_' + Math.random().toString(36).substring(2, 35);
    setApiKey(newKey);
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* API Key Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={3}>
            API Key Management
          </Typography>
          
          <Box mb={3}>
            <TextField
              fullWidth
              label="API Key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Box display="flex" gap={1}>
                    <IconButton
                      onClick={() => setShowApiKey(!showApiKey)}
                      edge="end"
                    >
                      {showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton onClick={handleCopyApiKey} edge="end">
                      <ContentCopy />
                    </IconButton>
                    <IconButton onClick={handleRegenerateApiKey} edge="end">
                      <Refresh />
                    </IconButton>
                  </Box>
                ),
              }}
            />
          </Box>

          <Alert severity="warning">
            Keep your API key secure. If you regenerate it, you'll need to update all your applications.
          </Alert>
        </Paper>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          {/* Settings */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>
              Verification Settings
            </Typography>
            
            <TextField
              fullWidth
              label="NeverBounce API Key (Optional)"
              placeholder="secret_..."
              value={neverbounceKey}
              onChange={(e) => setNeverbounceKey(e.target.value)}
              type="password"
              sx={{ mb: 3 }}
              helperText="Connect NeverBounce for enhanced verification"
            />
            
            <TextField
              fullWidth
              label="Parallelism"
              type="number"
              inputProps={{ min: 1, max: 20 }}
              value={parallelism}
              onChange={(e) => setParallelism(parseInt(e.target.value))}
              sx={{ mb: 3 }}
              helperText="Number of concurrent verification requests (1-20)"
            />
            
            <TextField
              fullWidth
              label="Daily Cap"
              type="number"
              inputProps={{ min: 100, max: 100000 }}
              value={dailyCap}
              onChange={(e) => setDailyCap(parseInt(e.target.value))}
              helperText="Maximum verifications per day (100-100,000)"
            />
          </Paper>

          {/* Usage Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>
              Usage Statistics
            </Typography>
            
            <Box display="flex" gap={2} mb={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="primary">
                  5,240
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  940
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today
                </Typography>
              </Box>
            </Box>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}