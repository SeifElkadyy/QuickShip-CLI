import { execa } from 'execa';
import Spinner from '../utils/spinner.js';

class DependencyInstaller {
  constructor(packageManager = 'npm') {
    this.packageManager = packageManager;
    this.spinner = new Spinner();
  }

  async install(projectPath) {
    this.spinner.start('Installing dependencies (this may take a minute)...');

    try {
      const command = this.packageManager;
      const args = this.packageManager === 'npm' ? ['install'] : [];

      await execa(command, args, {
        cwd: projectPath,
        stdio: 'pipe',
      });

      this.spinner.succeed('Dependencies installed successfully');
    } catch (error) {
      this.spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  async detectPackageManager() {
    // Try to detect from lock files or use npm as default
    return 'npm';
  }
}

export default DependencyInstaller;
