import simpleGit from 'simple-git';
import { pathExists } from 'fs-extra';
import { join } from 'path';
import Spinner from '../../utils/spinner.js';

class GitManager {
  constructor(projectPath) {
    // baseDir + --no-walking prevents simple-git from ascending to parent repos
    this.git = simpleGit({ baseDir: projectPath, binary: 'git', maxConcurrentProcesses: 1 });
    this.projectPath = projectPath;
    this.spinner = new Spinner();
  }

  async isGitRepo() {
    // Check for .git directly — simple-git.status() walks upward and finds parent repos
    return pathExists(join(this.projectPath, '.git'));
  }

  async init() {
    const isRepo = await this.isGitRepo();
    if (isRepo) return;

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
