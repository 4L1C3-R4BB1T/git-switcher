export { };

declare global {
  interface Window {
    electronAPI: {
      setGitConfig: (config: {
        userName: string;
        userEmail: string;
        scope: 'local' | 'global';
        repoPath?: string;
      }) => Promise<string>;

      selectRepoDialog: () => Promise<string | null>;

      getGitConfig: (config: {
        scope: 'local' | 'global';
        repoPath?: string;
      }) => Promise<string>;

      resetGitConfig: (config: {
        scope: 'local' | 'global';
        repoPath?: string;
      }) => Promise<string>;

      exportAccounts: (accounts: any[]) => Promise<void>;

      importAccounts: () => Promise<any[]>;

      getCommits: (repoPath: string) => Promise<
        {
          author: string;
          message: string;
          date: string;
        }[]
      >;
    };
  }
}
