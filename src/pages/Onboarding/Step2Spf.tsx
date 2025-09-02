import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import { ContentCopy, Add, Delete } from '@mui/icons-material';

export default function Step2Spf() {
  const [spfPolicy, setSpfPolicy] = useState('v=spf1 include:_spf.google.com ~all');
  const [additionalIncludes, setAdditionalIncludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState('');

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setAdditionalIncludes([...additionalIncludes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setAdditionalIncludes(additionalIncludes.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(spfPolicy);
    // Show toast notification
  };

  const generateSpfRecord = () => {
    const includes = ['include:_spf.google.com', ...additionalIncludes.map(inc => `include:${inc}`)];
    return `v=spf1 ${includes.join(' ')} ~all`;
  };

  React.useEffect(() => {
    setSpfPolicy(generateSpfRecord());
  }, [additionalIncludes]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        SPF Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Configure your SPF (Sender Policy Framework) record to authorize email sending.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        SPF helps prevent email spoofing by specifying which servers are allowed to send emails from your domain.
      </Alert>

      <Box mb={3}>
        <Typography variant="h6" mb={2}>
          Additional Includes (Optional)
        </Typography>
        
        <Box display="flex" gap={1} mb={2}>
          <TextField
            size="small"
            placeholder="mailgun.org"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()}
          />
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddInclude}
          >
            Add
          </Button>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          {additionalIncludes.map((include, index) => (
            <Chip
              key={index}
              label={`include:${include}`}
              deleteIcon={<Delete />}
              onDelete={() => handleRemoveInclude(index)}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Paper sx={{ p: 3, bgcolor: 'grey.900' }}>
        <Typography variant="h6" mb={2}>
          DNS Record Preview
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="text.secondary">
            TXT Record for @ (root domain)
          </Typography>
          <Button
            size="small"
            startIcon={<ContentCopy />}
            onClick={handleCopy}
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
            wordBreak: 'break-all',
          }}
        >
          {spfPolicy}
        </Box>
      </Paper>
    </Box>
  );
}