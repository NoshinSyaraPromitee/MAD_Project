// AI Doctor: analyze a plant photo, keep the history, mark scans treated.
// Port of the Go backend's usecase/diagnosis.

const DISCLAIMER =
  'This result is AI-assisted and may be inaccurate. It is not a substitute for professional horticultural or botanical advice.';
const DISCLAIMER_BN =
  'এই তথ্যটি AI-এর সাহায্যে তৈরি, তাই এতে ভুল থাকতে পারে। সঠিক সিদ্ধান্তের জন্য অনুগ্রহ করে উদ্ভিদ বিশেষজ্ঞের পরামর্শ নিন।';

class DiagnosisError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Unknown or empty values become "Mild" so a real issue is never silently
// treated as healthy; only an explicit none/healthy answer gives "none".
function normalizeSeverity(s) {
  switch (String(s || '').trim().toLowerCase()) {
    case 'none':
    case 'healthy':
    case 'no issue':
    case 'no_issue':
      return 'none';
    case 'moderate':
    case 'medium':
      return 'Moderate';
    case 'severe':
    case 'high':
    case 'critical':
      return 'Severe';
    default:
      return 'Mild';
  }
}

function createDiagnosisService({ Diagnosis, Plant, PlantEvent, provider, uploadImage, now = () => new Date() }) {
  // Maps this user's plants to their newest scan. This is the `scanSource`
  // the plant service uses for the health score. The newest scan wins even
  // when treated, so a treated latest scan can't let an older one count again.
  async function latestScans(userId, plantIds) {
    const ids = plantIds.map(String);
    if (!ids.length) return {};
    const rows = await Diagnosis.find({ owner: userId, plant: { $in: ids } }).sort({ createdAt: -1 }).lean();
    const out = {};
    for (const d of rows) {
      const key = String(d.plant);
      if (out[key]) continue; // rows are newest first
      out[key] = { id: String(d._id), issue: d.issue, issueBn: d.issueBn, severity: d.severity, at: d.createdAt, treated: d.treated };
    }
    return out;
  }

  async function analyze({ userId, plantId, file, note, lang }) {
    if (!file || !file.buffer || !file.buffer.length) throw new DiagnosisError(400, 'An image is required');
    const trimmedNote = String(note || '').trim();

    let plant = null;
    if (plantId) {
      plant = await Plant.findOne({ _id: plantId, owner: userId });
      if (!plant) throw new DiagnosisError(404, 'Plant not found');
    }

    const result = await provider.analyze(file.buffer, file.detectedType || file.mimetype, trimmedNote);

    // A photo that can't be stored must not throw away a result the user waited for.
    let image = { url: '', publicId: '' };
    if (uploadImage) {
      try {
        image = await uploadImage(file.buffer);
      } catch (err) {
        console.error('Diagnosis image upload failed:', err.message);
      }
    }

    const at = now();
    const d = await Diagnosis.create({
      owner: userId,
      plant: plant ? plant._id : null,
      issue: result.issue,
      cure: result.cure,
      confidence: result.confidence,
      severity: normalizeSeverity(result.severity),
      fertilizer: result.fertilizer,
      disclaimer: DISCLAIMER,
      disclaimerBn: DISCLAIMER_BN,
      issueBn: result.issueBn,
      cureBn: result.cureBn,
      provider: result.provider || provider.name || '',
      imageUrl: image.url,
      imagePublicId: image.publicId,
      createdAt: at,
    });

    if (plant) {
      // Best effort, like the Go backend: the scan is already saved.
      try {
        plant.lastScan = at;
        await plant.save();
        await PlantEvent.create({
          plant: plant._id,
          owner: userId,
          eventType: 'scan',
          note: trimmedNote.slice(0, 500),
          imageUrl: image.url,
          metadata: { diagnosisId: String(d._id), issue: d.issue, severity: d.severity },
          createdAt: at,
        });
      } catch (err) {
        console.error('Recording scan on plant failed:', err.message);
      }
    }
    return d.present(lang);
  }

  async function list(userId, plantId, lang) {
    const filter = { owner: userId };
    if (plantId) filter.plant = plantId;
    const rows = await Diagnosis.find(filter).sort({ createdAt: -1 });
    return rows.map((d) => d.present(lang));
  }

  async function getOwned(userId, id) {
    const d = await Diagnosis.findOne({ _id: id, owner: userId });
    if (!d) throw new DiagnosisError(404, 'Diagnosis not found');
    return d;
  }

  async function get(userId, id, lang) {
    return (await getOwned(userId, id)).present(lang);
  }

  // Idempotent: marking an already-treated scan keeps the original time.
  async function markTreated(userId, id, lang) {
    const d = await getOwned(userId, id);
    if (!d.treated) {
      d.treated = true;
      d.treatedAt = now();
      await d.save();
    }
    return d.present(lang);
  }

  return { analyze, list, get, markTreated, latestScans };
}

module.exports = { createDiagnosisService, normalizeSeverity, DiagnosisError, DISCLAIMER, DISCLAIMER_BN };
