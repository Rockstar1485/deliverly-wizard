import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RefreshCw, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockCredentials = {
  spf: 'v=spf1 include:_spf.google.com ~all',
  dkim: {
    selector: 'default',
    record: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4P4bVjt8+TKqmnJl8...',
  },
  tracking: {
    domain: 'track.example.com',
    cname: 'track.example.com CNAME track.deliverly.io',
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'noreply@example.com',
  },
};

const mockDnsStatus = {
  spf: 'verified',
  dkim: 'pending',
  tracking: 'error',
};

export default function Credentials() {
  const [checking, setChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState(mockDnsStatus);
  const { toast } = useToast();

  const handleCheckDns = async () => {
    setChecking(true);
    
    // Mock API call
    setTimeout(() => {
      // Simulate status changes
      setDnsStatus({
        spf: 'verified',
        dkim: Math.random() > 0.5 ? 'verified' : 'pending',
        tracking: Math.random() > 0.7 ? 'verified' : 'error',
      });
      setChecking(false);
    }, 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record has been copied to your clipboard.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default' as const;
      case 'pending':
        return 'secondary' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">DNS Credentials</h1>
        <Button
          variant="outline"
          onClick={handleCheckDns}
          disabled={checking}
          className="gap-2"
        >
          {checking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {checking ? 'Checking DNS...' : 'Recheck DNS'}
        </Button>
      </div>

      <Alert>
        <AlertDescription>
          DNS changes can take up to 24 hours to propagate. Make sure to add these records to your DNS provider.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* SPF Record */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>SPF Record</CardTitle>
              <Badge variant={getStatusVariant(dnsStatus.spf)} className="gap-1">
                {getStatusIcon(dnsStatus.spf)}
                {dnsStatus.spf}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              TXT Record for @ (root domain)
            </p>
            
            <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
              {mockCredentials.spf}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleCopy(mockCredentials.spf)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy SPF Record
            </Button>
          </CardContent>
        </Card>

        {/* DKIM Record */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>DKIM Record</CardTitle>
              <Badge variant={getStatusVariant(dnsStatus.dkim)} className="gap-1">
                {getStatusIcon(dnsStatus.dkim)}
                {dnsStatus.dkim}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              TXT Record for {mockCredentials.dkim.selector}._domainkey
            </p>
            
            <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
              {mockCredentials.dkim.record}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleCopy(mockCredentials.dkim.record)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy DKIM Record
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Domain */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tracking Domain</CardTitle>
              <Badge variant={getStatusVariant(dnsStatus.tracking)} className="gap-1">
                {getStatusIcon(dnsStatus.tracking)}
                {dnsStatus.tracking}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              CNAME Record for tracking domain
            </p>
            
            <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
              {mockCredentials.tracking.cname}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleCopy(mockCredentials.tracking.cname)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy CNAME Record
            </Button>
          </CardContent>
        </Card>

        {/* SMTP Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>SMTP Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Host</p>
                <p className="font-mono text-sm">{mockCredentials.smtp.host}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Port</p>
                <p className="font-mono text-sm">{mockCredentials.smtp.port}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="font-mono text-sm">{mockCredentials.smtp.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}