import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
} from '@mui/material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SingleCheck from './SingleCheck';
import BulkUpload from './BulkUpload';
import ApiSettings from './ApiSettings';

const tabs = [
  { label: 'Single Check', path: 'single' },
  { label: 'Bulk Upload', path: 'bulk' },
  { label: 'API Settings', path: 'api' },
];

export default function VerificationShell() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/').pop() || 'single';
  const activeTab = tabs.findIndex(tab => tab.path === currentPath);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(`/verification/${tabs[newValue].path}`);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Email Verification
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab === -1 ? 0 : activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <Routes>
        <Route path="/" element={<SingleCheck />} />
        <Route path="/single" element={<SingleCheck />} />
        <Route path="/bulk" element={<BulkUpload />} />
        <Route path="/api" element={<ApiSettings />} />
      </Routes>
    </Box>
  );
}