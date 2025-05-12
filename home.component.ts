import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  cardColor: string = '#ffffff';

  onButtonClick(): void {
    this.cardColor = this.getRandomColor();
  }

  // Utility to generate a random hex color
  private getRandomColor(): string {
    const randomInt = Math.floor(Math.random() * 16777215);
    return `#${randomInt.toString(16).padStart(6, '0')}`;
  }
}
