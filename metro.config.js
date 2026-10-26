const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Let Metro bundle Rive animation files (assets/animations/*.riv)
if (!config.resolver.assetExts.includes("riv")) {
  config.resolver.assetExts.push("riv");
}

module.exports = config;