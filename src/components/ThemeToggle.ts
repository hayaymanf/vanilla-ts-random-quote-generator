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
