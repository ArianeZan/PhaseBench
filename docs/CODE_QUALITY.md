# Code Quality

PhaseBench treats automated checks as merge requirements rather than optional cleanup.

## Linting

Run the complete ESLint check from the repository root:

```bash
npm run lint
```

Apply safe automatic fixes with:

```bash
npm run lint:fix
```

The configuration uses the official Next.js Core Web Vitals and TypeScript flat-config presets. Warnings fail the command through `--max-warnings=0`, preventing known issues from accumulating silently.

Generated Next.js output, production output, and `next-env.d.ts` are ignored because they are not maintained source files. No lint rules are disabled by project configuration. A future suppression must be as narrow as possible and include an adjacent explanation of why compliant code is not practical.
