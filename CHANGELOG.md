# Changelog

All notable changes to QuickShip CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
