const categories = require('../data/categories.json');

// "all" and empty both mean "no filter"; ids are lower-case kebab-case.
const normalizeCategoryId = (v) => {
  const id = String(v || '').trim().toLowerCase();
  return id === 'all' ? '' : id;
};

// Bangla category names when the caller asked for them, English otherwise.
function localizedCategories(lang) {
  return categories.map(({ id, name, nameBn }) => ({ id, name: lang === 'bn' && nameBn ? nameBn : name }));
}

module.exports = { normalizeCategoryId, localizedCategories, categories };