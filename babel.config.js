// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': { targets: { node: 'v10.13.0' } }
});

const plugins = Object.entries({
	'@babel/plugin-transform-async-to-generator': { module: 'bluebird', method: 'coroutine' },
	'@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
