import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Account } from '../models/account';
import { GithubService } from './github.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private readonly STORAGE_KEY = 'accounts';
  accounts: Account[] = [];

  avatar?: string;

  constructor(private githubService: GithubService, private toastr: ToastrService) {
    this.loadAccounts();
  }

  loadAccounts(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.accounts = data ? JSON.parse(data) : [];
  }

  getAll(): Account[] {
    return this.accounts;
  }

  async addAccount(account: Omit<Account, 'id' | 'avatar_url'>): Promise<void> {
    let avatar_url = '';

    try {
      const userData = await firstValueFrom(this.githubService.getUser(account.username));
      avatar_url = userData.avatar_url;
    } catch (error) {
      this.toastr.error("Usuário não encontrado.");
      return;
    }

    const newAccount: Account = {
      id: this.generateId(),
      ...account,
      avatar_url
    };

    this.accounts.push(newAccount);
    this.saveAccounts();
    this.toastr.success("Conta adicionada com sucesso.");
  }

  saveAccounts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.accounts));
  }

  generateId(): number {
    return this.accounts.length > 0
      ? Math.max(...this.accounts.map(acc => acc.id)) + 1
      : 1;
  }

  async setActiveAccount(id: number, scope: 'local' | 'global'): Promise<void> {
    this.accounts = this.accounts.map(acc => ({
      ...acc,
      isActive: acc.id === id,
      scope: acc.id === id ? scope : undefined
    }));
    this.saveAccounts();

    const activeAcc = this.accounts.find(acc => acc.id === id);
    if (!activeAcc) {
      this.toastr.error("Conta não encontrada.");
      return;
    }

    try {
      await window.electronAPI.setGitConfig({
        userName: activeAcc.name,
        userEmail: activeAcc.email,
        scope
      });
      this.toastr.success(
        `Git configurado com: ${activeAcc.name} <${activeAcc.email}>`,
        `Conta ativada (${scope})`
      );
    } catch (err: any) {
      this.toastr.error("Erro ao configurar Git", err.message);
    }
  }

  getActiveAccount(): Account | undefined {
    return this.accounts.find(acc => acc.isActive);
  }

  removeAccount(id: number): void {
    const confirmar = window.confirm('Tem certeza que deseja remover esta conta?');
    if (!confirmar) return;
    this.accounts = this.accounts.filter(acc => acc.id !== id);
    this.saveAccounts();
    this.toastr.success("Conta removida com sucesso.");
  }

  updateAccount(updated: Account): void {
    this.accounts = this.accounts.map(acc => {
      if (acc.id === updated.id) {
        return { ...acc, ...updated }
      }
      return acc
    });
    this.saveAccounts();
    this.toastr.success("Conta atualizada com sucesso.");
  }

}
