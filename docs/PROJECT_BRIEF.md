# PROJECT: MISSCHE DRESS RENTALS
## Fashion Rental Catalog & Availability Management System

You are my senior frontend developer, UI/UX designer, and project architect.

Your task is to build a polished, responsive, production-minded website for **Missche Dress Rentals**, a dress rental business based in Calamba, Laguna, Philippines.

IMPORTANT: I am using Claude Free Tier. Work efficiently, manage your context, and prioritize delivering actual working files over lengthy explanations.

---

## 1. BUSINESS INFORMATION

Business name: Missche Dress Rentals

Facebook page:
https://www.facebook.com/profile.php?id=61592192577429

Business description:

"Our Vietnam LONG DRESS Collection!

YOUR DREAM DRESSES ARE HERE.

Luxury meets affordability!

Beautiful dresses direct from Vietnam & BKK, perfect for:
- Weddings
- Birthdays
- Graduations
- Photoshoots
- Special occasions

Rental prices range from ₱399 to ₱899.

Why Rent Instead of Buy?
- Save money
- Wear premium dresses
- Perfect for one-time events
- No need for storage
- Always wear something new
- Feel confident and elegant

Location: Brgy. Bañadero, Calamba, Laguna, Philippines.

Services:
- Mini fitting studio
- Lalamove delivery available
- Customer inquiries through email."

Do not invent the owner's email address, actual inventory, dress names, sizes, or availability.

Create configuration placeholders for information that has not yet been provided.

Use the provided Facebook screenshot and business information as branding references.

---

## 2. PROJECT OBJECTIVE

Build a modern fashion rental website with two main interfaces:

A. CUSTOMER WEBSITE
- Browse dress collections.
- View dress photographs.
- See rental prices.
- Check date-based availability.
- View dress details.
- Contact the owner through email.

B. OWNER DASHBOARD
- Add dresses.
- Edit dress information.
- Upload dress photographs.
- Manage rental prices.
- Manage dress availability.
- Block reserved dates.
- Archive dresses.

IMPORTANT SCOPE:
This is NOT an e-commerce website.

Do not implement:
- Online payments.
- Shopping carts.
- Checkout.
- Automatic booking confirmation.
- Customer accounts.
- Complicated reservation workflows.

The customer only checks availability and contacts the owner through email. The owner handles confirmation manually.

---

## 3. TECHNOLOGY STACK

Use:

- React
- Vite
- JavaScript (NOT TypeScript)
- Tailwind CSS
- shadcn/ui
- Magic UI
- Lucide React
- Motion

Use reusable components and maintain a clean, understandable project structure.

Avoid:
- Next.js unless genuinely necessary.
- Bootstrap.
- Unnecessary UI libraries.
- Complicated architecture.
- Excessive dependencies.
- Hardcoded page layouts.
- Repeated CSS.
- Unnecessary animations.

Use shadcn/ui for consistent components and Magic UI selectively for polished visual details.

---

## 4. DESIGN DIRECTION

Design this like a premium fashion boutique.

The website should feel:
- Feminine.
- Elegant.
- Modern.
- Minimal.
- Premium.
- Welcoming.
- Fashion-oriented.

Suggested palette:
- Blush Pink: #F8E9EB
- Dusty Rose: #E7C5CB
- Ivory: #FFF9F4
- Rose: #9B5969
- Charcoal: #292426

Typography should combine an elegant editorial heading font with a clean modern sans-serif for body content.

Design requirements:

- Large, beautiful dress photography.
- Proper image proportions.
- Elegant typography.
- Generous spacing.
- Consistent border radius.
- Soft shadows.
- Subtle animations.
- Beautiful hover interactions.
- Clean navigation.
- Responsive layouts.
- Premium product cards.
- Consistent loading, empty, and error states.

Do not make it look like a generic admin template.

Do not overuse pink, gradients, glassmorphism, or animated backgrounds.

Prioritize actual dress photographs over decorative effects.

---

## 5. CUSTOMER WEBSITE PAGES

### HOME PAGE

Include:
- Elegant navigation.
- Missche branding.
- Hero section with large fashion imagery.
- Headline: "Your Dream Dress, For Your Special Moments."
- Short business introduction.
- Browse Collection CTA.
- Featured dresses.
- Rental benefits.
- About section.
- Location and contact information.
- Footer with Facebook link.

### DRESS COLLECTION

Include:
- Responsive dress grid.
- Dress photographs.
- Dress names.
- Dress codes.
- Rental prices.
- Availability indicators.
- Search functionality.
- Category filters.
- Sorting options.

Make the collection visually attractive.

### DRESS DETAILS

Each dress should have:
- Multiple photographs.
- Dress name.
- Unique dress code.
- Description.
- Rental price.
- Available sizes.
- Color.
- Measurements, if supplied.
- Availability calendar.
- Contact Owner button.

### AVAILABILITY CALENDAR

Implement date-based availability.

Availability must be associated with individual dresses.

A dress can be available on one date and reserved on another.

The owner should be able to:
- Block dates.
- Mark confirmed rental periods.
- Restore availability.
- Mark dresses temporarily unavailable.

Do not use a single global availability status as a substitute for date-based availability.

### EMAIL CONTACT

When a customer clicks Contact Owner:

Open the user's default email application using a mailto link.

Prefill:
- Dress name.
- Dress code.
- Requested rental date.
- Customer inquiry.

Use an OWNER_EMAIL configuration placeholder.

Do not invent an email address.

Include sensible fallback instructions if the email address is not configured.

---

## 6. OWNER DASHBOARD

Create a separate, clean management interface.

### Dashboard overview
- Total dresses.
- Available dresses.
- Reserved dresses.
- Unavailable dresses.
- Recently updated inventory.

### Dress management
- Add dress.
- Edit dress.
- Archive dress.
- Restore archived dress.
- Upload multiple images.
- Update pricing.
- Update sizes and descriptions.
- Set dress categories.

### Availability management
- Calendar interface.
- Block specific dates.
- Set rental periods.
- View reserved dates.
- Update availability.

### Image management
Use reusable image handling components.

Support multiple photographs per dress.

Do not permanently depend on external image URLs for the final system.

---

## 7. DATA ARCHITECTURE

For the first development phase, use:

- Local sample data.
- localStorage for prototype persistence.
- A separated data-service layer.

Create a structure that can later connect to Supabase or another backend without rewriting the customer-facing interface.

IMPORTANT:

localStorage is only for local development and demonstration.

Do not describe this prototype as genuinely real-time or multi-user.

Prepare clean interfaces for future:
- Database integration.
- Image storage.
- Owner authentication.
- Shared availability updates.

Do not implement a fake secure authentication system.

Clearly document what works locally and what requires a future backend.

---

## 8. PROJECT STRUCTURE

Keep the project organized.

Suggested structure:

src/
  components/
    layout/
    shared/
    dresses/
    availability/
    dashboard/
    ui/

  pages/
    Home.jsx
    Collection.jsx
    DressDetails.jsx
    About.jsx
    Contact.jsx
    Dashboard.jsx

  services/
    dressService.js
    availabilityService.js

  data/
    dresses.js

  hooks/
  utils/
  config/
  assets/

public/

README.md
CLAUDE_HANDOFF.md
.env.example

You may improve this structure if necessary, but keep it understandable and maintainable.

---

## 9. RESPONSIVENESS AND QUALITY

Test:
- Desktop.
- Tablet.
- Small mobile devices.

Ensure:
- No horizontal overflow.
- Navigation works on mobile.
- Dress cards resize properly.
- Images maintain appropriate proportions.
- Calendar remains usable.
- Modals fit small screens.
- Forms have validation.
- Buttons actually work.
- No broken routes.
- No console errors.
- No missing assets.

Use accessible labels and semantic HTML.

Do not leave nonfunctional buttons or fake interactions.

---

## 10. DEVELOPMENT MILESTONES

Work in these stages:

MILESTONE 1:
- Project setup.
- Dependencies.
- Global design system.
- Navigation.
- Home page.
- Responsive layout.

MILESTONE 2:
- Dress collection.
- Search and filtering.
- Dress details.
- Sample inventory.

MILESTONE 3:
- Availability calendar.
- Email inquiry functionality.
- Date management.

MILESTONE 4:
- Owner dashboard.
- Dress CRUD.
- Image management.
- Availability management.

MILESTONE 5:
- Integration-ready architecture.
- Responsive testing.
- Bug fixes.
- Documentation.

Do not attempt to build everything in one enormous operation.

Complete, verify, and checkpoint each milestone before moving forward.

---

## 11. CRITICAL DELIVERABLE AND CONTEXT-LIMIT RULES

THIS SECTION HAS THE HIGHEST PRIORITY.

I am using Claude Free Tier, so you MUST prioritize project preservation.

1. Start by inspecting the current project directory and GitHub repository, if supplied.

2. Do not waste tokens explaining your plans repeatedly. Start implementing.

3. Work in small milestones.

4. After MILESTONE 1, immediately create a ZIP archive of the working project.

5. Save the ZIP in:

deliverables/missche-dress-rentals-v1.zip

6. Verify that the ZIP exists and contains the actual source files.

7. Update the ZIP after every major milestone.

8. Before approximately 60–65% of your usable context or session capacity, prioritize:
   - Saving all changes.
   - Creating the latest ZIP.
   - Committing changes to Git.
   - Updating CLAUDE_HANDOFF.md.
   - Recording unfinished tasks.

9. NEVER wait until the context limit to create the ZIP.

10. Do not spend the remaining context on explanations, unnecessary refactoring, or decorative improvements while the deliverables are missing.

11. Exclude node_modules, .git, and temporary build files from the ZIP.

12. Include all necessary source files, configuration files, documentation, and package-lock.json.

13. Run the build and fix errors before declaring a milestone complete.

14. If you cannot finish everything, deliver the last working version rather than an incomplete project.

15. If your environment supports file attachments, attach the ZIP in your response. Do not merely tell me that it was created.

---

## 12. GITHUB HANDOFF

The project must be transferable to another Claude account.

Prepare:

CLAUDE_HANDOFF.md containing:
- Project objective.
- Business information.
- Technology stack.
- Current implementation.
- Project structure.
- Completed milestones.
- Remaining tasks.
- Known issues.
- Important design decisions.
- How to install dependencies.
- How to run locally.
- How to build.
- How to continue development.

Keep README.md beginner-friendly.

If a GitHub repository is already supplied, inspect it before making changes.

If not, prepare the local Git repository and give me the exact commands to publish it.

Never overwrite an existing repository or force-push without permission.

Commit changes after each major milestone with descriptive commit messages.

Do not commit credentials, API keys, or private information.

---

## 13. FINAL RESPONSE FORMAT

At the end of each milestone, report only:

1. What was completed.
2. What was tested.
3. Known issues.
4. ZIP file location and attachment, if supported.
5. Git commit status.
6. What the next Claude account should work on.

Be concise.

Start with MILESTONE 1.

Remember: A working project, an accessible ZIP, and a complete handoff are more important than lengthy explanations or unfinished visual polish.