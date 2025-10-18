import simpleGit from 'simple-git';
import Spinner from '../../utils/spinner.js';

class GitManager {
  constructor(projectPath) {
    this.git = simpleGit(projectPath);
    this.spinner = new Spinner();
  }

  async init() {
    this.spinner.start('Initializing Git repository');

    try {
      await this.git.init();
      this.spinner.succeed('Git repository initialized');
    } catch (error) {
      this.spinner.fail('Failed to initialize Git');
      throw error;
    }
  }

  async createInitialCommit() {
    this.spinner.start('Creating initial commit');

    try {
      await this.git.add('.');
      await this.git.commit('Initial commit from QuickShip 🚀');
      this.spinner.succeed('Initial commit created');
    } catch (error) {
      this.spinner.fail('Failed to create commit');
      throw error;
    }
  }

  async isGitInstalled() {
    try {
      await this.git.version();
      return true;
    } catch {
      return false;
    }
  }
}

export default GitManager;
