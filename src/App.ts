// src/App.ts (update with favorites functionality)

import { ConnectionStatusManager } from './utils/connectionStatusUtils';
import { ThemeToggle } from './components/ThemeToggle';
import { ApiStatusManager } from './utils/apiStatusUtils';
import { QuoteService } from './services/quoteService';
import { ClipboardUtils } from './utils/clipboardUtils';
import { SpeechUtils } from './utils/speechUtils';
import { SocialShareUtils } from './utils/socialShareUtils';
import { FavoritesManager } from './components/FavoritesManager';
import { Quote } from './models/QuoteModel';

/**
 * Main application class
 */
export class App {
  private tweetBtn: HTMLButtonElement | null;
  private speakBtn: HTMLButtonElement | null;
  private copyBtn: HTMLButtonElement | null;
  private categorySelect: HTMLSelectElement | null;
  private newQuoteBtn: HTMLButtonElement | null;
  private quoteText: HTMLElement | null;
  private quoteAuthor: HTMLElement | null;
  private categoryChoice: HTMLElement | null;
  private loadingIndicator: HTMLElement | null;
  private errorMessage: HTMLElement | null;
  

  constructor() {
    this.tweetBtn = document.getElementById('tweet-btn') as HTMLButtonElement;
    this.speakBtn = document.getElementById('speak-btn') as HTMLButtonElement;
    this.copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
    this.categorySelect = document.getElementById('category-select') as HTMLSelectElement;
    this.newQuoteBtn = document.getElementById('new-quote-btn') as HTMLButtonElement;
    this.quoteText = document.getElementById('quote-text');
    this.quoteAuthor = document.getElementById('quote-author');
    this.categoryChoice = document.getElementById('category-choice');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.errorMessage = document.getElementById('error-message');

    this.init();
    
    ConnectionStatusManager.init();
    new ThemeToggle();
    ApiStatusManager.init();
    
    // Initialize favorites manager with a callback to update the quote display
    new FavoritesManager((quote: Quote) => this.displayQuote(quote));
    }

  private async fetchNewQuote(): Promise<void> {
    if (!this.categorySelect) return;

    const selectedCategory = this.categorySelect.value;
    this.showLoading(true);

    try {
      const quote = await QuoteService.fetchQuote(selectedCategory);
      this.displayQuote(quote);
    } catch (error) {
      this.showError(true);
      console.error('Error fetching quote:', error);
    } finally {
      this.showLoading(false);
    }
  }

  private loadQuoteOfTheDay(): void {
    const storedQuote = localStorage.getItem('quoteOfTheDay');
    const storedDate = localStorage.getItem('quoteDate');
    const today = new Date().toISOString().split('T')[0];

    if (storedQuote && storedDate === today) {
      this.displayQuote(JSON.parse(storedQuote));
    } else {
      this.fetchAndStoreQuoteOfTheDay();
    }
  }

  private async fetchAndStoreQuoteOfTheDay(): Promise<void> {
    this.showLoading(true);
    try {
      const quote = await QuoteService.fetchQuote();
      localStorage.setItem('quoteOfTheDay', JSON.stringify(quote));
      localStorage.setItem('quoteDate', new Date().toISOString().split('T')[0]);
      this.displayQuote(quote);
    } catch (error) {
      this.showError(true);
      console.error('Error fetching Quote of the Day:', error);
    } finally {
      this.showLoading(false);
    }
  }

  private displayQuote(quote: Quote): void {
    if (this.quoteText) this.quoteText.textContent = quote.text;
    if (this.quoteAuthor) this.quoteAuthor.textContent = quote.author ? `- ${quote.author}` : '';
    if (this.categoryChoice) this.categoryChoice.textContent = quote.category;
    this.showError(false);
  }

  private showLoading(show: boolean): void {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.toggle('hidden', !show);
    }
  }

  private showError(show: boolean): void {
    if (this.errorMessage) {
      this.errorMessage.classList.toggle('hidden', !show);
    }
  }

  private handleCopy(): void {
    if (!this.quoteText || !this.quoteAuthor) return;

    const quote = this.quoteText.textContent?.trim();
    const author = this.quoteAuthor.textContent?.trim();
    if (!quote) return;

    const textToCopy = author ? `"${quote}" ${author}` : `"${quote}"`;
    ClipboardUtils.copyText(textToCopy);
  }

  private handleSpeak(): void {
    if (!this.quoteText) return;

    const quote = this.quoteText.textContent?.trim();
    const author = this.quoteAuthor?.textContent?.trim();
    if (!quote) return;

    const textToSpeak = author ? `"${quote}" by ${author}` : `"${quote}"`;
    SpeechUtils.speakText(textToSpeak);
  }

  private handleTweet(): void {
    if (!this.quoteText || !this.quoteAuthor) return;

    const quote = this.quoteText.textContent?.trim() || '';
    const author = this.quoteAuthor.textContent?.trim().replace(/^-\s*/, '') || 'Unknown';
    
    // Pass the quote and author separately to avoid formatting issues
    SocialShareUtils.shareOnTwitter(quote, author);
  }

  /**
   * Initialize the application
   */
  public init(): void {
    if (this.newQuoteBtn) {
      this.newQuoteBtn.addEventListener('click', () => this.fetchNewQuote());
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.handleCopy());
    }

    if (this.speakBtn) {
      this.speakBtn.addEventListener('click', () => this.handleSpeak());
    }

    if (this.tweetBtn) {
      this.tweetBtn.addEventListener('click', () => this.handleTweet());
    }
    
    // Fetch Quote of the Day on first load
    this.loadQuoteOfTheDay();
  }
}