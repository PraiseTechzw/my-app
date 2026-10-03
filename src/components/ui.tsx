import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, radius, spacing } from "../theme";

export function Page({
  children,
  scroll = true,
  style,
}: React.PropsWithChildren<{
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  const content = <View style={[styles.pageContent, style]}>{children}</View>;
  return scroll ? (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    <View style={[styles.page, styles.scrollContent]}>{content}</View>
  );
}
export function Heading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.heading}>
      <View style={styles.headingText}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
export function Card({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "text";
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.buttonOutline,
        variant === "text" && styles.buttonText,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant !== "primary" && styles.buttonLabelAlt,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  color = colors.ink,
  size = 22,
  background,
}: {
  name: string;
  onPress: () => void;
  color?: string;
  size?: number;
  background?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name.replaceAll("-", " ")}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        background ? { backgroundColor: background } : null,
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        name={name as keyof typeof MaterialCommunityIcons.glyphMap}
        size={size}
        color={color}
      />
    </Pressable>
  );
}
export function AppInput({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.faint}
        style={styles.input}
        {...props}
      />
    </View>
  );
}
export function ProgressRing({
  value,
  total,
  size = 92,
  color = colors.green,
  label,
}: {
  value: number;
  total: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const strokeWidth = 8;
  const radiusValue = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusValue;
  const progress = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusValue}
          stroke="#E4ECEB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusValue}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          fill="none"
        />
      </Svg>
      <Text style={styles.ringValue}>
        {value}/{total}
      </Text>
      {label ? <Text style={styles.ringLabel}>{label}</Text> : null}
    </View>
  );
}
export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
export function Pill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, selected && styles.pillSelected]}
    >
      <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function RowItem({
  icon,
  title,
  value,
  onPress,
  trailing,
}: {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
    >
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={18}
          color={colors.ink}
        />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {trailing ?? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={colors.faint}
        />
      )}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1 },
  pageContent: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 34,
    gap: spacing.md,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: 2,
  },
  headingText: { flex: 1, gap: 4 },
  title: { color: colors.ink, fontSize: 23, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.medium,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#EDF1F0",
  },
  button: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.green,
  },
  buttonText: { minHeight: 38, backgroundColor: "transparent" },
  buttonLabel: { color: colors.white, fontSize: 14, fontWeight: "700" },
  buttonLabelAlt: { color: colors.green, fontWeight: "700" },
  pressed: { opacity: 0.76 },
  disabled: { opacity: 0.45 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: { gap: 8 },
  inputLabel: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  input: {
    minHeight: 48,
    borderColor: colors.line,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 13,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 14,
  },
  ringValue: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  ringLabel: { color: colors.muted, fontSize: 9, marginTop: 1 },
  sectionTitleRow: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  sectionAction: { color: colors.green, fontSize: 11, fontWeight: "700" },
  pill: {
    minHeight: 34,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  pillSelected: { backgroundColor: colors.green, borderColor: colors.green },
  pillLabel: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  pillLabelSelected: { color: colors.white },
  rowItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F2F6F5",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { flex: 1, color: colors.ink, fontSize: 12, fontWeight: "600" },
  rowValue: { color: colors.muted, fontSize: 10 },
});
