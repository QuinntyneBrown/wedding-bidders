import { LocalStorageService, ACCESS_TOKEN_KEY } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return parsed JSON for object values', () => {
      const testValue = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(testValue));

      const result = service.get<typeof testValue>('test-key');

      expect(result).toEqual(testValue);
    });

    it('should return string value for string values', () => {
      localStorage.setItem('test-key', 'simple-string');

      const result = service.get<string>('test-key');

      expect(result).toBe('simple-string');
    });
  });

  describe('put', () => {
    it('should store string value', () => {
      service.put('test-key', 'test-value');

      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('should store object as JSON', () => {
      const testValue = { name: 'test', id: 1 };
      service.put('test-key', testValue);

      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testValue));
    });

    it('should remove item when value is null', () => {
      localStorage.setItem('test-key', 'value');

      service.put('test-key', null);

      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should remove item when value is undefined', () => {
      localStorage.setItem('test-key', 'value');

      service.put('test-key', undefined);

      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test-key', 'value');

      service.remove('test-key');

      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.remove('non-existent-key')).not.toThrow();
    });
  });
});
