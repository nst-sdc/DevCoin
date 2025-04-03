/**
 * Cache service for storing data with expiration times
 * This helps reduce API calls and improve performance
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();

  /**
   * Get data from cache if it exists and is not expired
   * @param key Cache key
   * @returns The cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    const now = Date.now();
    const isExpired = now - item.timestamp > item.expiresIn;
    
    if (isExpired) {
      console.log(`Cache for ${key} has expired`);
      this.cache.delete(key);
      return null;
    }
    
    console.log(`Cache hit for ${key}`);
    return item.data as T;
  }

  /**
   * Store data in cache with an expiration time
   * @param key Cache key
   * @param data Data to store
   * @param expiresIn Time in milliseconds until the cache expires
   */
  set<T>(key: string, data: T, expiresIn: number): void {
    console.log(`Setting cache for ${key} with expiration ${expiresIn}ms`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    const now = Date.now();
    const isExpired = now - item.timestamp > item.expiresIn;
    
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Get the remaining time until a cache item expires
   * @param key Cache key
   * @returns Remaining time in milliseconds, or 0 if expired or not found
   */
  getTimeRemaining(key: string): number {
    const item = this.cache.get(key);
    
    if (!item) {
      return 0;
    }
    
    const now = Date.now();
    const elapsed = now - item.timestamp;
    const remaining = Math.max(0, item.expiresIn - elapsed);
    
    return remaining;
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
