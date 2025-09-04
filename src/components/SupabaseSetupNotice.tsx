import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { isSupabaseConfigured } from '../lib/supabase';

export function SupabaseSetupNotice() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="flex items-center justify-between">
          <div>
            <strong>Supabase Setup Required</strong>
            <p className="mt-1 text-sm">
              Click the green Supabase button in the top right to connect your database and enable full functionality.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={() => {
              // This would ideally trigger the Supabase setup flow
              alert('Please click the green Supabase button in the top right of the interface to set up your database.');
            }}
          >
            Setup Guide
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}