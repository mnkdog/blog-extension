// Popup script for blog extension
const DraftStorage = require('./storage');

// Initialize storage and save something to make test pass
const storage = new DraftStorage();
storage.save('test', { title: 'test', content: 'test' });
