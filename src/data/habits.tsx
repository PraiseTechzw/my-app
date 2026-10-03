import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
  frequency: "Daily" | "Weekly" | "Custom";
  customDays?: number[];
  reminder?: string;
};
export type Completion = { habitId: string; date: string; count: number };
export type AppData = {
  onboardingComplete: boolean;
  habits: Habit[];
  completions: Completion[];
  appearance: "Light" | "Dark";
  notifications: boolean;
  profileName: string;
};
type NewHabit = Omit<Habit, "id">;
type HabitContextValue = {
  data: AppData;
  loaded: boolean;
  storageError: boolean;
  addHabit: (habit: NewHabit) => void;
  updateHabit: (habitId: string, updates: NewHabit) => void;
  deleteHabit: (habitId: string) => void;
  logHabit: (habitId: string, amount?: number) => void;
  setOnboardingComplete: () => void;
  setAppearance: (appearance: AppData["appearance"]) => void;
  setNotifications: (enabled: boolean) => void;
  setProfileName: (name: string) => void;
  resetLocalData: () => void;
  getCount: (habitId: string, date?: string) => number;
};

const STORAGE_KEY = "focusflow.app-data.v1";
const today = () => dateKey(new Date());
function shiftDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return dateKey(date);
}

const starterHabits: Habit[] = [
  {
    id: "water",
    name: "Drink 8 glasses of water",
    icon: "water-outline",
    color: "#DCEBFF",
    target: 8,
    unit: "glasses",
    frequency: "Daily",
  },
  {
    id: "reading",
    name: "Read for 20 minutes",
    icon: "book-open-page-variant-outline",
    color: "#EFE8FF",
    target: 20,
    unit: "minutes",
    frequency: "Daily",
  },
  {
    id: "workout",
    name: "Workout",
    icon: "dumbbell",
    color: "#E2F5EF",
    target: 1,
    unit: "session",
    frequency: "Daily",
  },
  {
    id: "learn",
    name: "Learn something new",
    icon: "school-outline",
    color: "#FFF1D8",
    target: 1,
    unit: "session",
    frequency: "Daily",
  },
  {
    id: "meditate",
    name: "Meditate for 10 minutes",
    icon: "meditation",
    color: "#FCE8E5",
    target: 10,
    unit: "minutes",
    frequency: "Daily",
  },
];

function makeInitialData(): AppData {
  return {
    onboardingComplete: false,
    habits: starterHabits,
    completions: [
      { habitId: "water", date: today(), count: 5 },
      { habitId: "reading", date: today(), count: 20 },
      { habitId: "water", date: shiftDate(-1), count: 8 },
      { habitId: "reading", date: shiftDate(-1), count: 20 },
      { habitId: "workout", date: shiftDate(-1), count: 1 },
    ],
    appearance: "Light",
    notifications: true,
    profileName: "Praise Masunga",
  };
}

function normalizeData(value: unknown): AppData {
  const defaults = makeInitialData();
  if (!value || typeof value !== "object") return defaults;
  const saved = value as Partial<AppData>;
  const habits = Array.isArray(saved.habits)
    ? saved.habits.filter(
        (item): item is Habit =>
          !!item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.icon === "string" &&
          typeof item.color === "string" &&
          Number.isFinite(item.target) &&
          item.target > 0 &&
          typeof item.unit === "string" &&
          ["Daily", "Weekly", "Custom"].includes(item.frequency),
      )
    : defaults.habits;
  const completions = Array.isArray(saved.completions)
    ? saved.completions.filter(
        (entry): entry is Completion =>
          !!entry &&
          typeof entry.habitId === "string" &&
          typeof entry.date === "string" &&
          Number.isFinite(entry.count) &&
          entry.count >= 0,
      )
    : saved.habits
      ? []
      : defaults.completions;
  return {
    ...defaults,
    ...saved,
    habits,
    completions,
    onboardingComplete: saved.onboardingComplete === true,
    appearance: saved.appearance === "Dark" ? "Dark" : "Light",
    notifications: saved.notifications !== false,
    profileName:
      typeof saved.profileName === "string" && saved.profileName.trim()
        ? saved.profileName.trim()
        : defaults.profileName,
  };
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<AppData>(makeInitialData);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (mounted && stored) {
          try {
            setData(normalizeData(JSON.parse(stored)));
          } catch {
            setStorageError(true);
          }
        }
      })
      .catch(() => {
        if (mounted) setStorageError(true);
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const serialized = JSON.stringify(data);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized))
      .then(() => setStorageError(false))
      .catch(() => setStorageError(true));
  }, [data, loaded]);

  const addHabit = useCallback((habit: NewHabit) => {
    setData((current) => ({
      ...current,
      habits: [{ ...habit, id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...current.habits],
    }));
  }, []);
  const updateHabit = useCallback((habitId: string, updates: NewHabit) => {
    setData((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === habitId ? { ...updates, id: habit.id } : habit,
      ),
    }));
  }, []);
  const deleteHabit = useCallback((habitId: string) => {
    setData((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== habitId),
      completions: current.completions.filter(
        (completion) => completion.habitId !== habitId,
      ),
    }));
  }, []);
  const logHabit = useCallback((habitId: string, amount = 1) => {
    setData((current) => {
      const habit = current.habits.find((item) => item.id === habitId);
      if (!habit || !Number.isFinite(amount) || amount === 0) return current;
      const date = today();
      const index = current.completions.findIndex(
        (entry) => entry.habitId === habitId && entry.date === date,
      );
      const existing = index >= 0 ? current.completions[index].count : 0;
      const count =
        habit.target === 1
          ? amount < 0 || existing >= 1
            ? 0
            : 1
          : Math.max(0, Math.min(habit.target, existing + amount));
      const completions = [...current.completions];
      if (index >= 0) completions[index] = { ...completions[index], count };
      else if (count > 0) completions.push({ habitId, date, count });
      return { ...current, completions };
    });
  }, []);
  const setOnboardingComplete = useCallback(() => {
    setData((current) => ({ ...current, onboardingComplete: true }));
  }, []);
  const setAppearance = useCallback((appearance: AppData["appearance"]) => {
    setData((current) => ({ ...current, appearance }));
  }, []);
  const setNotifications = useCallback((notifications: boolean) => {
    setData((current) => ({ ...current, notifications }));
  }, []);
  const setProfileName = useCallback((profileName: string) => {
    setData((current) => ({ ...current, profileName: profileName.trim() }));
  }, []);
  const resetLocalData = useCallback(() => setData(makeInitialData()), []);
  const getCount = useCallback(
    (habitId: string, date = today()) =>
      data.completions.find(
        (entry) => entry.habitId === habitId && entry.date === date,
      )?.count ?? 0,
    [data.completions],
  );

  const value = useMemo(
    () => ({
      data,
      loaded,
      storageError,
      addHabit,
      updateHabit,
      deleteHabit,
      logHabit,
      setOnboardingComplete,
      setAppearance,
      setNotifications,
      setProfileName,
      resetLocalData,
      getCount,
    }),
    [
      data,
      loaded,
      storageError,
      addHabit,
      updateHabit,
      deleteHabit,
      logHabit,
      setOnboardingComplete,
      setAppearance,
      setNotifications,
      setProfileName,
      resetLocalData,
      getCount,
    ],
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used inside HabitProvider");
  return context;
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
