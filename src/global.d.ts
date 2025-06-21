export { };

declare global {
  interface Window {
    electronAPI: {
      setGitConfig(config: { userName: string; userEmail: string; scope: 'local' | 'global' }): Promise<string>;
    };
  }
}
