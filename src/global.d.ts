export { };

declare global {
  interface Window {
    electronAPI: {
      setGitConfig(config: {
        userName: string;
        userEmail: string;
        scope: 'local' | 'global';
        repoPath?: string;
      }): Promise<string>;
      selectRepoDialog(): Promise<string | null>;
      getGitConfig(config: {
        scope: 'local' | 'global';
        repoPath?: string;
      }): Promise<string>;
      resetGitConfig(config: {
        scope: 'local' | 'global';
        repoPath?: string;
      }): Promise<string>;
      exportAccounts(data: any[]): Promise<string>;
      importAccounts(): Promise<any[]>;
    };
  }
}
