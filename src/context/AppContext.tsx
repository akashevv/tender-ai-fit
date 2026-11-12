import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './appState';
import type { AnalysisSession, CompanyProfile, Review, Tender } from '../domain/types';
import { buildScenario, demoCompany } from '../data/demoCompany';
import type { ScenarioId } from '../data/demoCompany';
import { evaluateTender } from '../domain/evaluate';
import { isAnalysisSession, isCompanyProfile } from '../domain/validation';
import { todayIso } from '../lib/dates';
import { STORAGE_KEYS, clearAllAppData, isStorageAvailable, readJson, removeKey, writeJson } from '../lib/storage';

export function AppProvider({ children }: { children: ReactNode }) {
  const [storageOk] = useState(isStorageAvailable);
  const [profile, setProfile] = useState<CompanyProfile>(
    () => readJson(STORAGE_KEYS.profile, isCompanyProfile) ?? structuredClone(demoCompany),
  );
  const [analysis, setAnalysis] = useState<AnalysisSession | undefined>(
    () => readJson(STORAGE_KEYS.analysis, isAnalysisSession) ?? undefined,
  );

  const persistAnalysis = useCallback((next: AnalysisSession | undefined) => {
    setAnalysis(next);
    if (next) writeJson(STORAGE_KEYS.analysis, next);
    else removeKey(STORAGE_KEYS.analysis);
  }, []);

  const saveProfile = useCallback((next: CompanyProfile) => {
    setProfile(next);
    return writeJson(STORAGE_KEYS.profile, next);
  }, []);

  const loadScenario = useCallback(
    (id: ScenarioId) => {
      saveProfile(buildScenario(id));
      persistAnalysis(undefined);
    },
    [saveProfile, persistAnalysis],
  );

  const resetDemo = useCallback(() => loadScenario('original'), [loadScenario]);

  const deleteAllData = useCallback(() => {
    clearAllAppData();
    setProfile(structuredClone(demoCompany));
    setAnalysis(undefined);
  }, []);

  const startAnalysis = useCallback(
    (tender: Tender) => {
      persistAnalysis({ tender, asOf: todayIso(), startedAt: new Date().toISOString(), reviews: {} });
    },
    [persistAnalysis],
  );

  const updateReview = useCallback(
    (requirementId: string, patch: Partial<Review>) => {
      if (!analysis) return;
      const current: Review = analysis.reviews[requirementId] ?? { note: '', reviewed: false };
      const merged: Review = { ...current, ...patch };
      // Any change to a review withdraws an earlier overall confirmation.
      persistAnalysis({ ...analysis, reviews: { ...analysis.reviews, [requirementId]: merged }, reviewerConfirmedAt: undefined });
    },
    [analysis, persistAnalysis],
  );

  const setReviewerConfirmed = useCallback(
    (confirmed: boolean) => {
      if (!analysis) return;
      persistAnalysis({ ...analysis, reviewerConfirmedAt: confirmed ? new Date().toISOString() : undefined });
    },
    [analysis, persistAnalysis],
  );

  const results = useMemo(
    () => (analysis ? evaluateTender(analysis.tender, profile, analysis.asOf) : []),
    [analysis, profile],
  );

  const value = useMemo(
    () => ({
      profile,
      storageOk,
      saveProfile,
      loadScenario,
      resetDemo,
      deleteAllData,
      analysis,
      results,
      startAnalysis,
      updateReview,
      setReviewerConfirmed,
    }),
    [profile, storageOk, saveProfile, loadScenario, resetDemo, deleteAllData, analysis, results, startAnalysis, updateReview, setReviewerConfirmed],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
