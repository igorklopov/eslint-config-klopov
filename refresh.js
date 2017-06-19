#!/usr/bin/env node

'use strict';

const fs = require('fs');
const assert = require('assert');
const standard = require('eslint-config-standard');
const stringify = require('json-stable-stringify');
const override = require('./override.json');
const defaults = require('eslint/conf/eslint-recommended.js');

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
  if (Array.isArray(s)) s = s[0];
  if (s && s !== 'error')
    assert(false, `Standard is not expected to have ${r}=${s}`);
  if (s && o === 'off') console.log(
    `WARN: Standard is not expected to be stricter: ${r}=${s}`);
  newRules[r] = o || s || 'error';
}

standard.rules = newRules;
standard.plugins = [];

fs.writeFileSync('eslintrc.json',
  stringify(standard, { space: 2 }) + '\n'
);
