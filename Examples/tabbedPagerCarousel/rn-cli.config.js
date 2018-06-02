const path = require('path');
const blacklist = require('metro/src/blacklist');
const pak = require('../../package.json');

const libDependencies = Object.keys(pak.dependencies)
const libPeerDependencies = Object.keys(pak.peerDependencies)

module.exports = {
    extraNodeModules: {
    
    },
    getBlacklistRE: () => blacklist([
        new RegExp(
        `^${escape(path.resolve(__dirname, '..', '..', 'node_modules'))}\\/.*$`
        ),
    ]),
    getProvidesModuleNodeModules() {
        return [...libDependencies, ...libPeerDependencies];
    },
    getProjectRoots() {
        return [__dirname, path.resolve(__dirname, '../..')];
    },
};