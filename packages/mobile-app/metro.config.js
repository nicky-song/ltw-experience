// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const blacklist = require('metro-config/src/defaults/exclusionList');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// // 2. Let Metro know where to resolve packages and in what order
// config.resolver.nodeModulesPaths = [
//     path.resolve(projectRoot, 'node_modules'),
//     path.resolve(workspaceRoot, 'node_modules'),
// ];
//
// // 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
// config.resolver.disableHierarchicalLookup = true;

const {
    resolver: { sourceExts, assetExts },
} = getDefaultConfig(projectRoot);
config.transformer.babelTransformerPath = require.resolve(
    'react-native-svg-transformer',
);
config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];

// Exclude Amplify Backend
config.resolver.blacklistRE = blacklist([
    /amplify\/#current-cloud-backend\/.*/,
]);

module.exports = config;
