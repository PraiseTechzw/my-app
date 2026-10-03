# FocusFlow

FocusFlow is a local-first habit tracker built with Expo, React Native, TypeScript, and Expo Router. It is designed around the supplied `design/image.png` reference: a calm green palette, compact progress cards, and simple daily check-ins.

## Run the app

```bash
npm ci
npx expo start
```

Open it in Expo Go, an iOS/Android simulator, or the web preview. The app targets Expo SDK 57.

## Screens and flows

- **Onboarding:** three illustrated introduction slides; completion is saved locally.
- **Home:** daily progress summary and one-tap habit check-ins.
- **Add/Edit Habit:** name, icon, numeric goal, unit, daily/weekly/custom schedule, and an optional preferred reminder time.
- **Habit Detail:** progress logging, undo, seven-day history, edit, and delete.
- **Statistics:** week/month/year completion summaries and habit ranking.
- **Calendar:** month navigation and per-date habit completion history.
- **Goals, Profile, Settings:** goal overview, editable local profile name, saved notification preference, privacy information, and an explicit local-data reset action.

## Data and limitations

Habit data, check-ins, onboarding state, and preferences use AsyncStorage on the device. There is **no remote backend, sign-in, cloud sync, or data recovery**. Uninstalling the app or clearing its local app data may erase saved information.

The reminder time is stored as a preference only; this version does not schedule operating-system notifications. The interface currently uses the light theme. Starter habits are included to make the dashboard usable on first launch.

## Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
npx expo export --platform web --output-dir /tmp/focusflow-export
```
