# Performance Monitoring and Optimization Notes

## Current Optimizations Applied

### Critical Rendering Path
- ✅ Inlined critical CSS for above-the-fold content
- ✅ Deferred non-critical CSS with media="print" swap technique
- ✅ Added preconnect hints for external domains
- ✅ Preloaded critical Inter font with crossorigin

### Image Optimizations
- ✅ Added loading="lazy" and decoding="async" to below-fold images
- ✅ Added width/height attributes to prevent CLS
- ✅ Improved alt text for accessibility

### JavaScript Optimizations
- ✅ Deferred non-critical scripts to load after window.load
- ✅ Added passive scroll listeners
- ✅ Implemented requestAnimationFrame for scroll optimizations

### Font Performance
- ✅ Added font-display: swap to all @font-face declarations
- ✅ Preloaded critical font files

### Additional Performance Features
- ✅ Added prefers-reduced-motion support
- ✅ Implemented CSS containment for isolated components
- ✅ Added will-change optimization for animated elements
- ✅ Ensured tap targets are ≥44px for mobile
- ✅ Added rel="noopener" to external links

## Performance Monitoring Checklist

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **INP (Interaction to Next Paint)**: ≤ 200ms

### Testing with Lighthouse (Mobile)
```bash
# Run Lighthouse in CLI (if available)
lighthouse https://your-site.com --only-categories=performance --form-factor=mobile --throttling-method=simulate

# Key metrics to monitor:
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Cumulative Layout Shift (CLS)
# - Total Blocking Time (TBT)
```

### Chrome DevTools Performance Panel
1. Open DevTools → Performance tab
2. Enable "Screenshots" and "Web Vitals"
3. Click record and reload the page
4. Look for:
   - Long tasks (>50ms) in red
   - Layout shifts (purple bars)
   - Main thread blocking

### What to Watch When Adding Content

#### New Images
- Always add width/height attributes
- Use loading="lazy" for below-fold content
- Consider WebP/AVIF formats with fallbacks
- Compress images (aim for <100KB for hero images)

#### New CSS
- Check if styles can be inlined for critical path
- Use CSS containment for isolated components
- Avoid layout-triggering properties in animations (use transform/opacity)
- Add will-change sparingly and remove when not needed

#### New JavaScript
- Defer non-critical scripts
- Use passive event listeners for scroll/touch events
- Debounce/throttle frequent events
- Break long tasks with requestIdleCallback

#### New Fonts
- Add font-display: swap
- Preload only critical font weights
- Consider font subsetting for used characters

## Fallback Strategy for Low-End Devices

### Reduced Motion Implementation
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Connection-Aware Loading
```javascript
// Detect slow connections and reduce features
if ('connection' in navigator) {
  const connection = navigator.connection;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    // Disable heavy animations
    document.body.classList.add('reduced-features');
  }
}
```

### Performance Budget
- Total CSS: <150KB (gzipped)
- Total JS: <300KB (gzipped)  
- Images per page: <2MB total
- Fonts: <100KB total
- Third-party scripts: <50KB

## Regular Monitoring Tasks
1. Run Lighthouse monthly on mobile
2. Check Core Web Vitals in Google Search Console
3. Monitor real user metrics if analytics available
4. Test on actual devices (especially low-end Android)
5. Validate accessibility with screen readers

## Emergency Performance Fixes
If performance degrades:
1. Check for new large images without optimization
2. Look for blocking JavaScript in <head>
3. Verify CSS containment is working
4. Check for infinite scroll listeners
5. Validate font loading isn't blocking render