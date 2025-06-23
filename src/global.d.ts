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
      getGitConfig: (scope: 'local' | 'global') => Promise<string>;
      resetGitConfig: (scope: 'local' | 'global') => Promise<string>;
    };
  }
}
