// src/services/favoritesService.ts
import { Quote } from '../models/QuoteModel';

export class FavoritesService {
  private static readonly STORAGE_KEY = 'favorite-quotes';

  /**
   * Get all favorite quotes from localStorage
   * @returns Array of favorite Quote objects
   */
  static getFavorites(): Quote[] {
    const favorites = localStorage.getItem(this.STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  /**
   * Add a quote to favorites
   * @param quote The quote to add
   * @returns The updated favorites array
   */
  static addFavorite(quote: Quote): Quote[] {
    const favorites = this.getFavorites();
    
    // Generate a unique ID if not provided
    if (!quote.id) {
      quote.id = this.generateId();
    }
    
    // Add timestamp if not provided
    if (!quote.timestamp) {
      quote.timestamp = Date.now();
    }
    
    // Check if quote already exists to prevent duplicates
    if (!this.quoteExists(quote, favorites)) {
      favorites.push(quote);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
    
    return favorites;
  }

  /**
   * Remove a quote from favorites
   * @param quoteId The ID of the quote to remove
   * @returns The updated favorites array
   */
  static removeFavorite(quoteId: string): Quote[] {
    let favorites = this.getFavorites();
    favorites = favorites.filter(favorite => favorite.id !== quoteId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    return favorites;
  }

  /**
   * Clear all favorites
   * @returns Empty array
   */
  static clearFavorites(): Quote[] {
    localStorage.removeItem(this.STORAGE_KEY);
    return [];
  }

  /**
   * Check if a quote already exists in favorites
   * @param quote The quote to check
   * @param favorites Array of favorites to check against
   * @returns Boolean indicating if quote exists
   */
  private static quoteExists(quote: Quote, favorites: Quote[]): boolean {
    return favorites.some(favorite => 
      favorite.text === quote.text && favorite.author === quote.author
    );
  }

  /**
   * Generate a unique ID for a quote
   * @returns Unique string ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}