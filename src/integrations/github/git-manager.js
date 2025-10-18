import simpleGit from 'simple-git';
import Spinner from '../../utils/spinner.js';

class GitManager {
  constructor(projectPath) {
    this.git = simpleGit(projectPath);
    this.spinner = new Spinner();
  }

  async isGitRepo() {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async init() {
    // Check if already a git repo
    const isRepo = await this.isGitRepo();
    if (isRepo) {
      this.spinner.start('Git repository already initialized');
      this.spinner.succeed('Git repository already initialized');
      return;
    }

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
      // Check if there are any commits already
      try {
        await this.git.log();
        // If log succeeds, there are already commits
        this.spinner.succeed('Initial commit already exists');
        return;
      } catch {
        // No commits yet, create initial commit
      }

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
