import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { CardComponent } from '../../components/card/card.component';
import { Account } from '../../models/account';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, AccountModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  accounts: Account[] = [];

  showModal = false;
  selectedAccount?: Account;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accounts = this.accountService.getAll();
  }

  openAddModal() {
    this.selectedAccount = undefined;
    this.showModal = true;
  }

  openEditModal(account: Account) {
    this.selectedAccount = account;
    this.showModal = true;
  }

  handleSubmit(data: Omit<Account, 'id' | 'avatar_url'>) {
    if (this.selectedAccount) {
      const updatedAccount: Account = {
        ...this.selectedAccount,
        ...data
      };
      this.accountService.updateAccount(updatedAccount);
    } else {
      if (!data?.username) return;
      this.accountService.addAccount(data);
    }

    this.selectedAccount = undefined;
    this.loadAccounts();
    this.handleClose();
  }

  handleClose() {
    this.showModal = false;
  }

  setActive({ id, scope }: { id: number; scope: 'local' | 'global' }) {
    this.accountService.setActiveAccount(id, scope);
    this.loadAccounts();
  }

  removeAccount(id: number) {
    this.accountService.removeAccount(id);
    this.loadAccounts();
  }

}
