import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container animate-in">
      <div class="not-found-content hover-scale">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <button mat-raised-button color="primary" (click)="navigateToHome()">
          <mat-icon>home</mat-icon>
          Go Home
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 64px);
        text-align: center;
        padding: 20px;
      }

      .not-found-content {
        background-color: var(--card-background);
        border-radius: 8px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .error-code {
        font-size: 8rem;
        font-weight: 700;
        line-height: 1;
        color: var(--primary-color);
        margin-bottom: 24px;
        opacity: 0.8;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 16px;
        color: var(--text-color);
      }

      p {
        margin-bottom: 32px;
        color: var(--secondary-text-color);
      }

      button {
        padding: 8px 24px;
      }

      mat-icon {
        margin-right: 8px;
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
