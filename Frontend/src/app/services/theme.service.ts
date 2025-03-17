import {
  Injectable,
  PLATFORM_ID,
  Inject,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light-theme' | 'dark-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light-theme');
  public theme$ = this.themeSubject.asObservable();
  private isBrowser: boolean;
  private renderer: Renderer2;
  private document: Document;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.renderer = rendererFactory.createRenderer(null, null);
    this.document = document;

    // Initialize theme from localStorage if available
    if (this.isBrowser) {
      const savedTheme = this.getCurrentTheme();
      this.setTheme(savedTheme);

      // Check for system preference if no saved theme
      if (!localStorage.getItem('theme')) {
        this.checkSystemPreference();
      }
    }
  }

  // Check if user has a system preference for dark mode
  private checkSystemPreference(): void {
    if (this.isBrowser && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark-theme');
      }
    }
  }

  getCurrentTheme(): Theme {
    if (this.isBrowser) {
      return (localStorage.getItem('theme') as Theme) || 'light-theme';
    }
    return 'light-theme';
  }

  toggleTheme(): void {
    const newTheme =
      this.themeSubject.value === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    if (!theme) theme = 'light-theme';

    if (this.isBrowser) {
      // Save to localStorage
      localStorage.setItem('theme', theme);

      // Access the body element
      const body = this.document.body;

      // Remove both theme classes
      this.renderer.removeClass(body, 'light-theme');
      this.renderer.removeClass(body, 'dark-theme');

      // Add the current theme class
      this.renderer.addClass(body, theme);

      // Update the BehaviorSubject
      this.themeSubject.next(theme);

      // Log for debugging
      console.log('Theme changed to:', theme);
      console.log('Body classes:', body.className);

      // Set theme color meta tag
      this.updateThemeColor(theme);
    }
  }

  private updateThemeColor(theme: Theme): void {
    const color = theme === 'dark-theme' ? '#303030' : '#f5f5f5';
    const metaThemeColor = this.document.querySelector(
      'meta[name="theme-color"]'
    );

    if (metaThemeColor) {
      this.renderer.setAttribute(metaThemeColor, 'content', color);
    }
  }
}
