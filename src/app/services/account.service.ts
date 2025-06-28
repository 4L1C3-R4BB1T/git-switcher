import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Account } from '../models/account';
import { GithubService } from './github.service';
import { LocalGitService } from './local-git.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private readonly STORAGE_KEY = 'accounts';
  accounts: Account[] = [];

  avatar?: string;

  constructor(
    private githubService: GithubService,
    private toastrService: ToastrService,
    private localGitService: LocalGitService
  ) {
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
      this.toastrService.error("Usuário não encontrado.");
      return;
    }

    const newAccount: Account = {
      id: this.generateId(),
      ...account,
      avatar_url
    };

    this.accounts.push(newAccount);
    this.saveAccounts();
    this.toastrService.success("Conta adicionada com sucesso.");
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
      this.toastrService.error("Conta não encontrada.");
      return;
    }

    try {
      await window.electronAPI.setGitConfig({
        userName: activeAcc.name,
        userEmail: activeAcc.email,
        scope
      });
      this.toastrService.success(
        `Git configurado com: ${activeAcc.name} <${activeAcc.email}>`,
        `Conta ativada (${scope})`
      );
    } catch (err: any) {
      this.toastrService.error("Erro ao configurar Git", err.message);
    }
  }

  async setLocalAccount(account: Account): Promise<void> {
    const repoPath = await window.electronAPI.selectRepoDialog();
    if (!repoPath) return;
    this.localGitService.set(repoPath, account.id);
    try {
      await window.electronAPI.setGitConfig({
        userName: account.name,
        userEmail: account.email,
        scope: 'local',
        repoPath
      });

      this.toastrService.success(
        `Conta local configurada para ${repoPath}`,
        'Git Local'
      );
    } catch (err: any) {
      this.toastrService.error("Erro ao configurar Git local", err.message);
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

    const raw = localStorage.getItem('local-git-configs');
    if (raw) {
      const localConfigs = JSON.parse(raw);
      const updated = localConfigs.filter((item: any) => item.accountId !== id);
      localStorage.setItem('local-git-configs', JSON.stringify(updated));
    }

    this.toastrService.success("Conta removida com sucesso.");
  }

  updateAccount(updated: Account): void {
    this.accounts = this.accounts.map(acc => {
      if (acc.id === updated.id) {
        return { ...acc, ...updated }
      }
      return acc
    });
    this.saveAccounts();
    this.toastrService.success("Conta atualizada com sucesso.");
  }

  async viewGitConfig(scope: 'local' | 'global') {
    if (scope === 'local') {
      try {
        const repoPath = await window.electronAPI.selectRepoDialog();
        if (!repoPath) return;
        const result = await window.electronAPI.getGitConfig({ scope, repoPath });
        this.toastrService.info(result, `Configurações Locais`);
      } catch (err: any) {
        this.toastrService.error(err.message);
      }
    } else {
      try {
        const result = await window.electronAPI.getGitConfig({ scope });
        this.toastrService.info(result, `Configurações Globais`);
      } catch (err: any) {
        this.toastrService.error(err.message);
      }
    }
  }

  async resetGitConfig(scope: 'local' | 'global') {
    if (scope === 'local') {
      try {
        const repoPath = await window.electronAPI.selectRepoDialog();
        if (!repoPath) return;
        const result = await window.electronAPI.resetGitConfig({ scope, repoPath });
        this.localGitService.remove(repoPath);
        this.toastrService.info(result, `Resetado (${scope})`);
        window.location.reload();
      } catch (err: any) {
        this.toastrService.error(err.message);
      }
    } else {
      try {
        const msg = await window.electronAPI.resetGitConfig({ scope });
        this.toastrService.success(msg, `Resetado (${scope})`);
      } catch (err: any) {
        this.toastrService.error(err.message);
      }
    }
  }

  exportAccounts(): void {
    const exportData = this.accounts.map(account => ({ ...account, isActive: false }));
    window.electronAPI.exportAccounts(exportData)
      .then(() => this.toastrService.success('Contas exportadas com sucesso!'))
      .catch(err => this.toastrService.error('Erro ao exportar', err.message));
  }

  importAccounts(): void {
    window.electronAPI.importAccounts()
      .then((imported: Account[]) => {
        this.accounts = [...this.accounts, ...imported];
        this.saveAccounts();
        this.toastrService.success('Contas importadas com sucesso!');
        localStorage.removeItem('local-git-configs');
        window.location.reload();
      })
      .catch(err => this.toastrService.error('Erro ao importar', err.message));
  }

}
