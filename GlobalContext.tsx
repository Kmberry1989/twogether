import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Partner {
  name: string;
  avatarUri: string | null;
}

export interface Couple {
  partnerA: Partner;
  partnerB: Partner;
  coupleId: string;
}

export interface Session {
  sessionId: string;
  activityId: string;
  turn: 'A' | 'B';
  response: any;
  mediaUrls: string[];
  timestamp?: number;
  data?: any;
}

interface GlobalContextType {
  couple: Couple | null;
  setCouple: (c: Couple | null) => void;
  session: Session | null;
  setSession: (s: Session | null) => void;
  history: Session[];
  addSession: (s: Session) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [couple, setCouple] = useState<Couple | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<Session[]>([]);

  const addSession = (s: Session) => setHistory((h) => [...h, s]);

  return (
    <GlobalContext.Provider value={{ couple, setCouple, session, setSession, history, addSession }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobal must be used within a GlobalProvider');
  return ctx;
};

export { GlobalContext };
