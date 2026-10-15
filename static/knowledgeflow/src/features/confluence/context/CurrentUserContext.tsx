import { createContext, useContext, type ReactNode } from "react";
import type { CheckUser } from "../../../../../../src/shared/types";

type CurrentUserContextValue = {
  currentUser: CheckUser | null;
};

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(
  undefined,
);

type CurrentUserProviderProps = {
  currentUser: CheckUser | null;
  children: ReactNode;
};

export function CurrentUserProvider({
  currentUser,
  children,
}: CurrentUserProviderProps) {
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);

  if (context === undefined) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }

  return context;
}
