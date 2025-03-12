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