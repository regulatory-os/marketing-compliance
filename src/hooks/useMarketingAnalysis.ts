import { useState, useCallback } from 'react';
import type { AnalysisResult, Qualification, WorkflowState } from '@/types';
import { simulateQualification, simulateAnalysis } from '@/utils';
import { MIN_CONTENT_CHARS } from '@/utils/constants';

interface UseMarketingAnalysisReturn {
  content: string;
  setContent: (content: string) => void;
  workflowState: WorkflowState;
  setWorkflowState: (state: WorkflowState) => void;
  qualification: Qualification | null;
  setQualification: (q: Qualification | null) => void;
  result: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
  qualify: () => Promise<void>;
  analyze: () => Promise<void>;
  reset: () => void;
}

export function useMarketingAnalysis(): UseMarketingAnalysisReturn {
  const [content, setContent] = useState('');
  const [workflowState, setWorkflowState] = useState<WorkflowState>('upload');
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const qualify = useCallback(async () => {
    if (content.length < MIN_CONTENT_CHARS) {
      setError(`Le contenu doit contenir au moins ${MIN_CONTENT_CHARS} caractères`);
      return;
    }

    setError(null);
    setIsLoading(true);
    setWorkflowState('qualifying');

    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const qual = simulateQualification(content);
      setQualification(qual);
      setWorkflowState('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la qualification');
      setWorkflowState('upload');
    } finally {
      setIsLoading(false);
    }
  }, [content]);

  const analyze = useCallback(async () => {
    if (!qualification) {
      setError('Qualification requise avant analyse');
      return;
    }

    setError(null);
    setIsLoading(true);
    setWorkflowState('analyzing');

    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const analysisResult = simulateAnalysis(content, qualification);
      setResult(analysisResult);
      setWorkflowState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'analyse");
      setWorkflowState('review');
    } finally {
      setIsLoading(false);
    }
  }, [content, qualification]);

  const reset = useCallback(() => {
    setContent('');
    setWorkflowState('upload');
    setQualification(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    content,
    setContent,
    workflowState,
    setWorkflowState,
    qualification,
    setQualification,
    result,
    error,
    isLoading,
    qualify,
    analyze,
    reset,
  };
}
