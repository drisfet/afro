# Package Manager Guide - AfroMart Sydney

## ⚠️ IMPORTANT: Use YARN Only!

This project uses **Yarn 1.22.22** as its package manager.

### Why Yarn?
- Project was initially configured for Yarn
- Consistent dependency resolution
- Better performance for this project structure
- MedusaJS documentation examples use Yarn

---

## ✅ CORRECT Commands (Use These)

### Installing Dependencies
```bash
# Install all dependencies
yarn install

# Add a new package
yarn add package-name

# Add a dev dependency
yarn add -D package-name

# Remove a package
yarn remove package-name
```

### Running Scripts
```bash
# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

---

## ❌ WRONG Commands (Don't Use These)

```bash
# DON'T use npm install
npm install  # ❌ Wrong!

# DON'T use npm add
npm install package-name  # ❌ Wrong!

# DON'T use npx with npm
npm run dev  # ❌ Wrong!
```

---

## 🔧 What We Fixed

### The Problem
- Project had BOTH `yarn.lock` and `package-lock.json`
- This caused dependency conflicts
- Some commands were run with npm, others with yarn
- Result: Inconsistent dependency tree

### The Solution
1. ✅ Removed `package-lock.json`
2. ✅ Removed `packageManager` field enforcing Yarn 3.2.3
3. ✅ Using Yarn 1.22.22 (globally available)
4. ✅ Clean reinstall with `yarn install`
5. ✅ All future installs use `yarn add`

---

## 📋 Yarn Commands Cheat Sheet

### Package Management
```bash
# List installed packages
yarn list

# Check for outdated packages
yarn outdated

# Upgrade packages
yarn upgrade package-name

# Upgrade all packages
yarn upgrade

# Clean cache
yarn cache clean
```

### Workspace Commands (for monorepo)
```bash
# Install in specific workspace
yarn workspace afro-store add package-name

# Run script in specific workspace
yarn workspace afro-store dev
```

### Useful Flags
```bash
# Install with exact versions
yarn add package-name --exact

# Install ignoring scripts
yarn install --ignore-scripts

# Force reinstall
yarn install --force
```

---

## 🚨 If You Accidentally Use npm

If you accidentally run an npm command:

```bash
# 1. Remove npm lock file
rm package-lock.json

# 2. Clean install with yarn
rm -rf node_modules
yarn install
```

---

## ✨ Benefits of Yarn

1. **Faster installs** - Parallel downloads
2. **Offline mode** - Cached packages work offline
3. **Deterministic** - Same dependencies every time
4. **Security** - Checksums verify package integrity
5. **Workspaces** - Better monorepo support

---

## 📚 Official Documentation

- Yarn v1: https://classic.yarnpkg.com/
- Yarn Commands: https://classic.yarnpkg.com/en/docs/cli/

---

**Last Updated**: October 12, 2025  
**Yarn Version**: 1.22.22  
**Project**: AfroMart Sydney Storefront
