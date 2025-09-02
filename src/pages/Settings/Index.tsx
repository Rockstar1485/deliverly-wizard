import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  PersonAdd,
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending';
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'sarah@example.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-01-10',
  },
  {
    id: '3',
    email: 'mike@example.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2024-01-15',
  },
];

export default function SettingsIndex() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'viewer'>('member');

  const handleInviteTeamMember = () => {
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: Math.random().toString(),
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    setInviteRole('member');
    setInviteDialogOpen(false);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'member':
        return 'primary';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={4}>
        {/* Profile Settings */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>
              Profile Settings
            </Typography>
            
            <TextField
              fullWidth
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Email Address"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              sx={{ mb: 3 }}
            />
            
            <Button variant="contained">
              Save Changes
            </Button>
          </Paper>
        </Box>

        {/* Organization Settings */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>
              Organization Settings
            </Typography>
            
            <TextField
              fullWidth
              label="Organization Name"
              defaultValue="Acme Inc"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Default Sender Email"
              defaultValue="noreply@acme.com"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Support Email"
              defaultValue="support@acme.com"
              sx={{ mb: 3 }}
            />
            
            <Button variant="contained">
              Update Organization
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Team Management */}
      <Box mb={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6">
                Team Members
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setInviteDialogOpen(true)}
              >
                Invite Member
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          color={getRoleColor(member.role) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          color={getStatusColor(member.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveTeamMember(member.id)}
                            disabled={member.role === 'admin'}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
      </Box>

      {/* Billing Section */}
      <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>
              Billing & Subscription
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Plan
                </Typography>
                <Typography variant="h6">
                  Professional
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Monthly Usage
                </Typography>
                <Typography variant="h6">
                  5,240 / 50,000
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Next Billing Date
                </Typography>
                <Typography variant="h6">
                  Feb 15, 2024
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" gap={2}>
              <Button variant="outlined">
                View Billing History
              </Button>
              <Button variant="contained">
                Upgrade Plan
              </Button>
            </Box>
          </Paper>
      </Box>

      {/* Invite Team Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={inviteRole}
              label="Role"
              onChange={(e) => setInviteRole(e.target.value as 'member' | 'viewer')}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInviteTeamMember}
            variant="contained"
            disabled={!inviteEmail.trim()}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}