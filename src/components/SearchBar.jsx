import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppTextField from "./AppTextField";
import { palette } from "../theme/colors";

/** Cream search field with a clear button. */
export default function SearchBar({ value, onChangeText, placeholder = "Search plants...", style }) {
  return (
    <AppTextField
      icon="magnify"
      radius={18}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      style={style}
      right={
        value ? (
          <Pressable onPress={() => onChangeText?.("")} hitSlop={10}>
            <MaterialCommunityIcons name="close-circle" size={20} color={palette.textMuted} />
          </Pressable>
        ) : null
      }
    />
  );
}