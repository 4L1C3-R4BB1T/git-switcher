import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss']
})
export class AccountModalComponent implements OnInit {

  @Input() account?: Account;
  @Output() submit = new EventEmitter<Omit<Account, 'id' | 'avatar_url'>>();
  @Output() close = new EventEmitter<void>();

  type = '';
  name = '';
  username = '';
  email = '';

  ngOnInit() {
    if (this.account) {
      this.name = this.account.name;
      this.username = this.account.username;
      this.email = this.account.email;
      this.type = this.account.type;
    }
  }

  onSubmit() {
    this.submit.emit({
      type: this.type,
      name: this.name,
      username: this.username,
      email: this.email
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

}
