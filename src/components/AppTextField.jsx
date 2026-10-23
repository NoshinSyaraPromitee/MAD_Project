import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

/** Cream input with a teal icon and a teal focus ring. */
export default function AppTextField({
  icon,
  right,
  style,
  inputStyle,
  multiline = false,
  onFocus,
  onBlur,
  radius = 15,
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.box,
        { borderRadius: radius },
        multiline && styles.multiBox,
        focused && styles.focused,
        style,
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={palette.accent}
          style={multiline ? styles.multiIcon : null}
        />
      ) : null}

      <TextInput
        placeholderTextColor={palette.textMuted}
        cursorColor={palette.accent}
        selectionColor={palette.tealLight}
        multiline={multiline}
        style={[
          styles.input,
          icon ? styles.withIcon : null,
          multiline && styles.multiInput,
          inputStyle,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />

      {right}
    </View>
  );
}

const styles = themed(() => ({
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.edge,
    paddingHorizontal: 14,
    minHeight: 54,
    marginBottom: 14,
    ...shadow(2),
  },
  focused: { borderColor: palette.accent, borderWidth: 2.5 },
  multiBox: { alignItems: "flex-start", minHeight: 100 },
  multiIcon: { marginTop: 14 },
  input: {
    flex: 1,
    paddingVertical: 12,
    ...inter(15, "600", palette.textDark),
  },
  withIcon: { marginLeft: 10 },
  multiInput: { textAlignVertical: "top", minHeight: 90 },
}));