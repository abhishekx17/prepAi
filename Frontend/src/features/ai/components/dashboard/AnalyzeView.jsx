import React from 'react';
import { ArrowRight, FileSearch } from 'lucide-react';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';
import SharedJobFields from './SharedJobFields';

const AnalyzeView = ({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  selfDescription,
  setSelfDescription,
  error,
  successMsg,
  onClear,
  onSubmit,
  renderResumeUpload,
}) => (
  <div className="mx-auto max-w-5xl">
    <Card className="p-5 sm:p-6">
      <CardHeader
        icon={FileSearch}
        title="Resume Analysis"
        description="Upload your resume and paste a job description to generate a structured compatibility report with match score, gaps, and preparation recommendations."
        action={
          <Button variant="secondary" size="sm" onClick={onClear} className="h-8 text-xs px-2.5">
            Reset
          </Button>
        }
      />

    {(error || successMsg) && (
      <div className="mt-4">
        <Alert type={error ? 'error' : 'success'}>{error || successMsg}</Alert>
      </div>
    )}

    <form onSubmit={onSubmit} className="mt-5 space-y-5">
      <SharedJobFields
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        selfDescription={selfDescription}
        setSelfDescription={setSelfDescription}
        renderResumeUpload={renderResumeUpload}
      />

      <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between select-none">
        <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium max-w-md">
          Generates compatibility scores, outlines skill gaps, and plans question roadmaps.
        </p>
        <Button type="submit" size="md" className="w-full sm:w-auto h-9">
          Generate report
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
    </Card>
  </div>
);

export default AnalyzeView;
