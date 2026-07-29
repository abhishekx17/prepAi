import React from 'react';
import { Trash2, Upload, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { FieldLabel } from '../../../../components/ui/Input';
import { LoadingDots } from '../../../../components/ui/AnimatedLoader';

const ResumeUpload = ({
  resume,
  fileName,
  fileSize,
  uploadingFile,
  isDragOver,
  onClear,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
}) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <FieldLabel htmlFor="resumeUpload">Resume</FieldLabel>
      {resume && !uploadingFile && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] font-bold text-zinc-550 hover:text-red-400 transition-colors cursor-pointer select-none"
        >
          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
          Remove
        </button>
      )}
    </div>

    <input id="resumeUpload" type="file" accept=".pdf,.txt" onChange={onFileSelect} className="hidden" />

    {uploadingFile ? (
      <div className="flex h-12 items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-zinc-950/40 p-2 select-none">
        <LoadingDots />
        <span className="text-[10px] font-bold text-zinc-400">Extracting text...</span>
      </div>
    ) : resume ? (
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-emerald-200/20 bg-emerald-200/[0.06] p-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-950/60 text-emerald-200 border border-emerald-200/20">
            <Paperclip className="h-3.5 w-3.5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-zinc-200">{fileName || 'Resume loaded'}</p>
            <p className="text-[9px] text-zinc-550 font-medium leading-none mt-0.5">{fileSize || 'Ready'}</p>
          </div>
        </div>
      </motion.div>
    ) : (
      <motion.button
        whileHover={{ scale: 1.002, borderColor: '#3f3f46' }}
        whileTap={{ scale: 0.998 }}
        type="button"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('resumeUpload').click()}
        className={`flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-cyan-200/50 bg-cyan-200/10'
            : 'border-white/12 bg-zinc-950/20 hover:border-white/20 hover:bg-white/[0.04]'
        }`}
      >
        <Upload className="h-4 w-4 text-cyan-200/80" strokeWidth={1.5} />
        <span className="text-xs font-bold text-zinc-300">Drop resume or browse (PDF/TXT)</span>
      </motion.button>
    )}
  </div>
);

export default ResumeUpload;
