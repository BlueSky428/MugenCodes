# Figma Design Prompt for Mugen Codes Portfolio Website

## Brand Identity & Core Values

Design a professional software development team portfolio website for **Mugen Codes** with the tagline: **"Calm delivery for important software"**. The brand embodies:

- **Trust & Reliability**: Senior engineers delivering dependable results
- **Clarity & Communication**: Clear ownership, transparent progress, simple language
- **Calm & Professional**: No pressure, steady delivery, thoughtful approach
- **Quality & Care**: Careful implementation, clean code, stable architecture

The design should feel **calm, trustworthy, and professional** - like working with experienced consultants who value clarity over flashiness.

---

## Color Palette

### Light Mode
- **Primary Text (Ink)**: `#0f1c1a` - Deep charcoal green
- **Background (Surface)**: `#f6f7f5` - Soft off-white with slight green tint
- **Accent**: `#1f6f6b` - Teal green (primary CTA buttons, links)
- **Accent Soft**: `#e3f1ef` - Light teal (subtle backgrounds, blur effects)
- **Borders**: `rgba(15, 28, 26, 0.1)` - Subtle ink with 10% opacity

### Dark Mode
- **Background (Night)**: `#0b1413` - Deep dark green-black
- **Surface (NightSoft)**: `#121f1d` - Slightly lighter dark surface
- **Text**: `#f1f3f2` - Soft off-white
- **Accent**: `#7dd3ce` - Light teal (links, accents)
- **Borders**: `rgba(255, 255, 255, 0.1)` - Subtle white with 10% opacity

### Shadows
- **Soft Shadow**: `0 12px 32px rgba(15, 28, 26, 0.08)` - Subtle elevation
- **Card Shadow**: `0 18px 40px rgba(15, 28, 26, 0.08)` - Card elevation

---

## Typography

- **Font Family**: Inter (Google Fonts)
- **Font Features**: Enable ligatures and kerning for optimal readability
- **Text Rendering**: Optimize legibility
- **Line Height**: Relaxed (1.6-1.7)

### Type Scale
- **H1 (Hero)**: 4xl-5xl (36-48px), semibold, tight tracking
- **H2 (Section Titles)**: 2xl-3xl (24-30px), semibold
- **H3 (Card Titles)**: 2xl-3xl (24-30px), semibold
- **Body Large**: 19px, regular weight
- **Body**: 16px (base), regular weight
- **Body Small**: 14px, regular weight
- **Labels**: 12-14px, uppercase, wide letter spacing (0.2em)

---

## Design Principles

1. **Generous White Space**: Ample breathing room between elements
2. **Subtle Depth**: Soft shadows, gentle borders, minimal elevation
3. **Rounded Corners**: 24px (rounded-3xl) for cards and images
4. **Smooth Transitions**: All interactive elements have hover states with opacity/color transitions
5. **Backdrop Blur**: Header uses backdrop blur for modern glass effect
6. **Subtle Gradients**: Soft blur effects in hero section (accentSoft with blur-2xl)
7. **Accessibility First**: High contrast ratios, clear focus states, semantic structure

---

## Layout Structure

### Container
- **Max Width**: 1152px (max-w-6xl)
- **Padding**: 24px (px-6) on mobile, responsive on larger screens
- **Grid System**: 2-column grid on tablet/desktop, single column on mobile

### Spacing Scale
- **Section Spacing**: 80-112px vertical (py-20 to py-28)
- **Card Padding**: 32px (p-8)
- **Element Gaps**: 16-24px (gap-4 to gap-6)
- **Content Gaps**: 24-32px (gap-6 to gap-8)

---

## Component Specifications

### Header
- **Style**: Sticky, top-0, with backdrop blur (90% opacity)
- **Height**: Compact (py-2 = 8px padding)
- **Logo**: 48px mobile, 64px desktop (square)
- **Navigation**: Horizontal flex, small text (xs on mobile, sm on desktop)
- **Theme Toggle**: Right side, accessible

### Hero Section
- **Background**: Surface color with subtle blur effects
- **Blur Elements**: 
  - Top-right: 160px circle, accentSoft, blur-2xl
  - Bottom-left: 128px circle, accentSoft/70, blur-2xl
- **Content**: Left-aligned, max-width 768px
- **CTA Buttons**: 
  - Primary: Full rounded (rounded-full), accent background, white text, shadow-soft
  - Secondary: Full rounded, border only, transparent background

### Cards
- **Style**: White background (dark: nightSoft), rounded-3xl, border, shadow-card
- **Hover**: shadow-soft transition
- **Padding**: 32px (p-8)
- **Border**: 1px, ink/10 opacity

### Team Member Cards
- **Photo**: 
  - Size: 192px mobile, 224px tablet, 256px desktop
  - Style: Rounded-3xl, 2px border, shadow-md
  - Position: Centered at top
- **Layout**: Vertical, centered alignment
- **Typography Hierarchy**: 
  - Role: Small, uppercase, wide tracking, muted color
  - Name: 2xl-3xl, semibold, prominent
  - Details: Small text, muted colors
  - Bio sections: Separated by border-top, relaxed line height

### Buttons
- **Primary**: 
  - Background: Accent color (#1f6f6b)
  - Text: White
  - Shape: Fully rounded (rounded-full)
  - Padding: px-6 py-3
  - Shadow: shadow-soft
  - Hover: opacity-90
- **Secondary**: 
  - Background: Transparent
  - Border: 1px, ink/20
  - Text: Ink color
  - Shape: Fully rounded
  - Hover: Border opacity increases

### Fixed CTA Button
- **Position**: Fixed, bottom-right (bottom-6 right-6)
- **Visibility**: Hidden on mobile, visible desktop (md:inline-flex)
- **Style**: Same as primary button, smaller text

---

## Page Structure

### Home Page
1. **Hero Section**: Large headline, subheadline, dual CTAs, subtle blur effects
2. **Section**: "Clear ownership lowers risk" - 2 paragraphs
3. **Section**: "Outcomes that protect your investment" - 3 paragraphs
4. **CTA Section**: Centered call-to-action with dual buttons
5. **FAQ Section**: Accordion-style questions and answers

### Team Page
1. **Intro Section**: "A calm team with clear roles" - 1 paragraph
2. **Team Grid**: 2-column grid (mobile: 1 column)
   - Each card: Large centered photo, role label, name, age, location, major skill
   - Separator line
   - Bio, strengths, value (3 paragraphs)
3. **Closing Section**: "Who you talk to and how decisions move" - 2 paragraphs

### Other Pages
- **How We Work**: Process explanation
- **Services**: Service offerings
- **Why It Works**: Value propositions
- **Contact**: Contact form and information

---

## Interactive States

### Hover States
- **Links**: Underline on hover, color transition
- **Buttons**: Opacity change (90%), smooth transition
- **Cards**: Shadow softens (shadow-card → shadow-soft)
- **Navigation**: Text color darkens

### Focus States
- **All Interactive Elements**: 
  - Outline: 2px ring, accent color
  - Offset: 2px from element
  - Background offset: surface/night color

### Transitions
- **Duration**: 150-200ms
- **Easing**: Default (ease-in-out)
- **Properties**: opacity, color, shadow, transform

---

## Dark Mode Considerations

- **Automatic**: Respects system preference, toggle available
- **Contrast**: Maintain high contrast ratios in both modes
- **Accent Colors**: Lighter teal in dark mode for better visibility
- **Backgrounds**: Deep dark green-black, not pure black
- **Text**: Soft off-white, not pure white (reduces eye strain)

---

## Responsive Breakpoints

- **Mobile**: < 768px (default)
- **Tablet**: 768px+ (md:)
- **Desktop**: 1024px+ (lg:)

### Mobile-First Approach
- Single column layouts
- Stacked elements
- Smaller text sizes
- Compact spacing
- Hidden elements (fixed CTA)

---

## Content Tone & Messaging

- **Language**: Simple, clear, direct - no jargon
- **Voice**: Professional but approachable, calm and confident
- **Focus**: Benefits and outcomes, not technical details
- **Structure**: Short paragraphs, scannable content
- **CTAs**: Action-oriented, benefit-focused ("Talk to our Project Manager")

---

## Special Design Elements

1. **Blur Effects**: Soft, organic blur circles in hero (accentSoft color, blur-2xl)
2. **Rounded Everything**: Consistent 24px radius (rounded-3xl) throughout
3. **Subtle Borders**: 10% opacity borders for definition without heaviness
4. **Soft Shadows**: Multiple shadow levels for depth hierarchy
5. **Backdrop Blur**: Modern glass-morphism effect on header
6. **Smooth Scrolling**: Enabled for better UX

---

## Accessibility Requirements

- **Color Contrast**: WCAG AA minimum (4.5:1 for text)
- **Focus Indicators**: Clear, visible focus rings on all interactive elements
- **Semantic HTML**: Proper heading hierarchy, ARIA labels where needed
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader**: Descriptive alt text, proper labels

---

## Design Deliverables Needed

1. **Desktop Design** (1440px width)
   - Home page
   - Team page
   - Contact page
   - Component library/style guide

2. **Tablet Design** (768px width)
   - Key pages with responsive adjustments

3. **Mobile Design** (375px width)
   - Mobile-optimized layouts
   - Touch-friendly interactions

4. **Dark Mode Variants**
   - All pages in dark mode
   - Color adjustments documented

5. **Component Library**
   - Buttons (primary, secondary, states)
   - Cards (team, content)
   - Navigation (header, footer)
   - Forms (contact form)
   - Typography scale
   - Color swatches
   - Spacing system

---

## Design Inspiration Keywords

- Minimalist professional
- Calm and trustworthy
- Clean software company aesthetic
- Japanese design principles (wabi-sabi, ma - negative space)
- Modern SaaS landing pages
- Thoughtful typography
- Subtle depth and elevation
- Professional consulting firm aesthetic

---

## Final Notes

The design should feel like a **calm, professional software consultancy** - not flashy or trendy, but timeless and trustworthy. Think of it as the visual equivalent of a senior engineer: experienced, reliable, clear, and calm. Every design decision should reinforce the brand values of clarity, trust, and calm delivery.

The color palette (teal/green) suggests growth, stability, and professionalism without being aggressive. The generous white space and clean typography create a sense of clarity and order - exactly what clients want when working with a development team.
