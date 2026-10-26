import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import { Asset } from "expo-asset";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";

// Browser version (npx expo start --web). Metro picks this file on web.
// Same View Model properties as the native file:
//   mouthOpen (boolean), numState (number), trigState (trigger)

export const MASCOT_NAME = "Totoro";

const RIVE_FILE = require("../../assets/animations/totoro.riv");
const FALLBACK_GIF = require("../../assets/images/pot-character.gif");
const STATE_MACHINE = "State Machine 1";

export default function RiveMascot({ width = 160, height, style, onPress }) {
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const state = useRef({ mouthOpen: false, numState: 0 });
  const scale = useRef(new Animated.Value(1)).current;
  const [failed, setFailed] = useState(false);
  const h = height || width;

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    let r = null;
    try {
      r = new Rive({
        src: Asset.fromModule(RIVE_FILE).uri,
        canvas: canvasRef.current,
        autoplay: true,
        stateMachines: STATE_MACHINE,
        autoBind: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => r?.resizeDrawingSurfaceToCanvas(),
        onLoadError: () => setFailed(true),
      });
      riveRef.current = r;
    } catch (e) {
      console.warn("Rive web failed:", e?.message);
      setFailed(true);
    }

    const onResize = () => r?.resizeDrawingSurfaceToCanvas();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      r?.cleanup();
      riveRef.current = null;
    };
  }, []);

  const tap = () => {
    const vmi = riveRef.current?.viewModelInstance;
    if (vmi) {
      const s = state.current;
      s.mouthOpen = !s.mouthOpen;
      s.numState = (s.numState + 1) % 3;
      const b = vmi.boolean("mouthOpen");
      if (b) b.value = s.mouthOpen;
      const n = vmi.number("numState");
      if (n) n.value = s.numState;
      vmi.trigger("trigState")?.trigger();
    }

    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 90, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, friction: 3, tension: 160, useNativeDriver: false }),
    ]).start();
    onPress?.();
  };

  return (
    <Pressable onPress={tap} style={[{ width, height: h }, style]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        {failed ? (
          <Image source={FALLBACK_GIF} style={styles.fill} resizeMode="contain" />
        ) : (
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
});