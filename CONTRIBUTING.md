# Contributing to Afro

Thank you for your interest in contributing to Afro! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others in the community
- Follow best practices

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Any relevant examples

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/afro.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run build
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   Commit message format:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for changes to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes
   - Wait for review

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### File Organization

```
├── backend/
│   ├── src/           # Source code
│   ├── data/          # Seed data
│   └── uploads/       # User uploads
├── storefront/
│   ├── src/
│   │   ├── pages/     # Next.js pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities
│   │   └── styles/    # Global styles
│   └── public/        # Static assets
```

### Component Guidelines

- Use functional components with hooks
- Keep components focused on single responsibility
- Use TypeScript interfaces for props
- Extract reusable logic into custom hooks
- Use proper prop-types or TypeScript types

Example:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  );
}
```

### Testing

- Write unit tests for utilities
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Aim for >80% code coverage

### Documentation

- Update README.md for major changes
- Document all public APIs
- Include JSDoc comments for functions
- Update SETUP.md for new dependencies

## Project Structure

### Backend (Medusa)

The backend follows Medusa's architecture:
- **API Routes**: Define in `src/api`
- **Services**: Business logic in `src/services`
- **Models**: Data models in `src/models`
- **Migrations**: Database migrations

### Storefront (Next.js)

The storefront follows Next.js conventions:
- **Pages**: File-based routing in `src/pages`
- **Components**: Reusable components in `src/components`
- **Hooks**: Custom hooks in `src/hooks`
- **Utils**: Helper functions in `src/lib`

## Best Practices

### Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user input
- Use HTTPS in production
- Keep dependencies up to date

### Performance

- Optimize images
- Use lazy loading
- Minimize bundle size
- Cache appropriately
- Use server-side rendering when beneficial

### Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast
- Support screen readers

### SEO

- Use proper meta tags
- Implement structured data
- Create XML sitemaps
- Use descriptive URLs
- Optimize page load times

## Questions?

If you have questions about contributing:
- Check existing issues and PRs
- Ask in the discussions section
- Reach out to maintainers

Thank you for contributing to Afro! 🎉
