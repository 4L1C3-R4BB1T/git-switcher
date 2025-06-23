import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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

  name = '';
  username = '';
  email = '';
  type = '';

  constructor(private toastrService: ToastrService) { }

  ngOnInit() {
    if (this.account) {
      this.name = this.account.name;
      this.username = this.account.username;
      this.email = this.account.email;
      this.type = this.account.type;
    }
  }

  onSubmit() {
    const fields = [
      { value: this.type, label: "tipo da conta" },
      { value: this.name, label: "nome" },
      { value: this.username, label: "username" },
      { value: this.email, label: "email" }
    ];

    for (const field of fields) {
      if (!field.value.trim()) {
        this.toastrService.error(`Preencha o ${field.label}.`);
        return;
      }
    }

    if (!this.isValidEmail(this.email)) {
      this.toastrService.error("Email inválido.");
      return;
    }

    this.submit.emit({
      type: this.type,
      name: this.name,
      username: this.username,
      email: this.email
    });
    this.onClose();
  }

  onClose() {
    this.cleanFields();
    this.close.emit();
  }

  cleanFields() {
    this.account = undefined;
    this.name = '';
    this.username = '';
    this.email = '';
    this.type = '';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
