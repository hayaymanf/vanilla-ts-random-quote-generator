// src/utils/connectionStatusUtils.ts

export class ConnectionStatusManager {
  private static statusElement: HTMLElement | null;

  static init(): void {
      this.statusElement = document.getElementById('connection-status');

      if (!this.statusElement) {
          console.error('Connection status element not found');
          return;
      }

      this.checkConnectionStatus();

      window.addEventListener('online', () => this.updateConnectionStatus(true));
      window.addEventListener('offline', () => this.updateConnectionStatus(false));
  }

  private static async checkConnectionStatus(): Promise<void> {
      if (navigator.onLine) {
          try {
              const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
              this.updateConnectionStatus(response.ok);
          } catch {
              this.updateConnectionStatus(false);
          }
      } else {
          this.updateConnectionStatus(false);
      }
  }

  private static updateConnectionStatus(isOnline: boolean): void {
      if (!this.statusElement) return;
      const icon = this.statusElement.querySelector('i');
      const statusText = this.statusElement.querySelector('span');

      if (isOnline) {
          if (icon) icon.classList.replace('text-red-500', 'text-green-500');
          if (statusText) statusText.textContent = 'Online';
      } else {
          if (icon) icon.classList.replace('text-green-500', 'text-red-500');
          if (statusText) statusText.textContent = 'Offline';
      }
  }
}
