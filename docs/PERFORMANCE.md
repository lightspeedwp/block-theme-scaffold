---
title: Performance Monitoring
description: Performance monitoring tools and best practices
category: Development
type: Guide
audience: Developers
date: 2025-12-01
---

This theme includes comprehensive performance monitoring tools to ensure optimal loading times and user experience.

## Tools

### 1. Lighthouse CI

Lighthouse CI tests performance, accessibility, best practices, and SEO metrics across multiple theme templates.

**Configuration**: `.lighthouserc.js`

**Run locally**:

```bash
npm run lighthouse
```

**Metrics tracked**:

- Performance score (target: ≥90%)
- Accessibility score (target: ≥95%)
- Best practices score (target: ≥90%)
- SEO score (target: ≥95%)
- First Contentful Paint (FCP): ≤1800ms
- Largest Contentful Paint (LCP): ≤2500ms
- Cumulative Layout Shift (CLS): ≤0.1
- Total Blocking Time (TBT): ≤200ms
- Speed Index: ≤3400ms

**Test URLs**:

- Homepage (index/front-page)
- Single post
- Archive/category
- 404 page

**Setup for local testing**:

1. Start WordPress environment: `npm run env:start`
2. Activate the theme
3. Create sample content (posts, pages)
4. Update test URLs in `.lighthouserc.js`
5. Run: `npm run lighthouse`

Reports are saved to `./lighthouse-reports/`

### 2. Bundle Size Monitoring

Tracks JavaScript and CSS bundle sizes to prevent bloat and maintain fast page loads.

**Configuration**: `.size-limit.json`

**Run locally**:

```bash
npm run size-limit
```

**Size limits**:

- Theme Editor Script: 30 KB (gzipped)
- Theme Frontend Script: 20 KB (gzipped)
- Theme Editor Style: 15 KB (gzipped)
- Theme Frontend Style: 25 KB (gzipped)

The build will fail if any bundle exceeds its limit.

### 3. Webpack Bundle Analyzer

Visualizes bundle composition to identify optimization opportunities.

**Run locally**:

```bash
npm run analyze-bundle
```

Opens an interactive treemap showing:

- Module sizes
- Dependencies
- Duplicate code
- Code splitting opportunities

### 4. Combined Performance Check

Run all performance tests:

```bash
npm run performance
```

## CI/CD Integration

Performance checks run automatically on:

- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches
- Weekly scheduled runs (Mondays at 2 AM)

**GitHub Actions workflow**: `.github/workflows/performance.yml`

### Jobs

1. **Lighthouse CI**: Tests Core Web Vitals across multiple template types
2. **Bundle Size Analysis**: Checks bundle sizes against established limits
3. **Performance Budget Check**: Reports asset sizes in PR summaries
4. **Core Web Vitals Check**: Displays target metrics

### Artifacts

Performance reports are uploaded as artifacts:

- `lighthouse-reports/`: Lighthouse HTML reports (30-day retention)
- `webpack-bundle-report.html`: Bundle analysis visualization (30-day retention)

## Performance Budgets

### Resource Budgets

- Total scripts: ≤100 KB
- Total stylesheets: ≤50 KB
- Total images: ≤200 KB
- Total resources: ≤500 KB

### Core Web Vitals Targets

#### Largest Contentful Paint (LCP)

- **Target**: ≤2.5s
- **Measures**: Loading performance
- **Tips**:
  - Optimize images (use WebP, appropriate sizes)
  - Minimize render-blocking resources
  - Improve server response times
  - Leverage browser caching

#### First Input Delay (FID) / Total Blocking Time (TBT)

- **Target**: FID ≤100ms, TBT ≤200ms
- **Measures**: Interactivity
- **Tips**:
  - Minimize JavaScript execution time
  - Break up long tasks
  - Remove unused JavaScript
  - Use code splitting

#### Cumulative Layout Shift (CLS)

- **Target**: ≤0.1
- **Measures**: Visual stability
- **Tips**:
  - Include size attributes on images and video
  - Reserve space for ads/embeds
  - Avoid inserting content above existing content
  - Use transform animations instead of layout-inducing properties

#### First Contentful Paint (FCP)

- **Target**: ≤1.8s
- **Measures**: Perceived loading speed
- **Tips**:
  - Eliminate render-blocking resources
  - Minimize CSS
  - Remove unused CSS
  - Preconnect to required origins

#### Speed Index

- **Target**: ≤3.4s
- **Measures**: How quickly content is visually displayed
- **Tips**:
  - Optimize content visibility
  - Minimize main thread work
  - Reduce JavaScript execution time

## Theme-Specific Optimization

### Block Theme Performance

1. **Template Loading**
   - Use minimal templates
   - Avoid excessive template parts
   - Cache template queries

2. **theme.json Optimization**
   - Keep color palettes reasonable (8-12 colors)
   - Limit font families (2-3 typefaces)
   - Use spacing scale efficiently

3. **Block Patterns**
   - Minimize pattern complexity
   - Avoid deeply nested blocks
   - Use reusable blocks when appropriate

4. **Editor Performance**
   - Keep editor styles minimal
   - Avoid heavy JavaScript in editor
   - Use CSS custom properties for theming

### Asset Loading Strategy

```php
// Example: Conditionally load scripts
function theme_enqueue_scripts() {
    // Only load on specific templates
    if ( is_singular( 'product' ) ) {
        wp_enqueue_script( 'product-script' );
    }

    // Load with defer strategy
    wp_enqueue_script(
        'theme-script',
        get_theme_file_uri( 'build/theme.js' ),
        [],
        wp_get_theme()->get( 'Version' ),
        [
            'in_footer' => true,
            'strategy'  => 'defer',
        ]
    );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_scripts' );
```

## Optimization Checklist

### Before Release

- [ ] Run `npm run performance` and pass all checks
- [ ] Verify Core Web Vitals targets met
- [ ] Check bundle sizes are within limits
- [ ] Review bundle analyzer for optimization opportunities
- [ ] Test on slow 3G network
- [ ] Test on low-end mobile devices
- [ ] Verify lazy loading works for images
- [ ] Check for unused CSS/JS
- [ ] Validate caching headers
- [ ] Test with common plugins installed

### Regular Maintenance

- [ ] Review Lighthouse reports monthly
- [ ] Monitor bundle size trends
- [ ] Update dependencies for performance improvements
- [ ] Profile production sites with real user data
- [ ] Review WordPress Core updates for performance features

## Troubleshooting

### Lighthouse CI fails locally

**Issue**: "Connection refused" or timeout errors

**Solution**:

1. Ensure WordPress is running: `npm run env:start`
2. Verify theme is activated
3. Check the port configuration (default: 8888)
4. Update URLs in `.lighthouserc.js` to match your environment
5. Ensure sample content exists (posts, pages, categories)

### Bundle size limits exceeded

**Issue**: `size-limit` fails during build

**Solution**:

1. Run bundle analyzer: `npm run analyze-bundle`
2. Identify large dependencies or duplicates
3. Check for accidentally imported packages
4. Consider removing large dependencies
5. Use dynamic imports for non-critical code
6. If justified, adjust limits in `.size-limit.json` with documentation

### Poor LCP scores

**Issue**: Largest Contentful Paint exceeds 2.5s

**Common causes**:

- Large, unoptimized images
- Render-blocking CSS/JS
- Slow server response time
- Missing resource hints

**Solutions**:

- Use WebP/AVIF formats
- Implement responsive images
- Add width/height attributes
- Preload critical resources
- Use font-display: swap

### High CLS scores

**Issue**: Cumulative Layout Shift exceeds 0.1

**Common causes**:

- Images without dimensions
- Dynamically injected content
- Web fonts causing FOIT/FOUT
- Ads or embeds without reserved space

**Solutions**:

- Add width/height to all images
- Use aspect-ratio CSS property
- Reserve space for dynamic content
- Use font-display: optional
- Preload fonts

## Related Documentation

- [BUILD_PROCESS.md](./BUILD_PROCESS.md) - Build system and asset compilation
- [LINTING.md](./LINTING.md) - Code quality standards
- [TESTING.md](./TESTING.md) - Testing guide including performance tests
- [LOGGING.md](./LOGGING.md) - Logging performance metrics
- [VALIDATION.md](./VALIDATION.md) - Validation quick reference
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD workflows including performance jobs

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
- [WordPress Performance Best Practices](https://make.wordpress.org/core/handbook/testing/reporting-bugs/performance/)
- [Block Theme Performance Guide](https://developer.wordpress.org/themes/block-themes/performance/)
- [Size Limit](https://github.com/ai/size-limit)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Web Performance Working Group](https://www.w3.org/webperf/)
