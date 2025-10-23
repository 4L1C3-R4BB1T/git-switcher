export interface GitCommit {
    author: string;
    message: string;
    date: string;
};

export interface GitConfigSetArgs {
    userName: string;
    userEmail: string;
    scope: 'local' | 'global';
    repoPath?: string;
};

export interface GitConfigGetArgs {
    scope: 'local' | 'global';
    repoPath?: string;
};

export interface LocalGitConfig {
	repoPath: string;
	accountId: number;
}
