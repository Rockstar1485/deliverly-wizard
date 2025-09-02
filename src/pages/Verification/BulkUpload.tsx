import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import { CloudUpload, Download, Refresh } from '@mui/icons-material';

interface UploadJob {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  processed: number;
  total: number;
  valid: number;
  invalid: number;
  risky: number;
  createdAt: string;
}

const mockJobs: UploadJob[] = [
  {
    id: '1',
    filename: 'customer_emails.csv',
    status: 'completed',
    processed: 1500,
    total: 1500,
    valid: 1200,
    invalid: 200,
    risky: 100,
    createdAt: '2024-01-15 14:30',
  },
  {
    id: '2',
    filename: 'marketing_list.csv',
    status: 'processing',
    processed: 750,
    total: 2000,
    valid: 600,
    invalid: 100,
    risky: 50,
    createdAt: '2024-01-15 15:45',
  },
];

export default function BulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [jobs, setJobs] = useState<UploadJob[]>(mockJobs);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Mock upload process
    setTimeout(() => {
      const newJob: UploadJob = {
        id: Math.random().toString(),
        filename: file.name,
        status: 'processing',
        processed: 0,
        total: 1000,
        valid: 0,
        invalid: 0,
        risky: 0,
        createdAt: new Date().toLocaleString(),
      };
      setJobs([newJob, ...jobs]);
      setUploading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={3}>
          Bulk Email Verification
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Upload a CSV file with an "email" column. We'll verify each email address and provide detailed results.
        </Alert>

        <Box textAlign="center">
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUpload />}
              disabled={uploading}
              size="large"
            >
              {uploading ? 'Uploading...' : 'Upload CSV File'}
            </Button>
          </label>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6">
            Verification Jobs
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={() => {/* Refresh jobs */}}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Valid</TableCell>
                <TableCell>Invalid</TableCell>
                <TableCell>Risky</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.filename}</TableCell>
                  <TableCell>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1} minWidth={120}>
                      <LinearProgress
                        variant="determinate"
                        value={(job.processed / job.total) * 100}
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {job.processed}/{job.total}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={job.valid} color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={job.invalid} color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={job.risky} color="warning" size="small" />
                  </TableCell>
                  <TableCell>{job.createdAt}</TableCell>
                  <TableCell>
                    {job.status === 'completed' && (
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => {/* Download results */}}
                      >
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}