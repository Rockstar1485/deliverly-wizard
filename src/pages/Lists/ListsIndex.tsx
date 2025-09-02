import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  TextField,
} from '@mui/material';
import {
  Add,
  CloudUpload,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface EmailList {
  id: string;
  name: string;
  count: number;
  updatedAt: string;
  status: 'active' | 'processing' | 'error';
}

const mockLists: EmailList[] = [
  {
    id: '1',
    name: 'Newsletter Subscribers',
    count: 12450,
    updatedAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Product Updates',
    count: 8900,
    updatedAt: '2024-01-14',
    status: 'active',
  },
  {
    id: '3',
    name: 'Marketing Campaign Q1',
    count: 5670,
    updatedAt: '2024-01-13',
    status: 'processing',
  },
];

export default function ListsIndex() {
  const [lists, setLists] = useState<EmailList[]>(mockLists);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const navigate = useNavigate();

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: EmailList = {
      id: Math.random().toString(),
      name: newListName,
      count: 0,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setLists([newList, ...lists]);
    setNewListName('');
    setCreateDialogOpen(false);
  };

  const handleDeleteList = (id: string) => {
    setLists(lists.filter(list => list.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Email Lists
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create List
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contacts</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {list.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {list.count.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={list.status}
                      color={getStatusColor(list.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(list.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/lists/${list.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <CloudUpload />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteList(list.id)}
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

        {lists.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No email lists yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first email list to start managing contacts
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Your First List
            </Button>
          </Box>
        )}
      </Paper>

      {/* Create List Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Email List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            fullWidth
            variant="outlined"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateList}
            variant="contained"
            disabled={!newListName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}