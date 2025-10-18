import { execa } from 'execa';
import Spinner from '../utils/spinner.js';

class DependencyInstaller {
  constructor(packageManager = 'npm') {
    this.packageManager = packageManager;
    this.spinner = new Spinner();
  }

  async install(projectPath) {
    const pmName = this.getPackageManagerName();
    this.spinner.start(
      `Installing dependencies with ${pmName} (this may take a minute)...`
    );

    try {
      const command = this.packageManager;
      const args = this.getInstallArgs();

      await execa(command, args, {
        cwd: projectPath,
        stdio: 'pipe',
      });

      this.spinner.succeed(
        `Dependencies installed successfully with ${pmName}`
      );
    } catch (error) {
      this.spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  getInstallArgs() {
    switch (this.packageManager) {
      case 'npm':
        return ['install'];
      case 'pnpm':
        return ['install'];
      case 'yarn':
        return ['install'];
      case 'bun':
        return ['install'];
      default:
        return ['install'];
    }
  }

  getPackageManagerName() {
    const names = {
      npm: 'npm',
      pnpm: 'pnpm',
      yarn: 'Yarn',
      bun: 'Bun',
    };
    return names[this.packageManager] || this.packageManager;
  }

  async detectPackageManager() {
    // Try to detect from lock files or use npm as default
    return 'npm';
  }
}

export default DependencyInstaller;
