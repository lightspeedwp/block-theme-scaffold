---
title: Security Policy
description: Security vulnerability reporting and response policy
category: Project
type: Policy
audience: Developers, Security Researchers
date: 2025-12-01
---

## Supported Versions

We actively support the following versions of {{theme_name}}:

| Version | Supported          |
| ------- | ------------------ |
| {{version}}.x   | ✅ |
| < {{version}}.0   | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in {{theme_name}}, please report it responsibly:

### Where to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please send an email to: **{{security_email}}**

### What to Include

When reporting a security vulnerability, please include:

1. **Description**: A clear description of the vulnerability
2. **Impact**: What an attacker could achieve
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Affected Versions**: Which versions are affected
5. **Suggested Fix**: If you have ideas for a fix (optional)
6. **Your Contact Information**: So we can follow up with you

### Our Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 24 hours
2. **Assessment**: We'll assess the vulnerability within 72 hours
3. **Timeline**: We'll provide an estimated timeline for a fix
4. **Updates**: We'll keep you informed of our progress
5. **Resolution**: We'll notify you when the vulnerability is fixed
6. **Disclosure**: We'll coordinate responsible disclosure

### Timeline Expectations

- **Critical vulnerabilities**: Fixed within 7 days
- **High severity**: Fixed within 14 days
- **Medium severity**: Fixed within 30 days
- **Low severity**: Fixed in next regular release

## Security Best Practices

When using {{theme_name}}, we recommend:

### For Site Administrators

- Keep WordPress core updated
- Keep the theme updated to the latest version
- Use strong passwords and two-factor authentication
- Regular security audits
- Proper file permissions
- Regular backups

### For Developers

- Follow WordPress security best practices
- Sanitize and validate all user inputs
- Use nonces for form submissions
- Escape output properly
- Follow principle of least privilege
- Regular security code reviews

## Known Security Features

{{theme_name}} includes these security features:

- **Input Sanitization**: All user inputs are properly sanitized
- **Output Escaping**: All output is properly escaped
- **Nonce Verification**: Forms use WordPress nonces
- **Security Headers**: Basic security headers are included
- **No Direct File Access**: PHP files prevent direct access
- **WordPress Standards**: Follows WordPress security guidelines

## Reporting Security Issues in Dependencies

If you find security issues in our dependencies:

1. **WordPress Core**: Report to [WordPress Security Team](https://make.wordpress.org/core/handbook/testing/reporting-security-vulnerabilities/)
2. **Third-party Libraries**: Report to the respective maintainers
3. **Our Theme**: Follow our reporting process above

## Security Updates

Security updates will be:

- Released as soon as possible
- Documented in the changelog
- Announced on our security advisory page
- Backwards compatible when possible

## Hall of Fame

We recognize security researchers who responsibly disclose vulnerabilities:

<!-- Security researchers will be listed here -->
*No vulnerabilities reported yet*

## Contact

For security-related questions or concerns:

- **Email**: {{security_email}}
- **GPG Key**: [Available upon request]

Thank you for helping keep {{theme_name}} secure! 🔒
