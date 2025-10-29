# Frontend Performance Testing Guide

## Overview
This guide covers performance testing for the Career Advisor Frontend using Lighthouse CI and other tools.

## Tools Installed
- **Lighthouse CI** - Automated performance auditing
- **Lighthouse** - Manual performance testing

## Quick Start

### 1. Run Lighthouse Desktop Test
```bash
npm run perf:test
```

### 2. Run Lighthouse Mobile Test
```bash
npm run perf:test:mobile
```

### 3. Run Quick Lighthouse Check
```bash
npm run perf:check
```

---

## Performance Metrics Explained

### Core Web Vitals

#### **Largest Contentful Paint (LCP)**
- **What:** Time until largest content element is visible
- **Target:** < 2.5 seconds
- **Good:** Green (< 2.5s)
- **Needs Improvement:** Orange (2.5s - 4s)
- **Poor:** Red (> 4s)

#### **First Input Delay (FID) / Total Blocking Time (TBT)**
- **What:** Time until page becomes interactive
- **Target:** < 100ms (FID), < 300ms (TBT)
- **Measures:** Responsiveness to user input

#### **Cumulative Layout Shift (CLS)**
- **What:** Visual stability (unexpected layout shifts)
- **Target:** < 0.1
- **Good:** Content doesn't jump around while loading

### Additional Metrics

#### **First Contentful Paint (FCP)**
- **What:** Time until first text/image appears
- **Target:** < 1.8 seconds
- **User Impact:** "Something is happening"

#### **Speed Index**
- **What:** How quickly content is visually displayed
- **Target:** < 3.4 seconds
- **Lower is better**

#### **Time to Interactive (TTI)**
- **What:** Time until page is fully interactive
- **Target:** < 3.8 seconds

---

## Running Tests

### Desktop Performance Test
```bash
cd frontend
npm run perf:test
```

**What it does:**
- Builds production version
- Starts Next.js server
- Tests 5 key pages
- Runs 3 times for consistency
- Generates detailed report

**Performance Budgets (Desktop):**
- Performance Score: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90
- FCP: < 2000ms
- LCP: < 2500ms
- CLS: < 0.1
- TBT: < 300ms

### Mobile Performance Test
```bash
cd frontend
npm run perf:test:mobile
```

**Simulates:**
- Mobile device (iPhone-like)
- Slow 4G connection
- CPU throttling (4x slower)
- Small screen (375x667)

**Performance Budgets (Mobile):**
- Performance Score: ≥ 70 (more lenient)
- FCP: < 3000ms
- LCP: < 4000ms
- TBT: < 600ms

### Quick Manual Check
```bash
npm run perf:check
```

**Quick validation:**
- Tests homepage only
- Single run
- Fast feedback
- Use during development

---

## Understanding Reports

### Lighthouse Scores

Each category gets a score from 0-100:

**90-100:** 🟢 Excellent
**50-89:** 🟠 Needs Improvement
**0-49:** 🔴 Poor

### Reading the Output

```
✅ Performance score: 85 / 100
✅ Accessibility score: 95 / 100
✅ Best Practices score: 92 / 100
✅ SEO score: 100 / 100

Assertions:
✅ first-contentful-paint: 1456ms (target: < 2000ms)
✅ largest-contentful-paint: 2234ms (target: < 2500ms)
✅ cumulative-layout-shift: 0.05 (target: < 0.1)
❌ total-blocking-time: 456ms (target: < 300ms)
```

---

## Manual Testing with Chrome DevTools

### 1. Performance Tab

```bash
# Start dev server
npm run dev
```

1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** (⚫)
4. Interact with page
5. Stop recording
6. Analyze:
   - Loading time
   - JavaScript execution
   - Rendering time
   - Network requests

### 2. Lighthouse Tab

1. Open DevTools → **Lighthouse** tab
2. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
3. Choose device: Desktop or Mobile
4. Click **Analyze page load**
5. Review detailed report

### 3. Network Tab

1. DevTools → **Network** tab
2. Enable **Disable cache**
3. Set throttling: **Slow 3G** or **Fast 3G**
4. Reload page
5. Check:
   - Total requests
   - Total size
   - Load time
   - Large files
   - Slow requests

---

## Common Performance Issues & Fixes

### ❌ Issue: Large JavaScript Bundles

**Symptoms:**
- High TBT (> 300ms)
- Low performance score
- Slow page load

**Solutions:**
```javascript
// 1. Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});

// 2. Code splitting
// Next.js does this automatically per page

// 3. Analyze bundle size
npm run build
# Check .next/analyze/
```

### ❌ Issue: Unoptimized Images

**Symptoms:**
- High LCP
- Large network transfers
- Slow image loading

**Solutions:**
```jsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero"
  priority // For above-fold images
  placeholder="blur"
/>
```

### ❌ Issue: Layout Shifts (High CLS)

**Symptoms:**
- Content jumping
- CLS > 0.1
- Poor user experience

**Solutions:**
```css
/* Reserve space for images */
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* Reserve space for dynamic content */
.skeleton {
  min-height: 200px;
}
```

```jsx
// Use skeleton loaders
{loading && <Skeleton />}
{!loading && <Content />}
```

### ❌ Issue: Render-Blocking Resources

**Symptoms:**
- High FCP/LCP
- Fonts/CSS blocking render

**Solutions:**
```javascript
// next.config.js - Optimize fonts
const nextConfig = {
  optimizeFonts: true,
};

// Use font-display: swap
@font-face {
  font-family: 'MyFont';
  font-display: swap;
}
```

### ❌ Issue: Too Many Re-renders

**Symptoms:**
- Laggy interactions
- High CPU usage
- Slow state updates

**Solutions:**
```javascript
// 1. Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 2. Memoize components
const MemoizedComponent = React.memo(MyComponent);

// 3. Optimize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

---

## Optimization Checklist

### Images
- [ ] Use Next.js `<Image>` component
- [ ] Set width/height on all images
- [ ] Use `priority` for above-fold images
- [ ] Enable WebP/AVIF formats
- [ ] Lazy load below-fold images

### JavaScript
- [ ] Remove unused dependencies
- [ ] Use dynamic imports for heavy components
- [ ] Implement code splitting
- [ ] Minimize third-party scripts
- [ ] Tree-shake unused code

### CSS
- [ ] Remove unused styles
- [ ] Use CSS-in-JS efficiently
- [ ] Minimize Tailwind bundle (purge unused)
- [ ] Avoid large CSS files

### Fonts
- [ ] Self-host fonts (don't use Google Fonts CDN)
- [ ] Use `font-display: swap`
- [ ] Preload critical fonts
- [ ] Subset fonts (only needed characters)

### Caching
- [ ] Implement service worker (PWA)
- [ ] Set proper cache headers
- [ ] Use React Query for API caching
- [ ] Enable Next.js ISR where appropriate

### Loading States
- [ ] Add skeleton loaders
- [ ] Show loading indicators
- [ ] Implement optimistic UI updates
- [ ] Reserve space for dynamic content

---

## Continuous Monitoring

### Set Up Lighthouse CI in GitHub Actions

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build
        run: cd frontend && npm run build

      - name: Run Lighthouse CI
        run: cd frontend && npm run perf:test

      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: lighthouse-results
          path: frontend/.lighthouseci
```

### Real User Monitoring (RUM)

You already have Vercel Analytics installed!

```javascript
// frontend/src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics /> {/* Already collecting real user metrics! */}
      </body>
    </html>
  );
}
```

**View metrics in:**
- Vercel Dashboard → Your Project → Analytics
- Real user performance data
- Core Web Vitals from actual users

---

## Performance Testing Schedule

### Development
- Run `npm run perf:check` before commits
- Check DevTools Performance tab for new features

### Pre-Deployment
- Run full desktop test: `npm run perf:test`
- Run mobile test: `npm run perf:test:mobile`
- Ensure all scores meet thresholds

### Post-Deployment
- Monitor Vercel Analytics
- Check real user metrics
- Compare before/after performance

### Weekly
- Run comprehensive tests
- Review trends
- Identify regressions

---

## Advanced Testing

### Test Specific Pages
```bash
npx lhci autorun --config=lighthouserc.json --url=http://localhost:3000/dashboard
```

### Custom Configuration
Create `lighthouse-custom.json`:
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/your-page"],
      "numberOfRuns": 5
    }
  }
}
```

Run:
```bash
npx lhci autorun --config=lighthouse-custom.json
```

---

## Troubleshooting

### Server won't start
```bash
# Kill existing processes
npx kill-port 3000

# Or manually
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Inconsistent scores
```bash
# Increase number of runs in config
"numberOfRuns": 5

# Close other applications
# Disable browser extensions
# Use incognito mode
```

---

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Core Web Vitals](https://web.dev/vitals/)
