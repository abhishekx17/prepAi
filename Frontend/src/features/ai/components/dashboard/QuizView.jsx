import React from 'react';
import { Play, ClipboardCheck } from 'lucide-react';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Input, Select, FieldLabel } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';

const QuizView = ({
  quizTopic,
  setQuizTopic,
  quizDifficulty,
  setQuizDifficulty,
  quizNumQuestions,
  setQuizNumQuestions,
  error,
  successMsg,
  onClear,
  onSubmit,
}) => (
  <div className="mx-auto max-w-4xl">
    <Card className="p-5 sm:p-6">
      <CardHeader
        icon={ClipboardCheck}
        title="Skill Quiz"
        description="Enter a technical topic and configure difficulty and question count. AI generates multiple-choice questions with detailed explanations."
        action={
          <Button variant="secondary" size="sm" onClick={onClear}>
            Reset
          </Button>
        }
      />

    {(error || successMsg) && (
      <div className="mt-5">
        <Alert type={error ? 'error' : 'success'}>{error || successMsg}</Alert>
      </div>
    )}

    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <div>
        <FieldLabel htmlFor="quizTopic">Technical topic</FieldLabel>
        <Input
          id="quizTopic"
          value={quizTopic}
          onChange={(e) => setQuizTopic(e.target.value)}
          placeholder="React Hooks, Database Indexing, JavaScript Closures"
          required
        />
      </div>

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-zinc-950/35 p-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="quizDifficulty">Difficulty</FieldLabel>
          <Select
            id="quizDifficulty"
            value={quizDifficulty}
            onChange={(e) => setQuizDifficulty(e.target.value)}
          >
            <option value="Low">Beginner</option>
            <option value="Mid">Intermediate</option>
            <option value="High">Advanced</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="quizNumQuestions">Question count</FieldLabel>
          <Select
            id="quizNumQuestions"
            value={quizNumQuestions}
            onChange={(e) => setQuizNumQuestions(parseInt(e.target.value))}
          >
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between select-none">
        <p className="text-xs text-zinc-500 font-medium max-w-md">
          Assess your level. Each question comes with structured grading and a detailed explanation of correct answers.
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Play className="h-4 w-4 text-zinc-950 shrink-0" strokeWidth={1.5} />
          Launch quiz
        </Button>
      </div>
    </form>
    </Card>
  </div>
);

export default QuizView;
