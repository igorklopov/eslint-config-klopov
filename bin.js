#!/usr/bin/env node

const major1 = require('eslint/package.json').version.match(/(\d+)/)[1];
const major2 = require('./package.json').devDependencies.eslint.match(/[~^]?(\d+)/)[1];

if (major1 !== major2) {
  console.log('[eslint-config-klopov] eslint major version mismatch. the rules are outdated');
}

require('eslint/bin/eslint.js');
