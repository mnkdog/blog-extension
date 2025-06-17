/**
 * @jest-environment jsdom
 */

describe('BrowserDraftStorage', () => {
  let storage;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Load the browser storage class
    require('../src/browser-storage');
    storage = new window.BrowserDraftStorage();
  });

  test('should save and load drafts', () => {
    const draft = { content: 'Test content', created: '2025-01-01' };
    
    storage.save('test-post', draft);
    const loaded = storage.load('test-post');
    
    expect(loaded).toEqual(draft);
  });

  test('should list all drafts', () => {
    storage.save('post1', { content: 'Content 1' });
    storage.save('post2', { content: 'Content 2' });
    
    const drafts = storage.list();
    
    expect(drafts).toEqual({
      'post1': { content: 'Content 1' },
      'post2': { content: 'Content 2' }
    });
  });

  test('should delete drafts', () => {
    storage.save('temp', { content: 'Temporary' });
    expect(storage.load('temp')).toBeDefined();
    
    storage.delete('temp');
    expect(storage.load('temp')).toBeUndefined();
  });
});
