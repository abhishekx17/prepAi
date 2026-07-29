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
          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 hover:text-red-500 transition-colors cursor-pointer select-none"
        >
          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
          Remove
        </button>
      )}
    </div>

    <input id="resumeUpload" type="file" accept=".pdf,.txt" onChange={onFileSelect} className="hidden" />

    {uploadingFile ? (
      <div className="flex h-12 items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/40 p-2 select-none">
        <LoadingDots />
        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">Extracting text...</span>
      </div>
    ) : resume ? (
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-emerald-200 dark:border-emerald-200/20 bg-emerald-50 dark:bg-emerald-200/[0.06] p-3 flex items-center justify-between shadow-sm dark:shadow-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-zinc-950/60 text-emerald-700 dark:text-emerald-200 border border-emerald-200">
            <Paperclip className="h-3.5 w-3.5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-zinc-200">{fileName || 'Resume loaded'}</p>
            <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium leading-none mt-0.5">{fileSize || 'Ready'}</p>
          </div>
        </div>
      </motion.div>
    ) : (
      <motion.button
        whileHover={{ scale: 1.002, borderColor: '#0284c7' }}
        whileTap={{ scale: 0.998 }}
        type="button"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('resumeUpload').click()}
        className={`flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-sky-500 bg-sky-50 dark:border-sky-800/50 dark:bg-sky-950/20'
            : 'border-slate-200 dark:border-white/12 bg-white dark:bg-zinc-950/20 hover:border-slate-350 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
        }`}
      >
        <Upload className="h-4 w-4 text-sky-600 dark:text-sky-400" strokeWidth={1.5} />
        <span className="text-xs font-bold text-slate-600 dark:text-zinc-300">Drop resume or browse (PDF/TXT)</span>
      </motion.button>
    )}
  </div>
);

export default ResumeUpload;
