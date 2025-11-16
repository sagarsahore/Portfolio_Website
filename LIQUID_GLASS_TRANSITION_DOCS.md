# Liquid Glass Page Transition Documentation

## Overview

The Liquid Glass Page Transition is a custom, Apple-style minimal animation system that creates elegant page transitions with a frosted glass effect. It's designed to be lightweight, performant, and fully accessible.

## Features

- ✨ **Liquid Glass Effect**: Frosted glass overlay with blur and transparency
- 🌊 **Ripple Animation**: Fluid distortion that mimics light bending through glass  
- 🎨 **Minimal Design**: Bright, clean aesthetic without dark mode
- ⚡ **GPU Accelerated**: Smooth 60fps animations using hardware acceleration
- ♿ **Accessible**: Full support for `prefers-reduced-motion`
- 📱 **Responsive**: Optimized for mobile devices
- 🔧 **Reusable**: Simple API for custom implementations

## Files

```
assets/
├── css/
│   └── liquid-glass-transition.css     # All transition styles
└── scripts/
    └── liquid-glass-transition.js      # Transition logic & API
```

## Installation

### 1. Add CSS to `<head>`

```html
<link rel="stylesheet" href="assets/css/liquid-glass-transition.css">
```

### 2. Add JavaScript before closing `</body>`

```html
<script src="assets/scripts/liquid-glass-transition.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const glassTransition = initLiquidGlassTransition({
            duration: 500,
            debug: false,
            autoIntercept: true
        });
        
        window.glassTransition = glassTransition;
    });
</script>
```

## Basic Usage

### Automatic Link Interception

By default, the transition automatically intercepts internal navigation links:

```html
<!-- These links will automatically trigger the transition -->
<a href="#about">About</a>
<a href="#portfolio">Portfolio</a>
<a href="#contact">Contact</a>
```

### Programmatic Navigation

Trigger transitions programmatically:

```javascript
// Navigate to a section
glassTransition.navigateTo('about');

// Execute custom callback during transition
glassTransition.transition(() => {
    // Your code here - runs when glass overlay is visible
    console.log('Transitioning...');
});
```

## Configuration Options

```javascript
const glassTransition = initLiquidGlassTransition({
    // Duration of the full transition in milliseconds (default: 500)
    duration: 500,
    
    // Easing function for animations (default: cubic-bezier)
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Enable debug logging (default: false)
    debug: false,
    
    // Auto-intercept internal links (default: true)
    autoIntercept: true,
    
    // Callback before transition starts
    onStart: function() {
        console.log('Transition starting...');
    },
    
    // Callback after transition completes
    onComplete: function() {
        console.log('Transition complete!');
    }
});
```

## Advanced Usage

### Manual Transition Control

```javascript
// Create instance without auto-interception
const transition = new LiquidGlassTransition({
    duration: 600,
    autoIntercept: false
});

// Trigger manually
document.querySelector('.my-button').addEventListener('click', async () => {
    await transition.transition(() => {
        // Change page content
        updatePageContent();
    });
});
```

### Custom Section Navigation

```javascript
// Navigate with promise handling
glassTransition.navigateTo('services')
    .then(() => {
        console.log('Navigation complete!');
    });

// Async/await pattern
async function navigateToSection(sectionName) {
    await glassTransition.navigateTo(sectionName);
    // Code runs after transition
    analyticsTrack('section-view', sectionName);
}
```

### Integrating with Routers

For SPAs with routing libraries:

```javascript
const glassTransition = initLiquidGlassTransition({
    autoIntercept: false
});

// React Router example
function MyComponent() {
    const navigate = useNavigate();
    
    const handleNavigation = async (path) => {
        await glassTransition.transition(() => {
            navigate(path);
        });
    };
    
    return <button onClick={() => handleNavigation('/about')}>About</button>;
}

// Vue Router example
router.beforeEach(async (to, from, next) => {
    if (from.name) {
        await window.glassTransition.transition(() => {
            next();
        });
    } else {
        next();
    }
});
```

## Animation Sequence

The transition follows this timeline:

```
0ms     - Fade out current content begins
50ms    - Glass overlay starts appearing
250ms   - Callback executes (midpoint)
300ms   - New content starts fading in
500ms   - Glass overlay hides
600ms   - Transition complete, cleanup
```

## Performance Optimization

### GPU Acceleration

All animations use GPU-accelerated properties:
- `transform` (instead of position properties)
- `opacity`
- `backdrop-filter`

### Mobile Optimizations

On mobile devices:
- Reduced blur intensity (40px → 20px)
- Disabled shimmer effect
- Shorter transition duration with reduced motion

### Best Practices

```javascript
// ✅ Good - GPU accelerated
element.style.transform = 'translateX(100px)';
element.style.opacity = '0.5';

// ❌ Avoid - Forces layout recalculation
element.style.left = '100px';
element.style.width = '200px';
```

## Accessibility Features

### Reduced Motion Support

Automatically respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
    /* Simplified animations with no scaling/distortion */
    .liquid-glass-overlay {
        transition: opacity 0.2s ease-in-out;
    }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
    .liquid-glass-overlay {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: none;
    }
}
```

### ARIA Attributes

The overlay includes proper ARIA attributes:

```html
<div class="liquid-glass-overlay" 
     role="presentation" 
     aria-hidden="true">
</div>
```

## Customization

### Adjusting Glass Effect

Edit `liquid-glass-transition.css`:

```css
.liquid-glass-overlay {
    /* More transparent */
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.5) 100%
    );
    
    /* Stronger blur */
    backdrop-filter: blur(60px) saturate(200%);
}
```

### Custom Ripple Colors

```css
.liquid-glass-overlay::before {
    background: radial-gradient(
        circle,
        rgba(108, 92, 231, 0.3) 0%,    /* Purple tint */
        rgba(108, 92, 231, 0.1) 30%,
        rgba(255, 255, 255, 0) 70%
    );
}
```

### Different Timing Functions

```javascript
const transition = new LiquidGlassTransition({
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Bounce effect
});
```

## Browser Support

- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 9+
- ✅ Edge 79+
- ⚠️ IE 11 (graceful degradation, no blur effect)

### Fallbacks

For browsers without `backdrop-filter` support:

```css
@supports not (backdrop-filter: blur(40px)) {
    .liquid-glass-overlay {
        background: rgba(255, 255, 255, 0.9);
    }
}
```

## Troubleshooting

### Transition Not Working

1. **Check console for errors**: Enable debug mode
   ```javascript
   initLiquidGlassTransition({ debug: true });
   ```

2. **Verify CSS is loaded**: Check Network tab in DevTools

3. **Check z-index conflicts**: Glass overlay uses `z-index: 9999`

### Performance Issues

1. **Reduce blur intensity** on mobile
2. **Disable shimmer effect**: Hide `::after` pseudo-element
3. **Shorten duration**: Set to 300ms for faster devices

### Conflicts with Other Libraries

If using with other transition libraries:

```javascript
// Disable auto-interception
const transition = initLiquidGlassTransition({
    autoIntercept: false
});

// Manually trigger only when needed
myCustomRouter.beforeTransition(() => {
    transition.transition(() => {
        // Navigate
    });
});
```

## API Reference

### LiquidGlassTransition Class

#### Constructor

```javascript
new LiquidGlassTransition(options)
```

**Parameters:**
- `options` (Object): Configuration options

#### Methods

##### `transition(callback)`

Execute a page transition with optional callback.

```javascript
await transition.transition(() => {
    // Code runs at midpoint
});
```

**Returns:** `Promise<void>`

##### `navigateTo(target)`

Navigate to a section or execute callback.

```javascript
await transition.navigateTo('about');  // Navigate to section
await transition.navigateTo(() => {    // Custom callback
    updateContent();
});
```

**Parameters:**
- `target` (string|Function): Section anchor or callback function

**Returns:** `Promise<void>`

##### `destroy()`

Remove the transition system and clean up.

```javascript
transition.destroy();
```

### Helper Functions

#### `initLiquidGlassTransition(options)`

Initialize with automatic link interception.

```javascript
const transition = initLiquidGlassTransition({
    duration: 500,
    autoIntercept: true
});
```

**Returns:** `LiquidGlassTransition` instance

## Examples

### Example 1: Basic Portfolio

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="assets/css/liquid-glass-transition.css">
</head>
<body>
    <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
    </nav>
    
    <section id="home" data-anchor="home">
        <h1>Welcome</h1>
    </section>
    
    <script src="assets/scripts/liquid-glass-transition.js"></script>
    <script>
        initLiquidGlassTransition({ duration: 500 });
    </script>
</body>
</html>
```

### Example 2: Custom Button Navigation

```javascript
document.querySelector('.custom-nav-btn').addEventListener('click', async () => {
    await glassTransition.transition(() => {
        // Update page content
        document.querySelector('.content').innerHTML = newContent;
        // Update URL without reload
        history.pushState({}, '', '/new-page');
    });
});
```

### Example 3: Form Submit with Transition

```javascript
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    await glassTransition.transition(async () => {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showSuccessPage();
        }
    });
});
```

## Production Checklist

- [ ] CSS and JS files included in HTML
- [ ] Transition initialized on DOM ready
- [ ] Tested with keyboard navigation
- [ ] Tested with screen readers
- [ ] Verified reduced motion support
- [ ] Tested on mobile devices
- [ ] Performance profiled (60fps target)
- [ ] No console errors
- [ ] Graceful degradation for old browsers

## Credits

Designed for Apple-style minimal portfolios. Inspired by iOS/macOS UI motion design principles.

## License

This code is part of the Sagar Sahore Portfolio Website project.

## Support

For issues or questions, please refer to the main project repository.
