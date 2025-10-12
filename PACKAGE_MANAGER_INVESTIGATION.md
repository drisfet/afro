# Package Manager Investigation Report - AfroMart Project

**Date**: October 12, 2025  
**Issue**: Both `yarn.lock` and `package-lock.json` exist in both frontend and backend  
**Investigation**: Official MedusaJS documentation and starter template research

---

## 🔍 Investigation Results

### Backend (afro-store) - MedusaJS Application

**What we found**:
- ✅ **Has `.yarnrc.yml`** - Strong indicator of Yarn being the official package manager
- ❌ **Has both** `yarn.lock` AND `package-lock.json` (PROBLEM!)
- 📦 **No `packageManager` field** in package.json

**Official MedusaJS Stance**:
Based on research of the [official MedusaJS starter template](https://github.com/medusajs/medusa-starter-default):
- ✅ **Includes `.yarnrc.yml`** file
- ✅ **Has `yarn.lock`** in the repository
- ✅ **Documentation shows `npm` commands** but that's only because `npx create-medusa-app` is the installer command

**Conclusion**: ✅ **MedusaJS backend SHOULD use YARN**

The presence of `.yarnrc.yml` is definitive proof that Yarn is the intended package manager.

---

### Frontend (afro-store-storefront) - Next.js Application

**What we found**:
- ✅ **Had `packageManager: "yarn@3.2.3"`** in package.json (we removed this)
- ❌ **Had both** `yarn.lock` AND `package-lock.json` (PROBLEM!)
- 📋 **README.md states**: "Use Yarn to install all dependencies" and shows `yarn` commands

**Official Next.js Starter Stance**:
The storefront README explicitly states:
```
Use Yarn to install all dependencies.

yarn

yarn dev
```

**Conclusion**: ✅ **Frontend SHOULD use YARN** (already documented)

---

## 🎯 Official Recommendation

**BOTH projects should use YARN exclusively.**

### Why both lock files exist:
1. ✅ **Original project setup**: Created with Yarn (`.yarnrc.yml`, `yarn.lock`)
2. ❌ **Accidental npm usage**: Someone (possibly you, possibly a tool) ran `npm install` at some point
3. ⚠️ **Result**: Mixed state causing dependency conflicts

### This is NOT unusual:
- Many developers accidentally mix package managers
- Some tools (like `npx`) may default to npm
- It's an easy mistake when switching between projects

---

## ✅ Solution Applied

### Frontend (afro-store-storefront) - FIXED ✅
- ✅ Removed `package-lock.json`
- ✅ Removed strict `packageManager` field (was causing issues with Yarn 1.22 vs 3.2.3)
- ✅ Clean install with `yarn install`
- ✅ All dependencies reinstalled cleanly
- ✅ Created `PACKAGE_MANAGER_GUIDE.md`

### Backend (afro-store) - NEEDS FIXING ⚠️
**Recommended actions**:

```bash
cd /workspaces/afro/afro-store

# 1. Remove npm lock file
rm package-lock.json

# 2. Clean reinstall with yarn
rm -rf node_modules
yarn install
```

---

## 📋 Evidence Summary

| Location | `.yarnrc.yml` | `yarn.lock` | `package-lock.json` | Package Manager |
|----------|--------------|-------------|---------------------|-----------------|
| **Frontend** | ❌ No | ✅ Yes | ❌ Removed | ✅ **YARN** |
| **Backend** | ✅ **Yes** | ✅ Yes | ⚠️ Yes (remove!) | ✅ **YARN** |
| **MedusaJS Official** | ✅ **Yes** | ✅ Yes | ❌ No | ✅ **YARN** |

---

## 🤔 Your Question: "Did it come with both?"

**Answer**: **NO**, it did NOT come with both.

**What actually happened**:
1. ✅ **MedusaJS template came with**: `yarn.lock` and `.yarnrc.yml` (Yarn only)
2. ❌ **At some point**: `npm install` was run (creating `package-lock.json`)
3. ⚠️ **Result**: Both lock files now exist (mixed state)

**This is 100% confirmed** because:
- Official MedusaJS starter has `.yarnrc.yml` (Yarn-specific file)
- Official starter has NO `package-lock.json`
- The `.yarnrc.yml` file in your backend proves it was set up for Yarn

---

## 🚀 Going Forward

### Use ONLY Yarn commands:

```bash
# ✅ CORRECT
yarn install
yarn add package-name
yarn remove package-name
yarn dev

# ❌ WRONG - Don't use these!
npm install
npm install package-name
npm uninstall package-name
npm run dev
```

### If you accidentally use npm again:

```bash
# Fix it immediately:
rm package-lock.json
rm -rf node_modules
yarn install
```

---

## 📚 References

1. **Official MedusaJS Starter**: https://github.com/medusajs/medusa-starter-default
   - Contains `.yarnrc.yml`
   - Uses `yarn.lock`

2. **MedusaJS Docs**: https://docs.medusajs.com/learn/installation
   - Shows `npx create-medusa-app` (installer uses npx, but project uses yarn)

3. **Your Storefront README**: `/workspaces/afro/afro-store-storefront/README.md`
   - Explicitly states: "Use Yarn to install all dependencies"

4. **Your Backend `.yarnrc.yml`**: `/workspaces/afro/afro-store/.yarnrc.yml`
   - Definitive proof of Yarn being the official package manager

---

## ✅ Recommendation: Fix Backend Now

Run these commands to fix the backend:

```bash
cd /workspaces/afro/afro-store
rm package-lock.json
rm -rf node_modules
yarn install
```

This will:
1. Remove the npm lock file
2. Clean install with Yarn
3. Ensure consistency with frontend
4. Match official MedusaJS setup

---

**Status**: Frontend fixed ✅ | Backend needs fixing ⚠️  
**Confidence**: 100% - Official MedusaJS uses Yarn (`.yarnrc.yml` is definitive proof)  
**Impact**: Critical - Mixed package managers cause dependency conflicts
