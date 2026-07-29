import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Select, FieldLabel } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';
import SharedJobFields from './SharedJobFields';

const MockInterviewView = ({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  selfDescription,
  setSelfDescription,
  difficulty,
  setDifficulty,
  focusArea,
  setFocusArea,
  error,
  successMsg,
  onClear,
  onSubmit,
  renderResumeUpload,
}) => (
  <div className="mx-auto max-w-5xl">
    <Card className="p-5 sm:p-6">
      <CardHeader
        icon={MessageSquare}
        title="Mock Interview"
        description="Configure a personalized AI-led interview session based on your resume and target role. Choose difficulty level and focus area."
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

      <div className="grid gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/35 p-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
          <Select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-9">
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="focusArea">Focus area</FieldLabel>
          <Select id="focusArea" value={focusArea} onChange={(e) => setFocusArea(e.target.value)} className="h-9">
            <option value="Coding Heavy">Coding Heavy</option>
            <option value="System Design">System Design</option>
            <option value="Behavioral">Behavioral</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between select-none">
        <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium max-w-md">
          Creates a live session responding to your inputs and coding templates in real-time.
        </p>
        <Button type="submit" size="md" className="w-full sm:w-auto h-9">
          Start interview
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
    </Card>
  </div>
);

export default MockInterviewView;
