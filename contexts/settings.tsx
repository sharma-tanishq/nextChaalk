import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
  Context,
  useEffect,
} from "react";
import { Maybe, maybeRun } from "../utils";

export interface UserSettings {
  clientDeEscalation: number;
}

const initUserSettings: UserSettings = {
  clientDeEscalation: null,
};

const Context = createContext(null) as Context<Maybe<ProviderValue>>;

interface ProviderValue {
  settings: UserSettings;
  setSettings: (arg: UserSettings) => void;
}

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setter] = useState(initUserSettings);

  const setSettings = (settings: UserSettings) => {
    typeof window !== "undefined" &&
      localStorage.setItem("settings", JSON.stringify(settings));
    setter(settings);
  };

  useEffect(() => {
    const savedSettings = maybeRun(
      localStorage.getItem("settings"),
      JSON.parse
    );

    savedSettings && setSettings(savedSettings);
  }, []);

  return (
    <Context.Provider value={{ settings, setSettings }}>
      {children}
    </Context.Provider>
  );
};

export function useSettingsContext() {
  return useContext(Context);
}
