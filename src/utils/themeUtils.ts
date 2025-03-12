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
