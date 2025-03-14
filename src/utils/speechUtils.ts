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
  