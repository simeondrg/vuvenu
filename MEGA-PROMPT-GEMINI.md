# 🎨 MEGA PROMPT GEMINI - DESIGN COMPLET VUVENU

**Mission** : Générer l'interface utilisateur complète de VuVenu en un seul prompt

---

## 📋 PROMPT POUR GEMINI

```
Create a complete UI/UX design system for "VuVenu", a SaaS marketing platform for local businesses in French Reunion Island.

=== PROJECT CONTEXT ===

VuVenu helps local businesses (restaurants, hair salons, boutiques, craftsmen) create professional social media content without marketing expertise.

Core modules:
1. VIDEO SCRIPT GENERATOR: Creates optimized 30-60 sec Reels/TikTok scripts
2. META ADS GENERATOR: Generates complete ad campaigns with AI images + guided launch wizard

Target users: Non-tech local business owners who want more visibility but lack time/knowledge.

Official slogan: "ils ont vu — ils sont venu!" (they saw — they came!)
Value prop: "Digital marketing finally simple for your business"

=== VISUAL STYLE DIRECTION ===

Inspired by Vogue Business x Archrival "Gen Z Broke the Marketing Funnel" visual identity:
- Pixelated/8-bit decorative elements (squares, geometric shapes)
- Mix of cut-out photos and illustrations
- Bold, vibrant colors with dynamic asymmetric layouts
- Young, digital but human feeling
- NOT corporate or cold

Color palette:
- Electric Lime: #BFFF00 (primary CTA, highlights)
- Pixel Blue: #60A5FA (graphics, backgrounds)
- Soft Violet: #C4B5FD (secondary sections, cards)
- Pale Rose: #FECDD3 (soft backgrounds, hover states)
- Cream: #FFFBEB (main background)
- Deep Dark: #0F172A (primary text)
- White: #FFFFFF (text on dark backgrounds)

Typography:
- Headers: Inter/Satoshi Bold, uppercase for impact
- Body: Inter Regular
- Accents: Elegant script (Playfair Display Italic) for highlights

Signature elements:
- Small colored pixel squares (lime, blue) scattered decoratively
- Cut-out photos of real local business owners
- Highlighted text with colored marker effects
- Mix of organic circles + geometric pixel squares

=== COMPLETE INTERFACE TO DESIGN ===

Design ALL of these screens as a cohesive system:

**1. LANDING PAGE (Marketing Site)**
- Hero section with slogan "ils ont vu — ils sont venu!"
- Features showcase (Script Generator, Meta Ads, Wizard)
- Pricing table (Starter 59€, Pro 119€, Business 249€)
- Testimonials from local businesses
- CTA sections
- Footer with legal links

**2. AUTHENTICATION PAGES**
- Login form (email, password)
- Registration form (email, password, confirm)
- Forgot password form
- Email verification page
- Password reset form

**3. ONBOARDING WIZARD (4 steps)**
- Step 1: Business name input
- Step 2: Business type selection (Restaurant, Salon, Boutique, Craftsman, Service Provider, Other)
- Step 3: Target audience description (textarea)
- Step 4: Main goal selection (Attract more clients, Retain clients, Launch offer/promo, Build brand awareness)
- Progress bar + navigation

**4. PLAN SELECTION PAGE**
- 3 pricing tiers with limits:
  - Starter (59€): 10 scripts/month, 0 campaigns
  - Pro (119€): 30 scripts/month, 5 campaigns/month
  - Business (249€): unlimited scripts & campaigns
- Feature comparison table
- Payment CTA buttons

**5. MAIN DASHBOARD**
- Dark sidebar (#0F172A) with lime accents (#BFFF00):
  - VuVenu logo
  - Dashboard (active)
  - Scripts Vidéos
  - Campagnes Meta Ads
  - Paramètres
  - User profile dropdown
- Main content area (cream background):
  - Welcome message "Salut [Prénom]! 👋"
  - Stats cards: Scripts créés, Campagnes lancées, Jours restants
  - Quick actions: "Créer un script", "Nouvelle campagne"
  - Recent activity feed
- Usage meter showing monthly limits

**6. VIDEO SCRIPT GENERATOR**
- Multi-step form:
  - Product/Service to promote
  - Target audience
  - Tone selection (Professional, Casual, Energetic, Friendly)
  - Duration (30s, 45s, 60s)
  - Call-to-action preference
- Real-time preview area
- Generated script display with:
  - Hook, Main content, CTA sections clearly separated
  - Copy to clipboard button
  - Download options
  - Save to library button
  - Regenerate option

**7. META ADS GENERATOR - CONCEPT CREATION**
- Campaign setup form:
  - Campaign name
  - Business type
  - Product/service focus
  - Budget range
  - Target audience details
  - Campaign objective
- Generated concepts display (3-4 concepts):
  - TOF (Top of Funnel): Awareness concepts
  - MOF (Middle of Funnel): Consideration concepts
  - BOF (Bottom of Funnel): Conversion concepts
- Each concept shows:
  - Primary text preview
  - Headline
  - Description
  - Generated image placeholder
  - Performance prediction
  - Edit/customize buttons

**8. 7-STEP LAUNCH WIZARD (VuVenu's key differentiator)**
Step-by-step guided flow:
- Step 1: Business type confirmation
- Step 2: Product/service selection
- Step 3: Campaign objective setting
- Step 4: Budget and duration
- Step 5: Audience targeting (with AI suggestions)
- Step 6: Concept selection and customization
- Step 7: Final review and launch
Each step with clear progress indicator, help text, and smooth transitions

**9. CAMPAIGNS MANAGEMENT**
- Campaign list view:
  - Active, Draft, Completed tabs
  - Each campaign card shows: name, status, spend, results, dates
  - Quick actions: View, Edit, Pause, Clone
- Campaign detail view:
  - Performance metrics (impressions, clicks, conversions)
  - Ad preview
  - Audience insights
  - Spend breakdown
  - Edit campaign button

**10. SCRIPTS LIBRARY**
- Grid/list view toggle
- Filter by: Date, Tone, Duration, Performance
- Each script card shows: title, preview, date created, usage stats
- Actions: View, Copy, Edit, Delete, Share
- Search functionality
- Export options

**11. SETTINGS PAGE**
- Account information (name, email, business details)
- Subscription management (current plan, usage, upgrade options)
- Billing information
- Notification preferences
- Account deletion option

**12. PAYMENT/BILLING PAGES**
- Stripe checkout integration mockup
- Invoice history
- Payment method management
- Billing address
- Usage and limits display

=== SPECIFIC DESIGN REQUIREMENTS ===

**Mobile-First Design:**
- All screens must work perfectly on mobile (70% of local business traffic)
- Touch-friendly buttons and forms
- Collapsible navigation
- Optimized for one-hand usage

**French UI:**
- All text in French
- Local business context (Réunion island references where appropriate)
- Error messages and help text in friendly French
- Currency in Euros (€)

**Accessibility:**
- High contrast ratios
- Clear visual hierarchy
- Readable fonts at small sizes
- Color-blind friendly palette

**Loading States & Interactions:**
- AI generation progress indicators
- Smooth transitions between wizard steps
- Hover states for buttons and cards
- Empty states with encouraging messaging
- Error states with helpful guidance

**Data Display:**
- Clear metrics visualization
- Progress bars for usage limits
- Status indicators (active, draft, pending)
- Performance graphs (simple and readable)

=== TECHNICAL NOTES FOR IMPLEMENTATION ===

Built with:
- Next.js 14 App Router + TypeScript
- Tailwind CSS (custom VuVenu colors configured)
- shadcn/ui components
- Supabase authentication & database
- Stripe payments
- Anthropic Claude API (script generation)
- Google Gemini API (image generation)

=== DELIVERABLE ===

Generate a comprehensive visual design system showing:

1. **Style guide** with colors, typography, components, spacing
2. **All 12+ screen designs** listed above with pixel-perfect detail
3. **Component library** (buttons, forms, cards, navigation elements)
4. **Mobile responsive** versions of key screens
5. **User flow diagrams** showing navigation between screens
6. **Interactive elements** clearly defined (hover states, loading states)

Make it cohesive, professional yet approachable, and authentically "VuVenu" with the Vogue x Archrival aesthetic.

The end result should feel like a premium SaaS tool that local business owners would be excited to use, not intimidated by.

Focus on clarity, ease of use, and visual appeal that matches the bold, modern, pixel-enhanced brand identity.
```

---

## 🎯 INSTRUCTIONS D'UTILISATION

1. **Copie ce prompt complet** dans Gemini ou Claude
2. **Génère le design** complet en une fois
3. **On peaufine ensemble** après génération
4. **J'intègre** le design dans Next.js

---

*Mega prompt créé le 13 janvier 2026*
*Couvre l'intégralité de l'interface VuVenu MVP*