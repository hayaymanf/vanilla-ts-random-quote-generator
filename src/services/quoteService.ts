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
  