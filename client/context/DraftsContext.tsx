import React, { createContext, useContext, useState } from 'react';

export interface Draft {
  id: string;
  taskId: string;
  title: string;
  description: string;
  coverImage?: File | string;
  lastUpdated: Date;
}

interface DraftsContextType {
  drafts: Draft[];
  saveDraft: (draft: Omit<Draft, 'id' | 'lastUpdated'>) => void;
  getDraftByTaskId: (taskId: string) => Draft | undefined;
  updateDraft: (draftId: string, draft: Partial<Draft>) => void;
}

const DraftsContext = createContext<DraftsContextType | undefined>(undefined);

export function DraftsProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const saveDraft = (draft: Omit<Draft, 'id' | 'lastUpdated'>) => {
    setDrafts(prevDrafts => {
      const existingDraftIndex = prevDrafts.findIndex(d => d.taskId === draft.taskId);
      const newDraft = {
        ...draft,
        id: existingDraftIndex >= 0 ? prevDrafts[existingDraftIndex].id : crypto.randomUUID(),
        lastUpdated: new Date()
      };

      if (existingDraftIndex >= 0) {
        const updatedDrafts = [...prevDrafts];
        updatedDrafts[existingDraftIndex] = newDraft;
        return updatedDrafts;
      }

      return [...prevDrafts, newDraft];
    });
  };

  const getDraftByTaskId = (taskId: string) => {
    return drafts.find(draft => draft.taskId === taskId);
  };

  const updateDraft = (draftId: string, updates: Partial<Draft>) => {
    setDrafts(prevDrafts => 
      prevDrafts.map(draft => 
        draft.id === draftId 
          ? { ...draft, ...updates, lastUpdated: new Date() }
          : draft
      )
    );
  };

  return (
    <DraftsContext.Provider value={{ drafts, saveDraft, getDraftByTaskId, updateDraft }}>
      {children}
    </DraftsContext.Provider>
  );
}

export function useDrafts() {
  const context = useContext(DraftsContext);
  if (context === undefined) {
    throw new Error('useDrafts must be used within a DraftsProvider');
  }
  return context;
}
