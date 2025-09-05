import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, FileUp, RefreshCcw, Upload as UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import JobProgress from "@/components/JobProgress";
import ResultsTable from "@/components/ResultsTable";
import SummaryCard from "@/components/SummaryCard";

import {
  createJob,
  getJob,
  getResults,
  getSummary,
  exportCsvUrl,
  exportJsonUrl,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Job = {
  id: string;
  state: string;
  processed: number;
  total: number | null;
  started_at: number;
  finished_at: number | null;
  error?: string | null;
  preview: any[];
};

export default function UploadValidate() {
  const { jobId: paramJobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string>(paramJobId || "");
  const [job, setJob] = useState<Job | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);

  const hiddenFileRef = useRef<HTMLInputElement | null>(null);
  const pollRef = useRef<number | null>(null);

  const clearPoll = () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = null;
  };

  // Deep-linking support
  useEffect(() => {
    if (paramJobId) {
      setJobId(paramJobId);
      startPolling(paramJobId);
    }
    return () => clearPoll();
  }, [paramJobId]);

  const startPolling = (id: string) => {
    clearPoll();
    pollRef.current = window.setInterval(async () => {
      try {
        const j: Job = await getJob(id);
        setJob(j);

        if (["finished", "error", "cancelled"].includes(j.state)) {
          clearPoll();

          const r = await getResults(id);
          setResults(Array.isArray(r.results) ? r.results : []);

          const s = await getSummary(id);
          setSummary(s);

          // save last successful job for Dashboard
          if (j.state === "finished") {
            localStorage.setItem("deliverly.lastJobId", id);
          }

          if (j.state === "error") {
            toast({
              title: "Job failed",
              description: j.error || "Unknown error",
              variant: "destructive",
            });
          }
        }
      } catch (e: any) {
        clearPoll();
        toast({
          title: "Polling error",
          description: String(e),
          variant: "destructive",
        });
      }
    }, 900);
  };

  const onUpload = async () => {
    if (!file) {
      toast({ title: "Choose a CSV file first." });
      return;
    }
    try {
      const { job_id } = await createJob(file);
      setJobId(job_id);
      setJob({
        id: job_id,
        state: "queued",
        processed: 0,
        total: null,
        started_at: Date.now() / 1000,
        finished_at: null,
        error: null,
        preview: [],
      });
      setResults([]);
      setSummary(null);
      navigate(`/upload-validate/${job_id}`, { replace: true });
      startPolling(job_id);
    } catch (e: any) {
      toast({
        title: "Failed to create job",
        description: String(e),
        variant: "destructive",
      });
    }
  };

  const onCopyJobId = async () => {
    if (!jobId) return;
    try {
      await navigator.clipboard.writeText(jobId);
      toast({ title: "Copied job ID" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const onNewUpload = () => {
    clearPoll();
    setJobId("");
    setJob(null);
    setResults([]);
    setSummary(null);
    setFile(null);
    if (hiddenFileRef.current) hiddenFileRef.current.value = "";
    navigate("/upload-validate", { replace: true });
  };

  const exporting = Boolean(jobId) && job?.state === "finished";

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-foreground">CSV Validation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a contacts CSV to pre-validate domains, generate likely emails, and flag risks.
          </p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2">
          {exporting && (
            <>
              <Button asChild>
                <a href={exportCsvUrl(jobId)} download>Export CSV</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={exportJsonUrl(jobId)} target="_blank" rel="noreferrer">Export JSON</a>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Upload card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Pretty file picker (native input is hidden) */}
            <input
              ref={hiddenFileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button
              variant="outline"
              onClick={() => hiddenFileRef.current?.click()}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Choose CSV
            </Button>

            <Button onClick={onUpload} disabled={!file}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload &amp; Validate
            </Button>

            <Button variant="ghost" onClick={onNewUpload}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              New upload
            </Button>

            {/* File + Job ID inline */}
            <div className="text-xs text-muted-foreground">
              {file ? (
                <span className="mr-2">
                  File: <span className="font-medium">{file.name}</span>
                </span>
              ) : (
                "No file selected"
              )}
              {jobId && (
                <button
                  onClick={onCopyJobId}
                  className="ml-3 inline-flex items-center gap-1 rounded px-2 py-1 bg-muted hover:bg-muted/80 transition-colors"
                  title="Copy Job ID"
                >
                  <Copy className="h-3 w-3" />
                  <span className="truncate max-w-[220px]">{jobId}</span>
                </button>
              )}
            </div>
          </div>

          <Separator />

          {/* Progress */}
          {job && (
            <JobProgress
              state={job.state}
              processed={job.processed}
              total={job.total}
            />
          )}
        </CardContent>
      </Card>

      {/* Summary + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <SummaryCard
                  total={summary.total ?? 0}
                  deliverable={summary.deliverable ?? 0}
                  undeliverable={summary.undeliverable ?? 0}
                  risky={summary.risky ?? 0}
                  unknown={summary.unknown ?? 0}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No summary yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results table */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsTable rows={results} pageSize={100} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}