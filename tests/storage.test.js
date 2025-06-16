// tests/storage.test.js
const DraftStorage = require('../src/storage');

describe('DraftStorage', () => {
  test('should save a draft post', () => {
    const storage = new DraftStorage();
    const draft = { title: 'Hello World', content: 'This is my first post' };
    
    storage.save('my-first-post', draft);
    
    const saved = storage.load('my-first-post');
    expect(saved).toEqual(draft);
  });
});