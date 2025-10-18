# Changelog

All notable changes to QuickShip CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.2] - 2025-01-19

### Documentation
- **Completely redesigned README** with comprehensive documentation
- Added detailed template descriptions for all 4 templates
- Template comparison table for easy decision-making
- Real-world examples for Next.js, T3 Stack, Vite, and MERN
- Comprehensive troubleshooting guide
- Updated badges with npm downloads and version
- Better structured sections with emojis and formatting

## [0.7.1] - 2025-01-19

### Improved
- **Enhanced success messages** with stack-specific setup instructions
- MERN Stack now shows MongoDB configuration steps (`.env` setup, connection URI)
- T3 Stack now shows Prisma database setup steps
- Clearer port information for different stacks (Vite: 5173, Next.js: 3000, MERN: both)
- Better user experience with important warnings for required configuration
- **Better installation feedback** - Show live npm output during MERN Stack installations
- Users can now see real-time progress instead of frozen spinners
- Clear labels for each installation step (backend, frontend, Tailwind, root dependencies)

## [0.7.0] - 2025-01-19

### Added
- **🎉 NEW: MERN Stack Template** - Full-stack MongoDB + Express + React + Node.js
- Client/server monorepo structure with separate package.json files
- Express backend with Mongoose ODM, JWT auth, and bcryptjs
- React frontend using Vite with TypeScript and Tailwind CSS support
- Axios for API calls, React Router for navigation
- Concurrently for running both client and server with one command
- Complete README with setup instructions and MongoDB configuration
- Environment variable templates (.env.example)

### Features
- 4 production-ready templates now available (Next.js, Vite, T3 Stack, MERN)
- MERN Stack includes:
  - Express.js server with proper project structure (routes, models, controllers, middleware)
  - MongoDB connection with Mongoose
  - CORS and security middleware
  - JWT authentication setup
  - React + Vite frontend
  - Root scripts to run both client/server together

## [0.6.2] - 2025-01-19

### Fixed
- **CRITICAL:** Fixed Tailwind CSS v4 PostCSS plugin error for Vite projects
- Now installs `@tailwindcss/postcss` package (required for Tailwind v4)
- Updated postcss.config.js to use `@tailwindcss/postcss` instead of `tailwindcss`
- Tailwind CSS now works correctly with Vite without PostCSS errors

## [0.6.1] - 2025-01-19

### Fixed
- Fixed Tailwind CSS initialization failing with "could not determine executable to run"
- Now creates tailwind.config.js and postcss.config.js manually instead of using `npx tailwindcss init`
- Tailwind setup now works reliably for Vite projects

## [0.6.0] - 2025-01-19

### Fixed
- **CRITICAL:** Fixed Vite dependencies not being installed - now installs manually after scaffolding
- **CRITICAL:** Fixed Vite dev server auto-starting and blocking CLI completion
- Changed Vite creation to use `stdio: 'pipe'` to avoid interactive prompts
- CLI now completes successfully after Vite project creation

### Added
- **Tailwind CSS support for Vite projects** - automatically configures Tailwind when selected
- Automatic installation of tailwindcss, postcss, and autoprefixer for Vite
- Auto-generation of tailwind.config.js and postcss.config.js
- Tailwind directives automatically added to index.css

### Changed
- Vite template now manually installs dependencies after scaffolding
- Vite template creation no longer shows interactive prompts during setup
- Dependencies are installed but dev server is not auto-started
- Improved Vite project setup with proper Tailwind CSS integration

## [0.5.8] - 2025-01-19

### Fixed
- **CRITICAL:** Fixed Vite template not creating project folder - now runs `create-vite` in parent directory
- Fixed `create-vite` invocation to properly create project directory with correct working directory

### Changed
- Improved error logging for Vite template creation failures

## [0.5.7] - 2025-01-19

### Fixed
- Improved Git initialization error handling - now shows warning instead of failing build
- Vite template builds complete successfully even if Git initialization encounters issues
- Added verbose error logging for Git initialization failures

### Changed
- Git initialization wrapped in try-catch to prevent build failures
- Better error messages for Git-related issues

## [0.5.6] - 2025-01-19

### Fixed
- Fixed T3 Stack `--npm` flag error - T3 CLI doesn't support package manager flags in CI mode
- Fixed Vite Git error - now detects existing commits before trying to create initial commit
- Simplified T3 Stack creation to use default npm with all features enabled

### Changed
- Removed package manager flags from T3 Stack (not supported in CI mode)
- Git manager now checks for existing commits before creating initial commit

## [0.5.5] - 2025-01-19

### Fixed
- Fixed T3 Stack creation - now uses `npx --yes create-t3-app@latest` with proper flags
- Added `--npm`, `--pnpm`, `--yarn`, `--bun` flags for package manager selection
- Changed from `npm create` to `npx` to avoid npm config parsing errors
- Fixed TTY initialization error by using correct T3 CLI invocation

## [0.5.4] - 2025-01-19

### Fixed
- Fixed Git initialization error for Vite projects (Vite auto-creates Git repo)
- Added check to detect if Git is already initialized before trying to init
- Prevents "Git error" when template already has Git initialized

## [0.5.3] - 2025-01-19

### Fixed
- Fixed shadcn/ui initialization hanging - changed flags from `-y --defaults` to `-d -y`
- Changed shadcn init to use `stdio: 'inherit'` to show progress and avoid hanging
- Improved user feedback during shadcn installation

## [0.5.2] - 2025-01-19

### Fixed
- Fixed Vite template README.md generation error (skip file generation for tool-created templates)
- Fixed T3 Stack package manager detection - now uses proper create command (npm/pnpm/yarn/bun create)
- Skip README and .gitignore generation for all tool-generated templates (they create their own)

## [0.5.1] - 2025-01-19

### Fixed
- Fixed ESM import issue in `quickship add` command with fs-extra
- Fixed React + Vite template generation skipping package.json update
- Fixed T3 Stack package manager flag (changed from `--use-npm` to `-p npm`)
- Skip package.json update for all tool-generated templates to avoid conflicts

## [0.5.0] - 2025-01-19

### Added
- **`quickship add` Command:** Extensibility system to add features to existing projects
- `quickship add shadcn` - Add shadcn/ui to existing Next.js projects
- `quickship add auth` - Add NextAuth.js authentication
- `quickship add database` - Add Prisma ORM with database setup
- Automatic project type detection (Next.js, React + Vite, React)
- Helpful next-steps guidance after adding features

### Features
- Add features to existing projects without recreating them
- Support for shadcn/ui, NextAuth.js, and Prisma
- Interactive installation with progress feedback
- Smart detection of project framework

## [0.4.0] - 2025-01-19

### Added
- **React + Vite Template:** Fast SPA development with Vite, React, TypeScript, and Tailwind CSS
- **T3 Stack Template:** Full-stack Next.js with tRPC, Prisma, NextAuth, and Tailwind CSS
- **shadcn/ui Integration:** Optional shadcn/ui component library for Next.js projects
- Three template options now available: Next.js, React + Vite, T3 Stack
- Automatic template selection in prompts

### Changed
- Updated stack selection prompt with clear descriptions
- Template manager now supports multiple creation tools (create-next-app, create-vite, create-t3-app)
- Improved dependency installation logic to handle all template types

## [0.3.0] - 2025-01-19

### Added
- **Package Manager Choice:** Users can now choose between npm, pnpm, yarn, or bun
- Interactive prompt for package manager selection
- CLI flag `--package-manager <pm>` or `-p <pm>` to specify package manager
- Success message now shows correct commands for chosen package manager (e.g., `pnpm dev` vs `npm run dev`)
- Automatic package manager detection in `create-next-app`

### Changed
- DependencyInstaller now supports all major package managers
- Success message dynamically adjusts based on selected package manager

## [0.2.0] - 2025-01-19

### Changed
- **MAJOR:** Switched from static templates to using `create-next-app@latest` for Next.js projects
- Now generates projects with the latest versions of Next.js, React, and all dependencies
- Projects now use Next.js 15.5.6+ and React 19 (latest stable versions)
- Improved template generation reliability and maintainability

### Added
- Automatic detection of create-next-app usage to skip redundant dependency installation
- Support for both create-next-app and degit-based templates

### Fixed
- Outdated package versions (Next.js 13 → 15, React 18.2 → 19)
- Template now always uses the latest official Next.js configuration

## [0.1.3] - 2025-01-19

### Fixed
- Fixed template cloning error by switching to shadcn-ui/next-template
- Resolved "could not find commit hash for HEAD" error
- Updated template source to use standalone repository instead of monorepo subdirectory

### Changed
- Template now uses shadcn-ui/next-template for more reliable cloning
- Includes shadcn/ui components setup out of the box

## [0.1.2] - 2025-01-19

### Fixed
- Fixed npm publish script compatibility on Windows
- Updated lint and format scripts to use `node` command directly
- Improved cross-platform script execution

## [0.1.1] - 2025-01-19

### Changed
- Updated repository URLs to actual GitHub repository

## [0.1.0] - 2025-01-19

### Added
- Initial release of QuickShip CLI
- Interactive CLI with beautiful UI
- Platform selection menu (Website focus for MVP)
- Next.js project template with TypeScript and Tailwind CSS
- Automated dependency installation
- Git repository initialization
- Project name validation
- Custom README generation
- .gitignore generation
- Comprehensive error handling
- Loading spinners and progress indicators
- Colored console output
- Template listing command
- Build command with multiple options
- Support for `--no-git` and `--no-install` flags
- Verbose mode for debugging

### Features
- Create production-ready Next.js projects in under 60 seconds
- Beautiful interactive prompts
- Automatic Git setup with initial commit
- Professional project structure
- TypeScript support
- Tailwind CSS integration
- ESLint and Prettier configuration

### Commands
- `quickship build [project-name]` - Create a new project
- `quickship list` - List available templates
- `quickship --help` - Show help
- `quickship --version` - Show version

### Template Support
- Next.js with TypeScript and Tailwind CSS

### Developer Experience
- Modular architecture for easy extension
- Comprehensive error messages
- Input validation
- Cross-platform support (Windows, macOS, Linux)
- ESM modules (modern JavaScript)

## [Unreleased]

### Planned for v0.2.0 (Phase 2)
- User authentication system
- GitHub OAuth integration
- Automated deployment to Vercel/Netlify
- Database integrations (Supabase, MongoDB)
- Authentication providers (Clerk, NextAuth)
- Payment integration (Stripe)
- Pro tier features
- Additional templates (React + Vite, MERN Stack)

### Planned for v0.3.0 (Phase 3)
- Browser extension templates
- Mobile app templates (React Native + Expo)
- API/Backend templates (Express, Fastify, NestJS)
- Desktop app templates (Electron, Tauri)

### Planned for v0.4.0 (Phase 4)
- Custom template creation
- Template marketplace
- Team features
- Enterprise tier
- Advanced customization

---

[0.1.0]: https://github.com/yourusername/quickship-cli/releases/tag/v0.1.0
