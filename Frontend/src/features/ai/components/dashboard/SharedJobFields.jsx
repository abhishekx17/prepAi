import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { Input, Textarea, FieldLabel } from '../../../../components/ui/Input';

const SharedJobFields = ({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  selfDescription,
  setSelfDescription,
  renderResumeUpload,
}) => (
  <div className="grid gap-4 lg:grid-cols-2">
    <div>
      <FieldLabel htmlFor="jobTitle">Target job title</FieldLabel>
      <Input
        id="jobTitle"
        icon={BriefcaseBusiness}
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Senior Full Stack Engineer"
        required
      />
    </div>
    <div>
      <FieldLabel htmlFor="selfDescription" optional>Profile notes</FieldLabel>
      <Input
        id="selfDescription"
        value={selfDescription}
        onChange={(e) => setSelfDescription(e.target.value)}
        placeholder="React, Node, cloud, leadership"
      />
    </div>
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-950/35 p-4">
      <div className="flex items-center justify-between mb-1.5 select-none">
        <FieldLabel htmlFor="jobDescription">Job description</FieldLabel>
        <span className="text-[9px] font-bold font-mono text-zinc-600">
          {jobDescription.length} / 5000
        </span>
      </div>
      <Textarea
        id="jobDescription"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        maxLength={5000}
        rows={4}
        placeholder="Paste role responsibilities, requirements, tech stack, and interview expectations."
        required
      />
    </div>
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-950/35 p-4">{renderResumeUpload()}</div>
  </div>
);

export default SharedJobFields;
