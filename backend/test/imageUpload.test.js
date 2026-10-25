// Real multipart requests against a tiny Express app - no database, no Cloudinary.
const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { imageUpload, detectImageType, MAX_IMAGE_BYTES } = require('../utils/imageUpload');

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64)]);
const WEBP = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), Buffer.alloc(64)]);

test('detects formats from the file signature, not the name', () => {
  assert.equal(detectImageType(PNG), 'image/png');
  assert.equal(detectImageType(JPEG), 'image/jpeg');
  assert.equal(detectImageType(WEBP), 'image/webp');
  assert.equal(detectImageType(Buffer.from('<?php echo 1; ?> not an image')), null);
  assert.equal(detectImageType(Buffer.from('RIFF....WAVE....')), null); // RIFF but not WebP
  assert.equal(detectImageType(Buffer.alloc(4)), null);
  assert.equal(detectImageType(null), null);
});

test('the cap is 8 MB, matching the Go backend', () => {
  assert.equal(MAX_IMAGE_BYTES, 8 * 1024 * 1024);
});

async function withServer(maxBytes, fn) {
  const app = express();
  app.post('/up', imageUpload('image', maxBytes), (req, res) =>
    res.json({ ok: true, type: req.file ? req.file.detectedType : null, size: req.file ? req.file.size : 0 })
  );
  // same shape as the JSON error handler in server.js
  app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message })); // eslint-disable-line
  const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
  try {
    await fn(`http://127.0.0.1:${server.address().port}/up`);
  } finally {
    server.close();
  }
}

async function post(url, { field = 'image', data, type, name = 'photo' }) {
  const fd = new FormData();
  if (data) fd.append(field, new Blob([data], { type }), name);
  const res = await fetch(url, { method: 'POST', body: fd });
  return { status: res.status, body: await res.json() };
}

test('accepts real JPEG, PNG and WebP files', async () => {
  await withServer(1024, async (url) => {
    for (const [data, type] of [[PNG, 'image/png'], [JPEG, 'image/jpeg'], [WEBP, 'image/webp']]) {
      const r = await post(url, { data, type });
      assert.deepEqual([r.status, r.body.type], [200, type]);
    }
  });
});

test('rejects a file over the limit with 413', async () => {
  await withServer(1024, async (url) => {
    const big = Buffer.concat([PNG, Buffer.alloc(5000)]);
    const r = await post(url, { data: big, type: 'image/png' });
    assert.equal(r.status, 413);
    assert.match(r.body.error, /too large/i);
  });
});

test('rejects a declared non-image type with 415', async () => {
  await withServer(1024, async (url) => {
    for (const type of ['text/plain', 'application/pdf', 'image/gif', 'image/svg+xml']) {
      const r = await post(url, { data: PNG, type });
      assert.equal(r.status, 415, type);
    }
  });
});

test('rejects a spoofed file: image/png header but not an image', async () => {
  await withServer(1024, async (url) => {
    const r = await post(url, { data: Buffer.from('this is just text pretending to be a png, 12+ bytes'), type: 'image/png', name: 'x.png' });
    assert.equal(r.status, 415);
    assert.match(r.body.error, /not a valid/i);
  });
});

test('rejects the wrong field name with 400, and passes through with no file', async () => {
  await withServer(1024, async (url) => {
    const wrong = await post(url, { field: 'photo', data: PNG, type: 'image/png' });
    assert.equal(wrong.status, 400);
    assert.match(wrong.body.error, /field named "image"/);
    const none = await post(url, {});
    assert.deepEqual([none.status, none.body.size], [200, 0]); // route handler decides what "no file" means
  });
});