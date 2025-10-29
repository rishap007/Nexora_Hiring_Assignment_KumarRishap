# Vibe Commerce - Design Guidelines

## Design Approach
**Selected System**: Material Design 3 with Dark Futuristic Enhancement
**Justification**: E-commerce platform requiring visual sophistication, modern interaction patterns, and professional polish. Material UI provides robust component library while dark futuristic treatment differentiates the brand in the e-commerce space.

**Key Principles**:
- Elevated surfaces with subtle depth and glow effects
- Clean geometric layouts with precision spacing
- Smooth, purposeful micro-interactions
- High contrast for readability and focus
- Premium, tech-forward aesthetic

---

## Typography

**Font Families** (via Google Fonts):
- Primary: 'Inter' - Clean, modern sans-serif for UI elements
- Accent: 'Orbitron' - Futuristic display font for headings and brand

**Hierarchy**:
- Hero/Page Titles: Orbitron, 48px (mobile: 32px), weight 700, tight letter-spacing (-0.02em)
- Section Headers: Orbitron, 32px (mobile: 24px), weight 600
- Product Names: Inter, 20px, weight 600
- Body Text: Inter, 16px (mobile: 14px), weight 400, line-height 1.6
- Prices: Inter, 24px, weight 700, tabular numbers
- Button Labels: Inter, 15px, weight 500, uppercase, letter-spacing 0.05em
- Small Details: Inter, 13px, weight 400

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: 2, 4 (within components)
- Standard spacing: 8, 12 (between elements)
- Section spacing: 16, 20, 24 (page structure)

**Grid Structure**:
- Container: max-w-7xl with px-6 (mobile: px-4)
- Products Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4, gap-6
- Cart Items: Single column stack with dividers
- Checkout: 2-column layout on desktop (form left, summary right), stack on mobile

**Responsive Breakpoints**:
- Mobile: base (< 768px)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Large Desktop: xl (1280px+)

---

## Component Library

### Navigation Header
- Full-width sticky header with glassmorphism effect (backdrop blur)
- Logo (Orbitron font) positioned left
- Cart icon with animated badge showing item count, positioned right
- Height: h-16, px-6 horizontal padding
- Subtle bottom border with glow effect

### Product Cards
- Elevated card surface with hover lift effect (transform translateY -4px)
- Product image: aspect-ratio 1:1, object-cover with subtle overlay gradient
- Card padding: p-4
- Product name truncated to 2 lines with ellipsis
- Price display prominent below name
- "Add to Cart" button: full-width, rounded-lg, with subtle pulse animation on hover
- Border radius: rounded-xl for all cards

### Shopping Cart Panel/Page
- Slide-in drawer from right on mobile/tablet, dedicated page section on desktop
- Cart header: Sticky with total count and "Clear Cart" option
- Cart items: Stack with gap-4
- Each item row: Flex layout with image (w-20 h-20 rounded), product details, quantity controls, remove button
- Quantity controls: Outlined buttons with - and + icons, centered number display
- Empty cart state: Centered illustration/icon with encouraging message
- Subtotal bar: Sticky bottom with glassmorphism, prominent total display

### Checkout Section
- Two-column layout: Form (8 columns) + Order Summary (4 columns) on desktop
- Form fields: Floating labels, rounded-lg inputs, full-width
- Input spacing: gap-6 between fields
- Field groups: Name and Email stacked, mb-6 between groups
- Order summary card: Sticky positioning, elevated surface, p-6
- Line items: Text truncation with prices aligned right
- Grand total: Larger font, border-top with pt-4 spacing
- Submit button: Extra large (h-14), full-width on mobile

### Receipt Modal
- Centered overlay with backdrop blur
- Modal card: max-w-md, rounded-2xl, p-8
- Success icon/animation at top (checkmark with subtle pulse)
- Receipt details: Structured with spacing-4 between rows
- Order number: Monospace font, highlighted
- Close/Download buttons at bottom

### Buttons
- Primary CTA: Elevated with subtle glow, h-12, px-8, rounded-lg
- Secondary: Outlined variant, same dimensions
- Icon buttons: w-10 h-10, rounded-full for cart controls
- Disabled state: Reduced opacity with no interaction effects
- All buttons have smooth transition effects (200ms ease)

### Loading States
- Skeleton screens for product grid (shimmer animation)
- Spinner overlay for checkout submission
- Progress indicators for async operations

### Error Handling
- Toast notifications: Bottom-right positioning, slide-in animation
- Inline form errors: Below inputs with small text and warning icon
- Empty states: Centered with helpful messaging and action prompts

---

## Animations & Interactions

**Micro-interactions** (subtle, fast):
- Card hover: Lift + subtle glow (150ms ease-out)
- Button press: Scale 0.98 (100ms)
- Cart badge: Bounce on item added (300ms spring)
- Quantity update: Number fade transition (200ms)

**Page Transitions**:
- Cart panel: Slide from right (250ms ease-in-out)
- Modal: Fade + scale from 0.95 (200ms)
- Product grid: Stagger fade-in on load (sequential 50ms delays)

**Scroll Behavior**: Smooth scrolling enabled, sticky header with shadow on scroll

---

## Images

### Hero Section
**Placement**: Full-width banner above product grid
**Dimensions**: h-80 (mobile: h-64), full viewport width
**Content**: Futuristic e-commerce lifestyle imagery - sleek product photography with tech/holographic overlays, neon accent lighting
**Treatment**: Dark gradient overlay (top to bottom) for text legibility
**Overlay Elements**: 
- Centered headline "Vibe Commerce" (Orbitron, 56px on desktop)
- Subheading "Future of Shopping" (Inter, 24px, reduced opacity)
- CTA button with glassmorphism background blur effect

### Product Images
**Source**: Use high-quality product photography (mock or Fake Store API)
**Treatment**: Consistent 1:1 aspect ratio, subtle vignette on hover
**Placeholder**: Shimmer loading state with gradient animation

### Empty States
**Cart Empty**: Abstract geometric icon or minimalist illustration
**No Results**: Floating 3D shapes or search-related iconography

---

## Accessibility
- ARIA labels on all interactive elements
- Focus states: 2px outline with offset on all focusable elements
- Keyboard navigation: Tab order follows visual hierarchy
- Color contrast: Minimum 4.5:1 for all text on dark backgrounds
- Screen reader announcements for cart updates and form validation
- Touch targets: Minimum 44x44px for mobile interactions

---

## Key Visual Distinctions
- Glassmorphism effects on overlays and elevated surfaces
- Subtle grid pattern or dot matrix background texture
- Neon accent lines/borders for emphasis areas
- Hover states with soft outer glow effects
- Consistent rounded corners (rounded-lg to rounded-2xl range)
- Elevated card system with layered depth perception
- Monochromatic base with high-tech accent treatments