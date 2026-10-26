import React, { Component, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, UIManager, View } from "react-native";
import Constants from "expo-constants";
import { Asset } from "expo-asset";

// totoro.riv uses Rive data binding (View Model "ViewModel"):
//   mouthOpen (boolean), numState (number), trigState (trigger)
// Tapping the mascot toggles the mouth, steps numState 0 -> 1 -> 2 and
// fires trigState.
//
// - Dev build (npx expo run:android): native rive-react-native.
// - Expo Go: Rive's web player inside a WebView (no native module needed).
// - Browser: see RiveMascot.web.jsx.

export const MASCOT_NAME = "Totoro";

const RIVE_FILE = require("../../assets/animations/totoro.riv");
const FALLBACK_GIF = require("../../assets/images/pot-character.gif");
const STATE_MACHINE = "State Machine 1";
const RIVE_WEB_RUNTIME = "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.45.1/rive.js";

const IN_EXPO_GO =
  Constants.executionEnvironment === "storeClient" || Constants.appOwnership === "expo";

// The JS package can load even when the native view is missing (Expo Go),
// so also check that the native view is really registered.
function hasNativeRiveView() {
  try {
    return !!UIManager.hasViewManagerConfig?.("RiveReactNativeView");
  } catch (e) {
    return false;
  }
}

let NativeRive = null;
let RiveFit = null;
let RiveAlignment = null;
let AutoBind = null;
if (!IN_EXPO_GO && hasNativeRiveView()) {
  try {
    const lib = require("rive-react-native");
    NativeRive = lib.default;
    RiveFit = lib.Fit;
    RiveAlignment = lib.Alignment;
    AutoBind = lib.AutoBind;
  } catch (e) {
    NativeRive = null;
  }
}

let WebView = null;
try {
  WebView = require("react-native-webview").WebView;
} catch (e) {
  WebView = null;
}

class RiveBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("Native Rive unavailable, using web player:", error?.message);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Small HTML page that plays the .riv with Rive's canvas runtime and
// handles taps itself (the WebView swallows touches).
function buildHtml(src) {
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
  canvas { width: 100%; height: 100%; display: block; touch-action: manipulation; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script src="${RIVE_WEB_RUNTIME}"></script>
<script>
(function () {
  function post(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
  }
  if (!window.rive) { post("error"); return; }

  var canvas = document.getElementById("c");
  var mouthOpen = false;
  var numState = 0;

  var r = new rive.Rive({
    src: ${JSON.stringify(src)},
    canvas: canvas,
    autoplay: true,
    stateMachines: ${JSON.stringify(STATE_MACHINE)},
    autoBind: true,
    layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
    onLoad: function () {
      r.resizeDrawingSurfaceToCanvas();
      post("ready");
    },
    onLoadError: function () { post("error"); }
  });

  window.addEventListener("resize", function () { r.resizeDrawingSurfaceToCanvas(); });

  canvas.addEventListener("click", function () {
    var vmi = r.viewModelInstance;
    if (vmi) {
      mouthOpen = !mouthOpen;
      numState = (numState + 1) % 3;
      var b = vmi.boolean("mouthOpen"); if (b) b.value = mouthOpen;
      var n = vmi.number("numState"); if (n) n.value = numState;
      var t = vmi.trigger("trigState"); if (t) t.trigger();
    }
    post("tap");
  });
})();
</script>
</body>
</html>`;
}

/** The totoro.riv mascot. Tap it to make it react. */
export default function RiveMascot({ width = 160, height, style, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const riveRef = useRef(null);
  const state = useRef({ mouthOpen: false, numState: 0 });
  const [webFailed, setWebFailed] = useState(false);
  const [nativeFailed, setNativeFailed] = useState(false);
  const h = height || width;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, tension: 160, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };

  // Native runtime: drive the View Model properties.
  const tapNative = () => {
    const r = riveRef.current;
    if (r) {
      const s = state.current;
      s.mouthOpen = !s.mouthOpen;
      s.numState = (s.numState + 1) % 3;
      try {
        r.setBoolean("mouthOpen", s.mouthOpen);
        r.setNumber("numState", s.numState);
        r.trigger("trigState");
      } catch (e) {
        console.warn("Rive input failed:", e?.message);
      }
    }
    bounce();
  };

  // Asset URL served by Metro (http://<your-ip>:8081/assets/... in Expo Go)
  const webSource = useMemo(() => {
    if (!WebView) return null;
    const uri = Asset.fromModule(RIVE_FILE).uri;
    const origin = (uri.match(/^https?:\/\/[^/]+/) || [])[0];
    return { html: buildHtml(uri), baseUrl: origin || undefined };
  }, []);

  const fallback = <Image source={FALLBACK_GIF} style={styles.fill} resizeMode="contain" />;

  // 1) Dev build with the native Rive module
  if (NativeRive && !nativeFailed) {
    return (
      <Pressable onPress={tapNative} style={[{ width, height: h }, style]}>
        <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
          <RiveBoundary fallback={fallback} onFail={() => setNativeFailed(true)}>
            <NativeRive
              ref={riveRef}
              source={RIVE_FILE}
              stateMachineName={STATE_MACHINE}
              dataBinding={AutoBind ? AutoBind(true) : undefined}
              fit={RiveFit?.Contain}
              alignment={RiveAlignment?.Center}
              autoplay
              style={styles.fill}
              onError={(err) => console.warn("Rive error:", err?.message)}
            />
          </RiveBoundary>
        </Animated.View>
      </Pressable>
    );
  }

  // 2) Expo Go (or native failed): Rive web player in a WebView
  if (webSource && !webFailed) {
    return (
      <Animated.View style={[{ width, height: h, transform: [{ scale }] }, style]}>
        <View style={styles.fill}>
          <WebView
            originWhitelist={["*"]}
            source={webSource}
            style={styles.web}
            containerStyle={styles.web}
            javaScriptEnabled
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            setSupportMultipleWindows={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            androidLayerType="hardware"
            mixedContentMode="always"
            onMessage={(e) => {
              const msg = e.nativeEvent.data;
              if (msg === "tap") bounce();
              if (msg === "error") setWebFailed(true);
            }}
            onError={() => setWebFailed(true)}
          />
        </View>
      </Animated.View>
    );
  }

  // 3) Anything else: the GIF
  return (
    <Pressable onPress={bounce} style={[{ width, height: h }, style]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>{fallback}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  web: { flex: 1, backgroundColor: "transparent" },
});