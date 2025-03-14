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
      }, 1000);
    }
  }
  