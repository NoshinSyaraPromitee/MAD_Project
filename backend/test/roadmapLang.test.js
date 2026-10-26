const test = require('node:test');
const assert = require('node:assert/strict');
const care = require('../services/plantCare');

test('roadmap: Bengali text only when lang is bn; numbers never change', () => {
  for (const stage of ['', 'seedling', 'adult']) {
    const en = care.buildRoadmap('Rose', stage);
    const bn = care.buildRoadmap('Rose', stage, 'bn');
    assert.notEqual(bn.tips, en.tips);
    assert.notEqual(bn.fertilizerRecommendation, en.fertilizerRecommendation);
    assert.match(bn.tips, /[\u0980-\u09FF]/);
    assert.deepEqual(
      [bn.waterAmountMl, bn.wateringTimes, bn.fertilizingIntervalDays],
      [en.waterAmountMl, en.wateringTimes, en.fertilizingIntervalDays]
    );
  }
  assert.deepEqual(care.buildRoadmap('Rose', 'adult', 'fr'), care.buildRoadmap('Rose', 'adult'));
});