import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
  frequency: "Daily" | "Weekly" | "Custom";
  reminder?: string;
};
export type Completion = { habitId: string; date: string; count: number };
export type AppData = {
  onboardingComplete: boolean;
  habits: Habit[];
  completions: Completion[];
  appearance: "Light" | "Dark";
  notifications: boolean;
};
type NewHabit = Omit<Habit, "id">;
type HabitContextValue = {
  data: AppData;
  loaded: boolean;
  addHabit: (habit: NewHabit) => void;
  logHabit: (habitId: string, amount?: number) => void;
  setOnboardingComplete: () => void;
  setAppearance: (appearance: AppData["appearance"]) => void;
  setNotifications: (enabled: boolean) => void;
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

const initialData: AppData = {
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
};

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<AppData>(initialData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!mounted) return;
        if (stored)
          setData({
            ...initialData,
            ...(JSON.parse(stored) as Partial<AppData>),
          });
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loaded)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(
        () => undefined,
      );
  }, [data, loaded]);

  const update = (transform: (current: AppData) => AppData) =>
    setData((current) => transform(current));
  const addHabit = (habit: NewHabit) =>
    update((current) => ({
      ...current,
      habits: [{ ...habit, id: `habit-${Date.now()}` }, ...current.habits],
    }));
  const logHabit = (habitId: string, amount = 1) =>
    update((current) => {
      const date = today();
      const habit = current.habits.find((item) => item.id === habitId);
      if (!habit) return current;
      const completions = [...current.completions];
      const index = completions.findIndex(
        (entry) => entry.habitId === habitId && entry.date === date,
      );
      const existing = index >= 0 ? completions[index].count : 0;
      const count =
        habit.target === 1
          ? existing >= 1
            ? 0
            : 1
          : Math.min(habit.target, existing + amount);
      if (index >= 0) completions[index] = { ...completions[index], count };
      else completions.push({ habitId, date, count });
      return { ...current, completions };
    });
  const setOnboardingComplete = () =>
    update((current) => ({ ...current, onboardingComplete: true }));
  const setAppearance = (appearance: AppData["appearance"]) =>
    update((current) => ({ ...current, appearance }));
  const setNotifications = (notifications: boolean) =>
    update((current) => ({ ...current, notifications }));
  const getCount = (habitId: string, date = today()) =>
    data.completions.find(
      (entry) => entry.habitId === habitId && entry.date === date,
    )?.count ?? 0;

  return (
    <HabitContext.Provider
      value={{
        data,
        loaded,
        addHabit,
        logHabit,
        setOnboardingComplete,
        setAppearance,
        setNotifications,
        getCount,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used inside HabitProvider");
  return context;
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
