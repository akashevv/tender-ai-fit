import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Requirement = {
  id: number;
  title: string;
  description: string;
};

export type Tender = {
  id: number;
  name: string;
  mode: 'demo' | 'manual';
  requirements: Requirement[];
};

export type AnalysisResult = {
  requirementId: number;
  status: 'MET' | 'MISSING' | 'UNCLEAR';
  evidence?: string;
  explanation: string;
  source: string;
  reviewerNote?: string;
  reviewed?: boolean;
  reviewerOverride?: boolean;
};

type AppContextProps = {
  selectedTender?: Tender;
  setSelectedTender: (tender: Tender) => void;
  analysisResults?: AnalysisResult[];
  setAnalysisResults: (results: AnalysisResult[]) => void;
};

export const AppContext = createContext<AppContextProps>({
  selectedTender: undefined,
  analysisResults: undefined,
  setSelectedTender: () => {},
  setAnalysisResults: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTender, setSelectedTender] = useState<Tender | undefined>();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | undefined>();

  return (
    <AppContext.Provider value={{ selectedTender, setSelectedTender, analysisResults, setAnalysisResults }}>
      {children}
    </AppContext.Provider>
  );
};
