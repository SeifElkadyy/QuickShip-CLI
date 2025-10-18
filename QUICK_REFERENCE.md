# QuickShip CLI - Quick Reference Guide

Your go-to cheat sheet for building QuickShip CLI.

---

## 🚀 Quick Start Commands

```bash
# Start development
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## 📁 Project Structure

```
quickship-cli/
├── bin/
│   └── index.js              # CLI entry point
├── src/
│   ├── commands/
│   │   ├── build.js          # Main build command
│   │   ├── list.js           # List templates
│   │   ├── login.js          # User authentication (Phase 2)
│   │   └── config.js         # Configure settings
│   ├── core/
│   │   ├── engine.js         # Main orchestration
│   │   ├── template-manager.js
│   │   ├── dependency-installer.js
│   │   └── file-generator.js
│   ├── prompts/
│   │   ├── platform-selector.js
│   │   └── website-prompts.js
│   ├── integrations/
│   │   ├── github/
│   │   │   └── git-manager.js
│   │   └── deployment/
│   │       └── vercel.js     # (Phase 2)
│   ├── utils/
│   │   ├── logger.js
│   │   ├── spinner.js
│   │   ├── validator.js
│   │   └── error-handler.js
│   └── config/
│       └── templates.json
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
```

---

## 🛠️ Core Dependencies

### CLI Framework
```javascript
const { Command } = require('commander');      // CLI framework
const inquirer = require('inquirer');          // Interactive prompts
```

### UI & Output
```javascript
const chalk = require('chalk');                // Colored text
const ora = require('ora');                    // Spinners
const boxen = require('boxen');                // Boxes
```

### File Operations
```javascript
const fs = require('fs-extra');                // File system
const degit = require('degit');                // Clone repos
const { execa } = require('execa');            // Run commands
```

### Git
```javascript
const simpleGit = require('simple-git');       // Git operations
```

### Validation
```javascript
const validateName = require('validate-npm-package-name');
```

---

## 💻 Common Code Patterns

### Logger Usage

```javascript
const logger = require('../utils/logger');

logger.welcome();                    // Show banner
logger.success('Task completed!');   // ✓ green
logger.error('Something failed');    // ✗ red
logger.info('FYI');                  // ℹ blue
logger.warning('Be careful');        // ⚠ yellow
logger.box('Message', 'Title');      // Boxed message
```

### Spinner Usage

```javascript
const Spinner = require('../utils/spinner');

const spinner = new Spinner();
spinner.start('Loading...');
// ... do work
spinner.succeed('Done!');
// or
spinner.fail('Failed!');
```

### Inquirer Prompts

```javascript
const inquirer = require('inquirer');

// List selection
const { choice } = await inquirer.prompt([
  {
    type: 'list',
    name: 'choice',
    message: 'Select option:',
    choices: ['Option 1', 'Option 2', 'Option 3'],
  },
]);

// Text input
const { name } = await inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name:',
    default: 'my-project',
    validate: (input) => {
      return input.length > 0 ? true : 'Name is required';
    },
  },
]);

// Confirm (Yes/No)
const { confirmed } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'confirmed',
    message: 'Continue?',
    default: true,
  },
]);

// Checkbox (multiple selection)
const { features } = await inquirer.prompt([
  {
    type: 'checkbox',
    name: 'features',
    message: 'Select features:',
    choices: [
      { name: 'TypeScript', value: 'ts', checked: true },
      { name: 'ESLint', value: 'eslint', checked: true },
      { name: 'Prettier', value: 'prettier' },
    ],
  },
]);
```

### File Operations

```javascript
const fs = require('fs-extra');
const path = require('path');

// Check if file/directory exists
const exists = await fs.pathExists('/path/to/file');

// Read file
const content = await fs.readFile('/path/to/file', 'utf-8');

// Write file
await fs.writeFile('/path/to/file', 'content');

// Read JSON
const json = await fs.readJson('/path/to/file.json');

// Write JSON
await fs.writeJson('/path/to/file.json', { key: 'value' }, { spaces: 2 });

// Copy file/directory
await fs.copy('/source', '/destination');

// Remove file/directory
await fs.remove('/path/to/remove');

// Ensure directory exists (create if not)
await fs.ensureDir('/path/to/dir');
```

### Template Cloning

```javascript
const degit = require('degit');

const emitter = degit('user/repo', {
  cache: false,
  force: true,
});

await emitter.clone('/destination/path');
```

### Running Commands

```javascript
const { execa } = require('execa');

// Basic command
await execa('npm', ['install'], {
  cwd: '/project/path',
  stdio: 'inherit', // Show output in terminal
});

// Capture output
const { stdout } = await execa('git', ['status']);
console.log(stdout);

// With environment variables
await execa('npm', ['run', 'build'], {
  env: { NODE_ENV: 'production' },
});
```

### Git Operations

```javascript
const simpleGit = require('simple-git');

const git = simpleGit('/project/path');

// Initialize repo
await git.init();

// Add files
await git.add('.');
// or specific files
await git.add(['file1.js', 'file2.js']);

// Commit
await git.commit('Commit message');

// Add remote
await git.addRemote('origin', 'https://github.com/user/repo.git');

// Push
await git.push('origin', 'main', { '--set-upstream': null });

// Check if git is installed
try {
  await git.version();
  console.log('Git is installed');
} catch {
  console.log('Git is not installed');
}
```

### Error Handling

```javascript
const ErrorHandler = require('../utils/error-handler');

try {
  // ... risky operation
} catch (error) {
  ErrorHandler.handle(error, verbose);
  process.exit(1);
}

// Or wrap async functions
await ErrorHandler.wrapAsync(
  async () => {
    // ... risky operation
  },
  'Error message to show',
  verbose
);
```

---

## 🧪 Testing Patterns

### Unit Test Template

```javascript
// tests/unit/example.test.js
const functionToTest = require('../../src/utils/example');

describe('Function Name', () => {
  test('should do something', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected output');
  });

  test('should handle edge case', () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

### Integration Test Template

```javascript
// tests/integration/example.test.js
const fs = require('fs-extra');
const path = require('path');

describe('Integration Test', () => {
  const testDir = path.join(__dirname, '../temp');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  test('should complete workflow', async () => {
    // ... test logic
  });
});
```

---

## 🎨 CLI Color Reference

```javascript
const chalk = require('chalk');

console.log(chalk.green('Success'));      // Green text
console.log(chalk.red('Error'));          // Red text
console.log(chalk.blue('Info'));          // Blue text
console.log(chalk.yellow('Warning'));     // Yellow text
console.log(chalk.cyan('Highlight'));     // Cyan text
console.log(chalk.gray('Dimmed'));        // Gray text

// Combinations
console.log(chalk.green.bold('Bold Success'));
console.log(chalk.red.underline('Underlined Error'));
console.log(chalk.blue.italic('Italic Info'));

// Background
console.log(chalk.bgGreen.black(' SUCCESS '));
console.log(chalk.bgRed.white(' ERROR '));
```

---

## 📦 package.json Scripts

```json
{
  "scripts": {
    "dev": "node bin/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\"",
    "prepublishOnly": "npm test && npm run lint"
  }
}
```

---

## 🔍 Debugging Tips

### Debug CLI in VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/bin/index.js",
      "args": ["build", "test-project"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Debugging

```javascript
// Add debug logs
console.log('DEBUG:', variable);
console.dir(object, { depth: null });
console.trace('Trace point');

// JSON stringify for complex objects
console.log(JSON.stringify(object, null, 2));
```

### Test Specific File

```bash
npm test -- tests/unit/validator.test.js
```

---

## 🚨 Common Errors & Solutions

### "Cannot find module"
**Solution:** Run `npm install`

### "Permission denied"
**Solution:**
```bash
chmod +x bin/index.js
```

### "EACCES: permission denied"
**Solution:** Don't use sudo. Change directory permissions or run in user directory.

### "EEXIST: file already exists"
**Solution:** Delete existing directory or use different name.

### "Command not found: quickship"
**Solution:** Use `node bin/index.js` or run `npm link`

### Git errors
**Solution:** Check Git is installed: `git --version`

---

## 📝 Git Commit Message Convention

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(cli): add build command
fix(template): resolve cloning issue
docs(readme): add installation instructions
test(validator): add unit tests for project name validation
```

---

## 🎯 Phase Checklist

### Phase 1 (MVP) - Week by Week

**Week 1:**
- [ ] Project setup complete
- [ ] Basic CLI commands work
- [ ] Prompts system functional
- [ ] Template manager implemented

**Week 2:**
- [ ] Git integration working
- [ ] Build command complete
- [ ] End-to-end flow successful
- [ ] First project generated

**Week 3:**
- [ ] Error handling comprehensive
- [ ] Tests written and passing
- [ ] Documentation complete

**Week 4:**
- [ ] Template repository created
- [ ] Cross-platform testing done
- [ ] Published to npm
- [ ] Ready for launch

---

## 🔗 Important Links

### Documentation
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [Chalk](https://github.com/chalk/chalk)
- [Degit](https://github.com/Rich-Harris/degit)
- [Execa](https://github.com/sindresorhus/execa)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)

### Tools
- [npm](https://www.npmjs.com)
- [Jest](https://jestjs.io)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

---

## 💡 Quick Tips

1. **Test often:** Run your CLI after every change
2. **Commit early:** Small commits are easier to debug
3. **Read errors:** Error messages usually tell you exactly what's wrong
4. **Use verbose mode:** Add `-v` flag for detailed logs
5. **Check dependencies:** Run `npm list` to see what's installed
6. **Clean node_modules:** When in doubt, delete and reinstall
7. **Use console.log:** Don't be afraid to debug with print statements
8. **Google errors:** Someone else has probably hit the same issue
9. **Take breaks:** Fresh eyes catch bugs faster
10. **Celebrate wins:** Every working feature is progress!

---

## 🎬 Next Steps

**Just starting?**
→ Read `GETTING_STARTED.md`

**Ready to build?**
→ Follow `IMPLEMENTATION_ROADMAP.md`

**Want to track progress?**
→ Use `PROGRESS_TRACKER.md`

**Need help?**
→ Check the main documentation or this reference

---

**Remember:** Every expert was once a beginner. Every successful CLI started with `console.log('Hello, world!')`. You've got this! 🚀

---

Last Updated: 2025-01-XX
Version: 1.0.0
