
✅ Handle errors gracefully (e.g., failed API request, network issues).
➕ Offline mode (use cached quotes if the API fails).


// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <title>Random Quote Generator</title>
    <link rel="stylesheet" href="style.css" />
    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
  </head>
  <body
    class=" bg-gray-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen"
  >
    <div
      class="container mx-auto px-4 py-8 flex flex-col min-h-screen max-w-5xl"
    >
      <!-- Header with title and theme toggle -->
      <header class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <h1
            class="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400"
          >
            ImamQuotes
          </h1>
          <div
            class="ml-3 text-sm px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full hidden md:block"
          >
            <span id="connection-status">
              <i class="fas fa-wifi text-green-500 mr-1"></i>
              <span>Online</span>
            </span>
          </div>
        </div>

        <button
          id="theme-toggle"
          class="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
        >
          <i class="fas fa-sun dark:hidden"></i>
          <i class="fas fa-moon hidden dark:block"></i>
        </button>
      </header>

      <main class="flex-grow flex flex-col lg:flex-row gap-6">
        <!-- Left column: Quote Display and Actions -->
        <div class="w-full lg:w-2/3 flex flex-col">
          <!--Category selector-->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <label
                for="category-select"
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Choose Category
              </label>
              <span
                id="offline-badge"
                class="hidden text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full"
              >
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Offline Mode
              </span>
            </div>
            <div class="relative">
              <select
                id="category-select"
                class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="inspiration">Inspiration</option>
                <option value="motivation">Motivation</option>
                <option value="success">Success</option>
                <option value="wisdom">Wisdom</option>
                <option value="happiness">Happiness</option>
                <option value="life">Life</option>
                <option value="love">Love</option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500"
              >
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <!--Quote Display-->
          <div
            id="quote-container"
            class="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow border border-gray-200 dark:border-gray-700"
          >
            <!--Loading Indicator-->
            <div id="loading-indicator" class="hidden">
              <div
                class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 animate-pulse"
              ></div>
              <div
                class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 animate-pulse"
              ></div>
              <div
                class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
            </div>

            <!-- Error Message -->
            <div
              id="error-message"
              class="hidden bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4"
            >
              <i class="fas fa-exclamation-circle mr-2"></i>
              <span>Failed to fetch quote. Please try again.</span>
            </div>

            <!-- Quote Content -->
            <div id="quote-content">
              <blockquote class="relative">
                <i
                  class="fas fa-quote-left text-4xl opacity-15 text-indigo-400 absolute -top-2 -left-1"
                ></i>
                <p
                  id="quote-text"
                  class="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mt-4 mb-6 leading-relaxed"
                >
                </p>
                <footer class="flex items-center justify-between">
                  <cite
                    id="quote-author"
                    class="text-lg text-pink-600 dark:text-pink-400 font-medium not-italic"
                  >
                    
                  </cite>
                  <div id="quote-tags" class="flex flex-wrap gap-2">
                    <span
                      id="category-choice"
                      class="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full"
                    >
                      
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          <!-- Quote Actions -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              id="new-quote-btn"
              class="col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <i class="fas fa-sync-alt"></i>
              <span>New</span>
            </button>

            <button
              id="favorite-btn"
              class="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <i class="far fa-heart"></i>
              <span>Save</span>
            </button>

            <button
              id="copy-btn"
              class="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <i class="far fa-copy"></i>
              <span>Copy</span>
            </button>

            <button
              id="tweet-btn"
              class="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <i class="fab fa-twitter"></i>
              <span>Tweet</span>
            </button>

            <button
              id="speak-btn"
              class="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <i class="fas fa-volume-up"></i>
              <span>Speak</span>
            </button>
          </div>

          <!-- Notification Toast -->
          <div
            id="notification"
            class="fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg bg-gray-800 text-white transform translate-y-24 transition-transform duration-300 z-50 opacity-0"
          >
            <i
              id="notification-icon"
              class="fas fa-check-circle mr-2 text-green-400"
            >
            </i>
            <span id="notification-message">Quote copied to clipboard</span>
          </div>
        </div>

        <!--  Right column: Favorites -->
        <div class="w-full lg:w-1/3">
          <div 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 h-full border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
              <h2
                class="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                <i class="fas fa-bookmark mr-2"></i>
                Favorite Quotes
              </h2>
              <button
                id="clear-favorites-btn"
                class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 cursor-pointer">
                <i class="fas fa-trash-alt mr-1"></i>
                Clear All
              </button>
            </div>

            <div id="no-favorites"
            class="text-center py-10 text-gray-500 dark:text-gray-400" >
              <i class="far fa-heart text-3xl mb-2 animate-pulse"></i>
              <p>No favo Quotes yet .</p>
              <p class="text-sm mt-2">
                Click the "Save" button to add quotes to your collection and revisit them anytime
              </p>
            </div>

            <div 
              id="favorites-list"
              class="max-h-[500px] overflow-y-auto pr-2 hidden space-y-4">
              
              <!-- favorite quotes that i will populate with typescript -->

            </div>
          </div>
        </div>
      </main>

      <footer class="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm py-6 border-t border-gray-200 dark:border-slate-800/50">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p>
            made by <strong>Ayman Imam</strong><span class="text-pink-500">❤</span> with vanilla Typescript & tailwindcss
          </p>
          <span class="hidden md:block text-slate-300 dark:text-slate-600">|</span>
          <p>
            <span id="apiStatus" class="inline-flex items-center">
              <span class="w-2 h-2 mr-1.5 rounded-full bg-green-500 animate-pulse"></span>
              API Status: Connected
            </span>
          </p>
          <span class="hidden md:block text-slate-300 dark:text-slate-600">|</span>
          <a href="https://github.com/hayaymanf/random-quote-generator" target="_blank">
            <p class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer">
              <i class="fas fa-code mr-1"></i>
              View on GitHub
            </p>
          </a>
        </div>
      </footer>
      
    </div>
    <script type="module" src="src/main.ts"></script>
  </body>
</html>

// style.css

@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));


types

// src/types/ThemeType.ts
export type Theme = 'light' | 'dark';


models

// src/models/QuoteModel.ts
export interface Quote {
  text: string;
  author: string;
  category: string;
  id?: string; // Unique identifier for each quote
  timestamp?: number; // When the quote was added to favorites
}

utils

// src/utils/apiStatusUtils.ts
export class ApiStatusManager {
    private static apiStatusElement: HTMLElement | null = null;
  
    // Set API status element
    static setApiStatusElement(elementId: string = 'apiStatus'): void {
      this.apiStatusElement = document.getElementById(elementId);
    }
  
    // Update the API status (Connected / Disconnected)
    private static updateApiStatus(isConnected: boolean): void {
      if (!this.apiStatusElement) {
        console.error('API status element not found');
        return;
      }
  
      const statusColor = isConnected ? 'bg-green-500' : 'bg-red-500';
      const statusMessage = isConnected
        ? 'API Status: Connected'
        : 'API Status: Disconnected';
  
      // Update the element's content
      this.apiStatusElement.innerHTML = `
        <span class="w-2 h-2 mr-1.5 rounded-full ${statusColor} animate-pulse"></span>
        ${statusMessage}
      `;
    }
  
    // Check API status by making a JSONP request
    static async checkApiStatus(): Promise<void> {
      try {
        // First, verify internet connectivity with a reliable source
        const connectivityCheckUrl = 'https://jsonplaceholder.typicode.com/todos/1';
        const connectivityResponse = await fetch(connectivityCheckUrl);
  
        if (!connectivityResponse.ok) {
          this.updateApiStatus(false);
          return;
        }
  
        // JSONP Setup for Forismatic API
        const script = document.createElement('script');
        const callbackName = 'forismaticCallback_' + Math.round(Math.random() * 1000000);
  
        // Create a promise to handle the JSONP response
        const jsonpPromise = new Promise<void>((resolve, reject) => {
          // Timeout to prevent hanging if API is down
          const timeoutId = setTimeout(() => {
            reject(new Error('API request timed out'));
            cleanup();
          }, 5000);
  
          // Define the callback function in global scope
          (window as any)[callbackName] = (_: any) => {
            clearTimeout(timeoutId);
            this.updateApiStatus(true);
            resolve();
            cleanup();
          };
  
          // Cleanup function to remove script and callback
          const cleanup = () => {
            delete (window as any)[callbackName];
            if (document.body.contains(script)) {
              document.body.removeChild(script);
            }
          };
  
          // Handle script errors
          script.onerror = () => {
            clearTimeout(timeoutId);
            this.updateApiStatus(false);
            reject(new Error('Failed to load API script'));
            cleanup();
          };
        });
  
        // Set up the JSONP request
        script.src = `https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=${callbackName}`;
        document.body.appendChild(script);
  
        try {
          await jsonpPromise;
        } catch (jsonpError) {
          console.error('JSONP request failed:', jsonpError);
          this.updateApiStatus(false);
        }
      } catch (error) {
        console.error('Failed to check API status:', error);
        this.updateApiStatus(false);
      }
    }
  
    // Initialize the API status manager
    static init(): void {
      // Set the element where the API status will be displayed
      this.setApiStatusElement();
  
      // Ensure element is found before checking API status
      if (!this.apiStatusElement) {
        console.error('API status element not found on the page.');
        return;
      }
  
      // Initial API status check
      this.checkApiStatus();
  
      // Periodically check API status every 5 seconds
      setInterval(() => {
        this.checkApiStatus();
      }, 5000);
    }
  }
  
// src/utils/clipboardUtils.ts

export class ClipboardUtils {
    /**
     * Copy text to the clipboard
     * @param text - The text to copy
     * @returns Promise<void>
     */
    static async copyText(text: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(text);
        this.showNotification('Quote copied to clipboard!', true);
      } catch (error) {
        console.error('Failed to copy quote:', error);
        this.showNotification('Failed to copy quote.', false);
      }
    }
  
    /**
     * Show notification feedback
     * @param message - Message to display
     * @param success - Whether it's a success or error message
     */
    private static showNotification(message: string, success: boolean): void {
      const notification = document.getElementById('notification');
      if (!notification) return;
  
      notification.textContent = message;
      notification.classList.remove('opacity-0', 'translate-y-24');
      notification.classList.add(success ? 'bg-green-600' : 'bg-red-600');
  
      setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-24');
      }, 2000);
    }
  }
  
// src/utils/connectionStatusUtils.ts

export class ConnectionStatusManager {
    private static statusElement: HTMLElement | null;
  
    static init(): void {
      this.statusElement = document.getElementById('connection-status');
  
      if (!this.statusElement) {
        console.error('Connection status element not found');
        return;
      }
  
      // Initial check of connection status
      this.checkConnectionStatus();
  
      // Add event listeners for online/offline events
      window.addEventListener('online', () => this.checkConnectionStatus());
      window.addEventListener('offline', () => this.checkConnectionStatus());
  
      // Set an interval to check connection status every 5 seconds
      setInterval(() => {
        this.checkConnectionStatus();
      }, 5000);
    }
  
    /**
     * Check if the user is actually online by making a fetch request
     */
    private static async checkConnectionStatus(): Promise<void> {
      const isOnline = navigator.onLine;
      console.log('Navigator online status:', isOnline);  // Debugging: Log navigator status
  
      if (isOnline) {
        try {
          console.log('Attempting to fetch from external server...');
          // Try fetching from a reliable external source without CORS issues
          const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', { method: 'GET' });
  
          if (response.ok) {
            this.updateConnectionStatus(true);
          } else {
            console.error('Failed to reach the external server');
            this.updateConnectionStatus(false);
          }
        } catch (error) {
          console.error('Fetch failed, no internet:', error);  // Log error for debugging
          this.updateConnectionStatus(false);
        }
      } else {
        this.updateConnectionStatus(false);
      }
    }
  
    /**
     * Update the connection status based on the actual internet connection.
     * @param isOnline - Boolean representing online or offline status.
     */
    private static updateConnectionStatus(isOnline: boolean): void {
      if (!this.statusElement) return;
  
      const icon = this.statusElement.querySelector('i');
      const statusText = this.statusElement.querySelector('span');
  
      if (isOnline) {
        // User is online
        if (icon) icon.classList.replace('text-red-500', 'text-green-500');
        if (statusText) statusText.textContent = 'Online';
        this.statusElement.style.display = 'block';
      } else {
        // User is offline
        if (icon) icon.classList.replace('text-green-500', 'text-red-500');
        if (statusText) statusText.textContent = 'Offline';
        this.statusElement.style.display = 'block';
      }
    }
  }
  
  // src/utils/socialShareUtils.ts

export class SocialShareUtils {
    /**
     * Share content on Twitter using the Web Share API if available,
     * falling back to a new window approach
     * 
     * @param text - The quote text
     * @param author - The quote author
     * @param url - Optional URL to include in the tweet
     * @returns Promise<void>
     */
    static async shareOnTwitter(text: string, author: string, url?: string): Promise<void> {
      try {
        // Format the quote text properly
        const formattedAuthor = author.startsWith('-') ? author.trim() : `- ${author.trim()}`;
        const textToTweet = `"${text.trim()}" ${formattedAuthor}`;
        
        // Truncate the text if it's too long for Twitter (280 chars minus URL length)
        const maxLength = url ? 250 : 280;
        const truncatedText = textToTweet.length > maxLength 
          ? textToTweet.substring(0, maxLength - 3) + '...' 
          : textToTweet;
        
        // Check if Web Share API is properly supported (some browsers report it but don't fully support it)
        if (navigator.share && this.isWebShareSupported()) {
          try {
            await navigator.share({
              title: 'Share this quote',
              text: truncatedText,
              url: url || window.location.href
            });
            return;
          } catch (shareError) {
            console.log('Web Share API failed, falling back to Twitter Web Intent', shareError);
            // Fall through to the Twitter Web Intent method if Web Share fails
          }
        }
        
        // Twitter Web Intent as fallback
        const twitterUrl = new URL('https://twitter.com/intent/tweet');
        twitterUrl.searchParams.append('text', truncatedText);
        
        if (url) {
          twitterUrl.searchParams.append('url', url);
        }
        
        // Open a new window with appropriate size
        const width = 550;
        const height = 420;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const shareWindow = window.open(
          twitterUrl.toString(),
          'tweet',
          `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0`
        );
        
        if (shareWindow) {
          // Show a notification that the share window opened
          this.showShareNotification('Twitter share window opened');
        } else {
          // Window.open might be blocked by popup blockers
          this.showShareNotification('Please allow popups to share on Twitter', false);
        }
      } catch (error) {
        console.error('Failed to share on Twitter:', error);
        this.showShareNotification('Failed to share on Twitter', false);
      }
    }
  
    /**
     * Check if Web Share API is really supported
     * Some browsers claim to support it but don't fully implement it
     */
    private static isWebShareSupported(): boolean {
      // Some versions of Edge and Chrome report navigator.share but don't fully support it
      const userAgent = navigator.userAgent.toLowerCase();
      
      // If on mobile, Web Share API is more likely to work correctly
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      
      // If on desktop Firefox, it often has better Web Share API support
      const isFirefox = userAgent.indexOf('firefox') > -1;
      
      return isFirefox || isMobile;
    }
  
    /**
     * Show notification for share actions
     * @param message - Message to display
     * @param success - Whether it's a success or error message
     */
    private static showShareNotification(message: string, success: boolean = true): void {
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

  // src/utils/speechUtils.ts

export class SpeechUtils {
    private static synth = window.speechSynthesis;
    private static voices: SpeechSynthesisVoice[] = [];
    private static isSpeaking = false;
    private static isVoiceLoaded = false;
  
    /**
     * Load voices before speaking to prevent errors
     */
    public static loadVoices(): void {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        this.isVoiceLoaded = true;
      } else {
        setTimeout(() => {
          this.voices = this.synth.getVoices();
          this.isVoiceLoaded = true;
        }, 100);
      }
    }
  
    /**
     * Speak the given text using the Web Speech API
     * @param text - The text to be spoken
     */
    static speakText(text: string): void {
      if (!text.trim()) return; // Do nothing if the text is empty
  
      // Ensure voices are loaded before speaking
      if (!this.isVoiceLoaded) {
        console.warn('Voices not loaded yet, retrying...');
        setTimeout(() => this.speakText(text), 200);
        return;
      }
  
      // Prevent multiple speech overlaps
      if (this.synth.speaking || this.isSpeaking) {
        console.warn('Speech already in progress. Stopping previous speech before starting a new one.');
        this.stopSpeech();
        setTimeout(() => this.speakText(text), 300); // Retry after stopping
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Set voice properties
      utterance.voice = this.voices.find(v => v.lang.startsWith('en')) || null;
      utterance.rate = 1; // Normal speed
      utterance.pitch = 1; // Normal pitch
      utterance.volume = 1; // Full volume
  
      utterance.onstart = () => {
        this.isSpeaking = true;
      };
  
      utterance.onend = () => {
        this.isSpeaking = false;
      };
  
      utterance.onerror = (error) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', error);
      };
  
      this.synth.speak(utterance);
    }
  
    /**
     * Stop the current speech if needed
     */
    static stopSpeech(): void {
      if (this.synth.speaking) {
        this.synth.cancel();
        this.isSpeaking = false;
      }
    }
  }
  
  // Ensure voices are loaded on page load
  window.speechSynthesis.onvoiceschanged = () => {
    SpeechUtils.loadVoices();
  };
  

  // src/utils/themeUtils.ts
import { Theme } from '../types/ThemeType';

/**
 * Manages theme settings including storage, retrieval, and application
 */
export class ThemeManager {
  private static STORAGE_KEY = 'preferred-theme';
  
  /**
   * Get current theme from local storage or system preference
   */
  static getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Save theme preference to local storage
   */
  static saveTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Apply theme to document element
   */
  static applyTheme(theme: Theme): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Toggle between light and dark themes
   */
  static toggleTheme(): Theme {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
    return newTheme;
  }
}



services

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


// src/services/quoteService.ts

export class QuoteService {
    private static apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp';
  
    /**
     * Fetch a quote using JSONP (Forismatic API does not support CORS)
     * @returns A promise resolving to a quote object { text, author, category }
     */
    static async fetchQuote(category: string = 'all'): Promise<{ text: string; author: string; category: string }> {
      return new Promise((resolve, reject) => {
        const callbackName = 'forismaticCallback_' + Math.round(Math.random() * 1000000);
        const script = document.createElement('script');
  
        // Timeout handling
        const timeoutId = setTimeout(() => {
          reject(new Error('API request timed out'));
          cleanup();
        }, 5000);
  
        // Define the JSONP callback function
        (window as any)[callbackName] = (data: any) => {
          clearTimeout(timeoutId);
          resolve({
            text: data.quoteText || 'No quote available',
            author: data.quoteAuthor || 'Unknown',
            category: category !== 'all' ? category : 'General'
          });
          cleanup();
        };
  
        // Cleanup function to remove the script tag
        const cleanup = () => {
          delete (window as any)[callbackName];
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
  
        // Handle script errors
        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load API script'));
          cleanup();
        };
  
        // Set up the JSONP request
        script.src = `${this.apiUrl}&format=jsonp&jsonp=${callbackName}`;
        document.body.appendChild(script);
      });
    }
  }
  


components 

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
    quoteElement.className = 'bg-white/5 dark:bg-black/5 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors';
    
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
            class="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            title="Load this quote"
            data-action="load"
            data-id="${quote.id}"
          >
            <i class="fas fa-arrow-right text-xs"></i>
          </button>
          <button 
            class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Remove from favorites"
            data-action="remove"
            data-id="${quote.id}"
          >
            <i class="fas fa-times text-xs"></i>
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
    if (confirm('Are you sure you want to clear all favorites?')) {
      FavoritesService.clearFavorites();
      this.updateFavoritesList();
      this.showNotification('All favorites cleared', true);
    }
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

// src/components/ThemeToggle.ts
import { ThemeManager } from '../utils/themeUtils';

/**
 * Theme toggle component
 */
export class ThemeToggle {
  private element: HTMLElement | null;

  constructor(elementId: string = 'theme-toggle') {
    this.element = document.getElementById(elementId);
    this.init();
  }

  private init(): void {
    if (!this.element) {
      console.error('Theme toggle element not found');
      return;
    }

    // Initialize theme based on saved preference or system preference
    const currentTheme = ThemeManager.getCurrentTheme();
    ThemeManager.applyTheme(currentTheme);

    // Add click event listener to toggle theme using an arrow function
    this.element.addEventListener('click', () => this.handleToggleClick());
  }

  private handleToggleClick(): void {
    const newTheme = ThemeManager.toggleTheme();
    console.log(`Theme toggled to: ${newTheme}`);
  }
}


App.ts 

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

main

// src/main.ts
import { App } from './App';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});


    