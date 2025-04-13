import React, { createContext, useState, ReactNode, useContext } from "react";

interface NavBarContextProps {
  value: string;
  setValue: (newValue: string) => void;
}

const NavBarContext = createContext<NavBarContextProps | undefined>(undefined);

export const NavBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState("");

  return (
    <NavBarContext.Provider value={{ value, setValue }}>
      {children}
    </NavBarContext.Provider>
  );
};

export function useNavBar() {
  const context = useContext(NavBarContext);
  if (!context) {
    throw new Error("useNavBar must be used within a SnackbarProvider");
  }
  return context;
}
