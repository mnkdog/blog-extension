// src/storage.js
class DraftStorage {
  constructor() {
    this.drafts = {};
  }

  save(id, draft) {
    this.drafts[id] = draft;
  }

  load(id) {
    return this.drafts[id];
  }
}

module.exports = DraftStorage;