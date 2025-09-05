import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  FileSpreadsheet, 
  UploadCloud, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  HelpCircle,
  Activity,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SummaryCard from "@/components/SummaryCard";
import { getSummary, exportCsvUrl, exportJsonUrl } from "@/lib/api";

type Summary = {
  job_id: string;
  total: number;
  deliverable: number;
  undeliverable: number;
  risky: number;
  unknown: number;
};

export default function Dashboard() {
  const [lastJobId, setLastJobId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("deliverly.lastJobId");
    setLastJobId(id);
    (async () => {
      if (id) {
        try {
          const s = await getSummary(id);
          setSummary(s);
        } catch {
          // ignore for now
        }
      }
    })();
  }, []);

  const getSuccessRate = () => {
    if (!summary || summary.total === 0) return 0;
    return Math.round((summary.deliverable / summary.total) * 100);
  };

  const getRiskRate = () => {
    if (!summary || summary.total === 0) return 0;
    return Math.round(((summary.risky + summary.undeliverable) / summary.total) * 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/20 border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Email Validation Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Monitor your validation performance and manage your email lists
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              {summary && (
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-success font-medium">{getSuccessRate()}% Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{summary.total.toLocaleString()} Total Validated</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/upload-validate">
                  <UploadCloud className="h-5 w-5 mr-2" />
                  New Validation
                </Link>
              </Button>
              {lastJobId && (
                <Button variant="outline" size="lg" className="shadow-sm hover:shadow-lg transition-all" asChild>
                  <Link to={`/upload-validate/${lastJobId}`}>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    View Results
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6 space-y-8">
        {/* Metrics Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="stat-card success-stat accent-stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deliverable</p>
                    <p className="metric-value">{summary.deliverable.toLocaleString()}</p>
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {Math.round((summary.deliverable / summary.total) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card warning-stat accent-stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risky</p>
                    <p className="metric-value">{summary.risky.toLocaleString()}</p>
                    <p className="text-xs text-warning mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {Math.round((summary.risky / summary.total) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/10">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card accent-stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Undeliverable</p>
                    <p className="metric-value">{summary.undeliverable.toLocaleString()}</p>
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {Math.round((summary.undeliverable / summary.total) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-destructive/10">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card info-stat accent-stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unknown</p>
                    <p className="metric-value">{summary.unknown.toLocaleString()}</p>
                    <p className="text-xs text-info mt-1 flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      {Math.round((summary.unknown / summary.total) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-info/10">
                    <HelpCircle className="h-6 w-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-card hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UploadCloud className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">Start Validation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload a CSV file to validate email addresses, check deliverability, and generate insights for your campaigns.
              </p>
              <Button asChild className="w-full shadow-sm hover:shadow-md transition-all">
                <Link to="/upload-validate">
                  <Zap className="h-4 w-4 mr-2" />
                  Begin Validation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <FileSpreadsheet className="h-5 w-5 text-success" />
                </div>
                <CardTitle className="text-lg font-semibold">Export Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download your validation results in CSV or JSON format for integration with your marketing tools.
              </p>
              <div className="flex gap-2">
                <Button 
                  asChild 
                  size="sm" 
                  disabled={!lastJobId}
                  className="flex-1 shadow-sm hover:shadow-md transition-all"
                >
                  <a href={lastJobId ? exportCsvUrl(lastJobId) : "#"} download>
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    CSV
                  </a>
                </Button>
                <Button 
                  asChild 
                  size="sm" 
                  variant="secondary" 
                  disabled={!lastJobId}
                  className="flex-1 shadow-sm hover:shadow-md transition-all"
                >
                  <a
                    href={lastJobId ? exportJsonUrl(lastJobId) : "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    JSON
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                <CardTitle className="text-lg font-semibold">Advanced Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enhanced SMTP verification and real-time validation features coming soon.
              </p>
              <Button size="sm" variant="outline" disabled className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Card className="gradient-card h-full border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Validation Summary</CardTitle>
                  {summary && (
                    <div className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium">Latest Results</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {summary ? (
                  <SummaryCard
                    total={summary.total}
                    deliverable={summary.deliverable}
                    undeliverable={summary.undeliverable}
                    risky={summary.risky}
                    unknown={summary.unknown}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-muted/20 mb-4">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No validation data available yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start your first validation to see detailed analytics here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="gradient-card h-full border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Clean Data</p>
                        <p className="text-xs text-muted-foreground">Remove duplicates before validation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-info/5 border border-info/20">
                      <TrendingUp className="h-5 w-5 text-info flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Regular Updates</p>
                        <p className="text-xs text-muted-foreground">Re-validate lists monthly</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Monitor Risks</p>
                        <p className="text-xs text-muted-foreground">Review risky addresses carefully</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Activity className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Track Performance</p>
                        <p className="text-xs text-muted-foreground">Use analytics to improve quality</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}