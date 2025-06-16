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

  list() {
    return this.drafts;
  }

  delete(id) {
    delete this.drafts[id];
  }
}

module.exports = DraftStorage;