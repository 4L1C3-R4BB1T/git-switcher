import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../models/account';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() account: Account = {
    id: 0,
    type: '',
    name: '',
    username: '',
    email: '',
    avatar_url: ''
  };

  @Output() activate = new EventEmitter<{ id: number; scope: 'local' | 'global' }>();
  @Output() edit = new EventEmitter<Account>();
  @Output() remove = new EventEmitter<number>();

  setActive(scope: 'local' | 'global') {
    this.activate.emit({ id: this.account.id, scope });
  }

}
