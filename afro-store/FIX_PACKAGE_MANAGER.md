# Backend Package Manager Fix Script

**IMPORTANT**: The backend (afro-store) also has the same issue!

## Files Found:
- ✅ `.yarnrc.yml` (proves Yarn is official)
- ✅ `yarn.lock`
- ❌ `package-lock.json` (SHOULD NOT BE HERE)

## Run These Commands:

```bash
cd /workspaces/afro/afro-store

# Remove npm lock file
rm package-lock.json

# Optional: Clean reinstall (recommended)
# rm -rf node_modules
# yarn install
```

## Why This Matters:
Having both lock files causes:
1. Dependency version conflicts
2. Installation failures
3. Inconsistent builds between developers
4. Potential security vulnerabilities from mismatched packages

## After Fixing:
- ONLY use `yarn` commands in backend
- Never use `npm install`
- Check `.yarnrc.yml` confirms Yarn configuration

---

**Created**: October 12, 2025  
**Status**: Awaiting execution
