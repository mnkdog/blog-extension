// Browser-compatible storage for extension
class BrowserDraftStorage {
  save(id, draft) {
    const key = `draft_${id}`;
    const data = JSON.stringify(draft);
    localStorage.setItem(key, data);
    console.log('Saved draft:', id, draft);
  }

  load(id) {
    const key = `draft_${id}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  }

  list() {
    const drafts = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('draft_')) {
        const id = key.replace('draft_', '');
        drafts[id] = this.load(id);
      }
    }
    return drafts;
  }

  delete(id) {
    const key = `draft_${id}`;
    localStorage.removeItem(key);
  }
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.BrowserDraftStorage = BrowserDraftStorage;
}
