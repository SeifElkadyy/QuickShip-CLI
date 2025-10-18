import validatePackageName from 'validate-npm-package-name';
import { pathExists } from 'fs-extra';

const validator = {
  validateProjectName(name) {
    const validation = validatePackageName(name);

    if (!validation.validForNewPackages) {
      const errors = [
        ...(validation.errors || []),
        ...(validation.warnings || []),
      ];
      return {
        valid: false,
        errors,
      };
    }

    return { valid: true };
  },

  async validatePath(projectPath) {
    const exists = await pathExists(projectPath);
    if (exists) {
      return {
        valid: false,
        error: `Directory ${projectPath} already exists`,
      };
    }
    return { valid: true };
  },

  validateTemplate(template, availableTemplates) {
    if (!availableTemplates.includes(template)) {
      return {
        valid: false,
        error: `Template "${template}" not found`,
      };
    }
    return { valid: true };
  },
};

export default validator;
