import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Step1Domain from './Step1Domain';
import Step2Spf from './Step2Spf';
import Step3Dkim from './Step3Dkim';
import Step4Smtp from './Step4Smtp';
import Step5Tracking from './Step5Tracking';
import Step6Review from './Step6Review';

const steps = [
  { label: 'Business & Domain', path: 'domain' },
  { label: 'SPF Configuration', path: 'spf' },
  { label: 'DKIM Setup', path: 'dkim' },
  { label: 'SMTP Settings', path: 'smtp' },
  { label: 'Tracking & Webhooks', path: 'tracking' },
  { label: 'Review & Finish', path: 'review' },
];

export default function OnboardingShell() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/').pop() || 'domain';
  const activeStep = steps.findIndex(step => step.path === currentPath);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      navigate(`/onboarding/${steps[nextStep].path}`);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      navigate(`/onboarding/${steps[prevStep].path}`);
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Email Deliverability Setup
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />
        
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3, minHeight: 400 }}>
        <Routes>
          <Route path="/" element={<Step1Domain />} />
          <Route path="/domain" element={<Step1Domain />} />
          <Route path="/spf" element={<Step2Spf />} />
          <Route path="/dkim" element={<Step3Dkim />} />
          <Route path="/smtp" element={<Step4Smtp />} />
          <Route path="/tracking" element={<Step5Tracking />} />
          <Route path="/review" element={<Step6Review />} />
        </Routes>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            variant="contained"
          >
            {activeStep === steps.length - 2 ? 'Review' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}