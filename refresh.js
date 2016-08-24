#!/usr/bin/env node

'use strict';

const fs = require('fs');
const assert = require('assert');
const standard = require('eslint-config-standard');
const stringify = require('json-stable-stringify');
const override = require('./override.json');
const defaults = require('eslint').linter.defaults();

fs.writeFileSync('override.json',
  stringify(override, { space: 2 }) + '\n'
);

const rulesList = Object.keys(defaults.rules);
const overrideList = Object.keys(override);

for (const o of overrideList) {
  assert(rulesList.indexOf(o) >= 0,
    o + ' not found in rulesList');
}

const newRules = {};

for (const r of rulesList) {
  const o = override[r];
  let s = standard.rules[r];
  if (s === 0 || s === 'off')
    assert(false, 'Disabled rule in "standard" not expected');
  if (o === 'off' && s) console.log(
    `WARN: Standard is not expected to be stricter: ${r}`);
  newRules[r] = o || s || 'error';
}

standard.rules = newRules;
standard.plugins = [];

fs.writeFileSync('eslintrc.json',
  stringify(standard, { space: 2 }) + '\n'
);
