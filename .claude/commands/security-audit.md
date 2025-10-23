---
description: Run comprehensive security audit for the WordPress plugin
---

Perform a comprehensive security audit of the DesignSetGo WordPress plugin by:

1. Run npm audit to check for vulnerabilities in dependencies
2. Run npm run check-licenses to verify GPL-compatible licenses
3. Analyze the results and provide a summary report including:
   - Total number of vulnerabilities (by severity: critical, high, moderate, low)
   - Any license compliance issues
   - Recommended actions to fix issues
4. If vulnerabilities are found, suggest specific fixes:
   - Packages that need updating
   - Whether to use `npm audit fix` or `npm audit fix --force`
   - Any manual overrides needed in package.json
5. Verify the plugin is ready for WordPress.org submission from a security/licensing perspective

Security checklist to verify:
- ✅ Zero npm vulnerabilities
- ✅ All dependencies use GPL-compatible licenses
- ✅ No deprecated packages with known security issues
- ✅ Dependencies are up-to-date with security patches

Provide a clear "PASS" or "FAIL" status at the end with next steps if needed.
