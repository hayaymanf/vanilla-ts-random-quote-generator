// src/components/FavoritesManager.ts
import { Quote } from '../models/QuoteModel';
import { FavoritesService } from '../services/favoritesService';

export class FavoritesManager {
  private favoriteBtn: HTMLButtonElement | null;
  private favoritesList: HTMLElement | null;
  private noFavoritesMessage: HTMLElement | null;
  private clearFavoritesBtn: HTMLButtonElement | null;
  private onQuoteSelected: (quote: Quote) => void;

  constructor(onQuoteSelected: (quote: Quote) => void) {
    this.favoriteBtn = document.getElementById('favorite-btn') as HTMLButtonElement;
    this.favoritesList = document.getElementById('favorites-list');
    this.noFavoritesMessage = document.getElementById('no-favorites');
    this.clearFavoritesBtn = document.getElementById('clear-favorites-btn') as HTMLButtonElement;
    this.onQuoteSelected = onQuoteSelected;

    this.init();
  }

  private init(): void {
    // Initialize favorites list
    this.updateFavoritesList();

    // Add event listener for the favorite button
    if (this.favoriteBtn) {
      this.favoriteBtn.addEventListener('click', () => this.handleAddFavorite());
    }

    // Add event listener for the clear favorites button
    if (this.clearFavoritesBtn) {
      this.clearFavoritesBtn.addEventListener('click', () => this.handleClearFavorites());
    }
  }

  /**
   * Update the favorites list in the UI
   */
  private updateFavoritesList(): void {
    const favorites = FavoritesService.getFavorites();
    
    if (!this.favoritesList || !this.noFavoritesMessage) return;
    
    // Show/hide appropriate elements based on whether we have favorites
    if (favorites.length === 0) {
      this.favoritesList.classList.add('hidden');
      this.noFavoritesMessage.classList.remove('hidden');
      return;
    } else {
      this.favoritesList.classList.remove('hidden');
      this.noFavoritesMessage.classList.add('hidden');
    }
    
    // Clear current list
    this.favoritesList.innerHTML = '';
    
    // Add each favorite quote to the list
    favorites.forEach(quote => {
      const quoteElement = this.createFavoriteQuoteElement(quote);
      this.favoritesList?.appendChild(quoteElement);
    });
  }

  /**
   * Create a favorite quote element with functionality
   * @param quote The quote to display
   * @returns HTML element for the quote
   */
  private createFavoriteQuoteElement(quote: Quote): HTMLElement {
    const quoteElement = document.createElement('div');
    quoteElement.className = 'bg-white/5 dark:bg-black/5 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer';
    
    // Format timestamp if available
    let timeAgo = '';
    if (quote.timestamp) {
      const date = new Date(quote.timestamp);
      timeAgo = this.formatTimeAgo(date);
    }
    
    quoteElement.innerHTML = `
      <div class="mb-2 flex items-start justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400 italic">
          ${timeAgo}
        </p>
        <div class="flex space-x-2">
          <button 
            class="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title="Load this quote"
            data-action="load"
            data-id="${quote.id}"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
          <button 
            class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
            title="Remove from favorites"
            data-action="remove"
            data-id="${quote.id}"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <blockquote>
        <p class="text-gray-800 dark:text-gray-200 mb-2">"${quote.text}"</p>
        <footer class="flex items-center justify-between">
          <cite class="text-sm text-pink-600 dark:text-pink-400 not-italic">
            ${quote.author || 'Unknown'}
          </cite>
          <span class="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full">
            ${quote.category || 'General'}
          </span>
        </footer>
      </blockquote>
    `;
    
    // Add event listeners for the buttons
    const loadButton = quoteElement.querySelector('[data-action="load"]');
    const removeButton = quoteElement.querySelector('[data-action="remove"]');
    
    if (loadButton) {
      loadButton.addEventListener('click', () => this.loadQuote(quote));
    }
    
    if (removeButton) {
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent loading the quote when removing it
        this.removeFavorite(quote.id as string);
      });
    }
    
    // Add click event to the whole element to load the quote
    quoteElement.addEventListener('click', () => this.loadQuote(quote));
    
    return quoteElement;
  }

  /**
   * Format a date as a relative time string (e.g., "2 days ago")
   * @param date Date to format
   * @returns Formatted string
   */
  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  /**
   * Handle adding the current quote to favorites
   */
  public handleAddFavorite(): void {
    const textElement = document.getElementById('quote-text');
    const authorElement = document.getElementById('quote-author');
    const categoryElement = document.getElementById('category-choice');
    
    if (!textElement || !authorElement) {
      console.error('Quote elements not found');
      return;
    }
    
    const text = textElement.textContent?.trim() || '';
    const author = authorElement.textContent?.trim().replace(/^-\s*/, '') || 'Unknown';
    const category = categoryElement?.textContent?.trim() || 'General';
    
    if (text) {
      const quote: Quote = { text, author, category };
      FavoritesService.addFavorite(quote);
      this.updateFavoritesList();
      this.showNotification('Added to favorites!', true);
    }
  }

  /**
   * Handle removing a favorite quote
   * @param quoteId ID of the quote to remove
   */
  private removeFavorite(quoteId: string): void {
    FavoritesService.removeFavorite(quoteId);
    this.updateFavoritesList();
    this.showNotification('Removed from favorites', true);
  }

  /**
   * Handle clearing all favorites
   */
  private handleClearFavorites(): void {
    // if (confirm('Are you sure you want to clear all favorites?')) {
      FavoritesService.clearFavorites();
      this.updateFavoritesList();
      this.showNotification('All favorites cleared', true);
    // }
  }

  /**
   * Load a quote from favorites to the main display
   * @param quote Quote to load
   */
  private loadQuote(quote: Quote): void {
    this.onQuoteSelected(quote);
    this.showNotification('Quote loaded!', true);
  }

  /**
   * Show notification for favorite actions
   * @param message Message to display
   * @param success Whether it's a success notification
   */
  private showNotification(message: string, success: boolean = true): void {
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');
    
    if (!notification || !notificationIcon || !notificationMessage) return;
    
    // Update notification content
    notificationIcon.className = success 
      ? 'fas fa-check-circle mr-2 text-green-400' 
      : 'fas fa-exclamation-circle mr-2 text-red-400';
    notificationMessage.textContent = message;
    
    // Show notification
    notification.classList.remove('opacity-0', 'translate-y-24');
    notification.classList.add(success ? 'bg-gray-800' : 'bg-red-600');
    
    // Hide notification after delay
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-24');
    }, 2000);
  }
}