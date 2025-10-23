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
	@Input() account: Account = { id: 0, type: '', name: '', username: '', email: '', avatar_url: '' };

	@Input() linkedRepos: string[] = [];
	@Input() usedLocally: boolean = false;

	@Output() activateGlobal = new EventEmitter<void>();
	@Output() activateLocal = new EventEmitter<void>();
	@Output() edit = new EventEmitter<Account>();
	@Output() remove = new EventEmitter<number>();

	@Output() viewHistory = new EventEmitter<string>();

	getRepoName(path: string): string {
		return path.split(/[/\\]/).pop() ?? path;
	}

	viewCommits(repoPath: string): void {
		this.viewHistory.emit(repoPath);
	}
}
