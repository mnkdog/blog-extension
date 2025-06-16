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


test('should list all saved drafts', () => {
  const storage = new DraftStorage();
  
  storage.save('post-1', { title: 'First Post', content: 'Content 1' });
  storage.save('post-2', { title: 'Second Post', content: 'Content 2' });
  
  const drafts = storage.list();
  
  expect(drafts).toEqual({
    'post-1': { title: 'First Post', content: 'Content 1' },
    'post-2': { title: 'Second Post', content: 'Content 2' }
  });
});


test('should return undefined for non-existent drafts', () => {
  const storage = new DraftStorage();
  
  const result = storage.load('does-not-exist');
  
  expect(result).toBeUndefined();
});