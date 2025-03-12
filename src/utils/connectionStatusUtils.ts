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
  