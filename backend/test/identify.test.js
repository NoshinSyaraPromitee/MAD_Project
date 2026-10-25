// No network or API key: Gemini is replaced by an injected fake fetch.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createGeminiProvider, parseIdentifyJson } = require('../services/aiProvider');

const reply = (obj) => async () => ({
  ok: true,
  status: 200,
  json: async () => ({ candidates: [{ content: { parts: [{ text: typeof obj === 'string' ? obj : JSON.stringify(obj) }] } }] }),
});

test('identify: returns the plant fields the create form expects', async () => {
  let sent;
  const fetchImpl = async (url, init) => { sent = JSON.parse(init.body); return reply({
    species: ' Rose (Rosa)', suggestedNickname: 'Rosie', location: 'Balcony', sunlight: 'Full sun',
    wateringFrequencyDays: 3, waterAmountMl: 400, health: 88, careTips: 'Prune in spring' })(); };
  const out = await createGeminiProvider({ apiKey: 'K', fetchImpl }).identify(Buffer.from('img'), 'image/jpeg');
  assert.deepEqual(out, {
    species: 'Rose (Rosa)', suggestedNickname: 'Rosie', location: 'Balcony', sunlight: 'Full sun',
    wateringFrequencyDays: 3, waterAmountMl: 400, health: 88, careTips: 'Prune in spring' });
  assert.equal(sent.contents[0].parts[1].inline_data.mime_type, 'image/jpeg');
  assert.ok(sent.contents[0].parts[0].text.includes('botanist'));
});

test('identify: model numbers are clamped or defaulted, never passed through raw', () => {
  const o = parseIdentifyJson(JSON.stringify({ species: 'Fern', wateringFrequencyDays: 9999, waterAmountMl: -5, health: 250 }));
  assert.equal(o.wateringFrequencyDays, 365);
  assert.equal(o.waterAmountMl, 1);
  assert.equal(o.health, 100);
  const d = parseIdentifyJson('{"species":"Fern","wateringFrequencyDays":"soon","waterAmountMl":null,"health":"great"}');
  assert.deepEqual([d.wateringFrequencyDays, d.waterAmountMl, d.health], [7, 250, 100]);
  assert.equal(parseIdentifyJson('```json\n{"species":"Fern"}\n```').species, 'Fern');
});

test('identify: unreadable or species-less answers are a 502, errors map like diagnosis', async () => {
  assert.throws(() => parseIdentifyJson('nope'), { status: 502 });
  assert.throws(() => parseIdentifyJson('{"species":"  "}'), { status: 502 });
  const call = (fetchImpl, apiKey = 'K') => createGeminiProvider({ apiKey, fetchImpl }).identify(Buffer.from('a'), 'image/png');
  await assert.rejects(call(reply('not json')), { status: 502 });
  await assert.rejects(call(async () => ({ ok: false, status: 429 })), { status: 429 });
  await assert.rejects(call(async () => ({ ok: false, status: 500 })), { status: 502 });
  await assert.rejects(call(reply({}), ''), { status: 503 });
});
