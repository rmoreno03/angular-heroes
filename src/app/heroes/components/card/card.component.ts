import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input()
  public hero!: Hero;

  ngOnInit(): void {
    if (!this.hero) {
      throw new Error('The hero input is required');
    }
  }
}
