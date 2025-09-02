import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ContentCopy, Key, Download } from '@mui/icons-material';

export default function Step3Dkim() {
  const [selector, setSelector] = useState('default');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateKeys = async () => {
    setGenerating(true);
    
    // Mock API call
    setTimeout(() => {
      const mockPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4P4bVjt8+TKqmnJl8J3yBHJiQX...';
      const mockPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...';
      
      setPublicKey(mockPublicKey);
      setPrivateKey(mockPrivateKey);
      setShowPrivateKey(true);
      setGenerating(false);
    }, 2000);
  };

  const handleCopyPublic = () => {
    navigator.clipboard.writeText(publicKey);
  };

  const handleDownloadPrivate = () => {
    const blob = new Blob([privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selector}.private.pem`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDnsRecord = () => {
    if (!publicKey) return '';
    return `v=DKIM1; k=rsa; p=${publicKey}`;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        DKIM Setup
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Configure DKIM (DomainKeys Identified Mail) to digitally sign your emails.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        DKIM adds a digital signature to your emails, helping receivers verify that the email was actually sent by you and hasn't been tampered with.
      </Alert>

      <Box mb={3}>
        <TextField
          fullWidth
          label="DKIM Selector"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          helperText="A unique identifier for this DKIM key (e.g., 'default', 'mail', or current month/year)"
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          startIcon={<Key />}
          onClick={handleGenerateKeys}
          disabled={generating || !selector}
          fullWidth={false}
        >
          {generating ? 'Generating Keys...' : 'Generate DKIM Keys'}
        </Button>
      </Box>

      {publicKey && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>
            DNS Record
          </Typography>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="body2" color="text.secondary">
              TXT Record for {selector}._domainkey
            </Typography>
            <Button
              size="small"
              startIcon={<ContentCopy />}
              onClick={handleCopyPublic}
            >
              Copy
            </Button>
          </Box>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
            }}
          >
            {getDnsRecord()}
          </Box>
        </Paper>
      )}

      <Dialog
        open={showPrivateKey}
        onClose={() => setShowPrivateKey(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Private Key Generated
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This private key will only be shown once. Please download and store it securely.
          </Alert>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {privateKey}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPrivate}
          >
            Download Private Key
          </Button>
          <Button onClick={() => setShowPrivateKey(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}