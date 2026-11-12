import { createContext, useContext } from 'react';
import type { AnalysisSession, CompanyProfile, EvaluationResult, Review, Tender } from '../domain/types';
import type { ScenarioId } from '../data/demoCompany';
import { demoCompany } from '../data/demoCompany';

export type AppState = {
  profile: CompanyProfile;
  /** false when localStorage cannot be used (boundary case E). */
  storageOk: boolean;
  /** Returns false if the profile could not be persisted. */
  saveProfile: (profile: CompanyProfile) => boolean;
  loadScenario: (id: ScenarioId) => void;
  resetDemo: () => void;
  deleteAllData: () => void;

  analysis?: AnalysisSession;
  /** Results are always recomputed from the current profile — never stored or hard-coded. */
  results: EvaluationResult[];
  startAnalysis: (tender: Tender) => void;
  updateReview: (requirementId: string, patch: Partial<Review>) => void;
  setReviewerConfirmed: (confirmed: boolean) => void;
};

export const AppContext = createContext<AppState>({
  profile: demoCompany,
  storageOk: true,
  saveProfile: () => false,
  loadScenario: () => {},
  resetDemo: () => {},
  deleteAllData: () => {},
  analysis: undefined,
  results: [],
  startAnalysis: () => {},
  updateReview: () => {},
  setReviewerConfirmed: () => {},
});

export function useApp() {
  return useContext(AppContext);
}
