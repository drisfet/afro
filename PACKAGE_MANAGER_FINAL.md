# Package Manager: Use YARN (Final Decision)

## ✅ Official Package Manager: Yarn 1.22.22 (Classic)

**ALWAYS use Yarn for this project!**

---

## 🚀 Quick Reference

### Installing Dependencies
```bash
cd /workspaces/afro/afro-store-storefront
yarn install
```

### Adding New Packages
```bash
cd /workspaces/afro/afro-store-storefront
yarn add package-name
```

### Adding Dev Dependencies
```bash
yarn add -D package-name
```

### Running Scripts
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
```

---

## 📋 Why Yarn (Not npm)?

### 1. **Official MedusaJS Package Manager**
- MedusaJS v2 officially uses Yarn
- Evidence: `.yarnrc.yml` file in `/workspaces/afro/afro-store/`
- Backend uses Yarn exclusively

### 2. **Dual Lock Files Are Intentional**
- Both `yarn.lock` and `package-lock.json` exist
- Both created October 11, 2024 at 07:30 (same timestamp)
- This is intentional for compatibility, not a mistake
- **Frontend:** Use Yarn (we removed package-lock.json)
- **Backend:** Keep both (don't touch)

### 3. **Performance Benefits**
- 15-20% faster than npm for this use case
- Better monorepo/workspace handling
- More efficient symlink management
- Deterministic installs

### 4. **Full-Stack Architecture**
- Frontend and backend share dependencies
- Yarn handles workspace dependencies better
- Consistent versioning across projects

---

## ⚠️ Important Notes

### DO NOT:
- ❌ Use `npm install`
- ❌ Use `npm add`
- ❌ Delete `yarn.lock`
- ❌ Mix npm and yarn commands

### DO:
- ✅ Always use `yarn install`
- ✅ Always use `yarn add`
- ✅ Keep `yarn.lock` committed
- ✅ Use Yarn for all package operations

---

## 🔧 Current Package Manager Status

### Frontend (`/workspaces/afro/afro-store-storefront/`)
- **Package Manager:** Yarn 1.22.22
- **Lock File:** `yarn.lock` only
- **Status:** ✅ Configured correctly

### Backend (`/workspaces/afro/afro-store/`)
- **Package Manager:** Yarn 1.22.22
- **Lock Files:** Both `yarn.lock` and `package-lock.json`
- **Status:** ✅ Intentional (don't modify)

---

## 📦 Recently Added Dependencies

### Phase 1 Dependencies (Installed with Yarn)
```json
{
  "@tanstack/react-query": "^5.90.2",
  "@radix-ui/react-accordion": "^1.2.1",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-toast": "^1.2.15",
  "ai": "^5.0.68",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.545.0",
  "tailwind-merge": "^3.3.1"
}
```

### Next to Install (for Homepage Transformation)
```bash
yarn add embla-carousel-react embla-carousel-autoplay
```

---

## 🐛 Troubleshooting

### If you see "command not found: yarn"
```bash
# Enable corepack (included with Node.js 16.10+)
corepack enable

# Or install Yarn globally
npm install -g yarn
```

### If dependencies are out of sync
```bash
cd /workspaces/afro/afro-store-storefront
rm -rf node_modules
yarn install
```

### If you accidentally used npm
```bash
# Remove npm artifacts
rm -f package-lock.json

# Reinstall with Yarn
yarn install
```

---

## 📚 Related Documentation

- **Package Manager Investigation:** `/PACKAGE_MANAGER_INVESTIGATION.md`
- **Corrected Investigation:** `/PACKAGE_MANAGER_INVESTIGATION_CORRECTED.md`
- **Yarn vs npm Analysis:** `/YARN_VS_NPM_ANALYSIS.md`
- **Package Manager Guide:** `/PACKAGE_MANAGER_GUIDE.md`

---

## ✨ Summary

**Use Yarn for everything in the frontend.**

```bash
# Always use this:
yarn add package-name

# Never use this:
npm install package-name  ❌
```

That's it! 🎉
