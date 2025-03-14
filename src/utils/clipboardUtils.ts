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
      const notificationIcon = document.getElementById('notification-icon');
      const notificationMessage = document.getElementById('notification-message');
      if (!notification || !notificationIcon || !notificationMessage) return;

      notificationIcon.className = success 
      ? 'fas fa-check-circle mr-2 text-green-400' 
      : 'fas fa-exclamation-circle mr-2 text-red-400';
      notificationMessage.textContent = message;

      notification.classList.remove('opacity-0', 'translate-y-24');
      notification.classList.add(success ? 'bg-gray-800' : 'bg-red-600');
  
      setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-24');
      }, 2000);
    }
  }
  