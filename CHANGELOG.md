# Changelog

All notable changes to QuickShip CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
