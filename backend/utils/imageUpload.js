
const multer = require('multer');

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // same cap as the Go backend
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const httpError = (status, message) => Object.assign(new Error(message), { status });

// Looks at the file signature, not the filename or declared type.
function detectImageType(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}


function imageUpload(fieldName = 'image', maxBytes = MAX_IMAGE_BYTES) {
  const single = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 5 },
    fileFilter(req, file, cb) {
      if (!ALLOWED_TYPES.has(file.mimetype)) return cb(httpError(415, 'Only JPEG, PNG or WebP images are allowed'));
      cb(null, true);
    },
  }).single(fieldName);

  return (req, res, next) =>
    single(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(httpError(413, `Image is too large (max ${Math.round(maxBytes / 1024 / 1024)} MB)`));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(httpError(400, `Send the file in a field named "${fieldName}"`));
        }
        if (err instanceof multer.MulterError) return next(httpError(400, err.message));
        return next(err);
      }
      if (req.file) {
        const type = detectImageType(req.file.buffer);
        if (!type) return next(httpError(415, 'The file is not a valid JPEG, PNG or WebP image'));
        req.file.detectedType = type;
      }
      next();
    });
}

module.exports = { imageUpload, detectImageType, MAX_IMAGE_BYTES, ALLOWED_TYPES };