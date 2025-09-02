import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { z } from 'zod';

const DomainSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, 'Invalid domain format'),
  sendingEmail: z.string().email('Invalid email address'),
  dnsProvider: z.enum(['cloudflare', 'route53', 'godaddy', 'namecheap', 'other']),
  region: z.enum(['US', 'EU', 'IN']),
});

type DomainFormData = z.infer<typeof DomainSchema>;

export default function Step1Domain() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DomainFormData>({
    resolver: zodResolver(DomainSchema),
    defaultValues: {
      dnsProvider: 'cloudflare',
      region: 'US',
    },
  });

  const dnsProvider = watch('dnsProvider');
  const region = watch('region');

  const onSubmit = (data: DomainFormData) => {
    console.log('Domain configuration:', data);
    // Save to context or API
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Business & Domain Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Let's start by configuring your business information and domain settings.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
          <TextField
            fullWidth
            label="Company Name"
            {...register('companyName')}
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
          />
          
          <TextField
            fullWidth
            label="Domain"
            placeholder="example.com"
            {...register('domain')}
            error={!!errors.domain}
            helperText={errors.domain?.message}
          />
          
          <TextField
            fullWidth
            label="Sending Email Address"
            placeholder="noreply@example.com"
            {...register('sendingEmail')}
            error={!!errors.sendingEmail}
            helperText={errors.sendingEmail?.message}
          />
          
          <FormControl fullWidth>
            <InputLabel>DNS Provider</InputLabel>
            <Select
              {...register('dnsProvider')}
              label="DNS Provider"
              value={dnsProvider}
            >
              <MenuItem value="cloudflare">Cloudflare</MenuItem>
              <MenuItem value="route53">AWS Route 53</MenuItem>
              <MenuItem value="godaddy">GoDaddy</MenuItem>
              <MenuItem value="namecheap">Namecheap</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              {...register('region')}
              label="Region"
              value={region}
            >
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="EU">Europe</MenuItem>
              <MenuItem value="IN">India</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </form>
    </Box>
  );
}