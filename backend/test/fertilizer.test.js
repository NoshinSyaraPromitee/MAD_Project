const test = require('node:test');
const assert = require('node:assert');
const Fertilizer = require('../model/fertilizer');
const seed = require('../data/fertilizers.json');

test('seed has 3 recipes with Bangla text', () => {
  assert.strictEqual(seed.length, 3);
  for (const f of seed) assert.ok(f.nameBn && f.instructionsBn);
});

test('localized() swaps to Bangla and hides *Bn fields', () => {
  const f = new Fertilizer(seed[0]);
  const bn = f.localized('bn');
  assert.strictEqual(bn.name, seed[0].nameBn);
  assert.strictEqual(bn.nameBn, undefined);
  assert.strictEqual(f.localized('en').name, seed[0].name);
});

test('localized() falls back to English without a translation', () => {
  const f = new Fertilizer({ _id: 'x', name: 'A', instructions: 'B' });
  assert.strictEqual(f.localized('bn').name, 'A');
});
