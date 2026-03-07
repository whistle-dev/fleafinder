**Product Requirements Document (PRD)**

**Product Name (Working Title): Flea Finder**

**/LoppeFinder /MarketMap**

**1. Overview**

**Flea Finder** is a web-based MVP platform that aggregates all flea
markets in Copenhagen into one simple, searchable overview.

The purpose is to:

-   Make it easier for users to discover flea markets

    > Increase visibility for smaller markets

    > Provide a fair alternative to high-cost, commercialized flea
    > markets

    > Offer both Danish and English access for locals and tourists

The MVP will focus on:

-   Market discovery

    > Map overview

    > Calendar view

    > Simple market submission (no user accounts)

    > Language toggle (Danish/English)

Future features (NOT part of MVP):

-   User accounts

    > Stall booking system

    > Payment system

    > Reviews & ratings

    > Mobile app

**2. Goals**

**Primary Goals**

-   Collect all Copenhagen flea markets in one place

    > Help smaller markets gain visibility

    > Make it easy to see what's happening today or upcoming

**Success Criteria (MVP)**

-   Users can:

    -   View all markets

    -   Filter by date (Today / Upcoming)

    -   View markets in calendar format

    -   See markets on a map

    -   Search for a specific market

    -   Switch language (DA/EN)

```{=html}
<!-- -->
```
-   Organizers can:

    -   Submit a market via form

    -   Add image, address, date, description

**3. Target Users**

**1. Visitors**

-   Copenhagen locals

    > Danish users

    > Tourists

    > Students

    > Sustainable fashion lovers

Needs:

-   Quick overview

    > Map view

    > Date-based browsing

    > English option

**2. Market Organizers**

-   Small independent flea markets

    > Community markets

    > School/church yard sales

Needs:

-   Simple submission form

    > Visibility

    > Easy editing (optional future feature)

**4. Core Features (MVP)**

**4.1 Market Listing Overview Page**

**Description:** Main landing page showing all markets.

**Includes:**

-   List view of markets

    > Filter options:

    -   Today

    -   Upcoming

```{=html}
<!-- -->
```
-   Sort by:

    -   Date

    -   Name

```{=html}
<!-- -->
```
-   Search bar (name + location)

**4.2 Calendar View**

Users can toggle between:

-   List view

    > Calendar view

Calendar must:

-   Display markets by date

    > Allow clicking on a date

    > Show markets happening that day

    > Option to export event to personal calendar (Google / Apple / .ics
    > file)

**4.3 Map Integration**

![](vertopal_ae51b538571144f7a5ac761388741219/media/image1.jpeg){width="2.3305555555555557in"
height="4.165277777777778in"}

![](vertopal_ae51b538571144f7a5ac761388741219/media/image2.jpeg){width="6.6930555555555555in"
height="3.7645833333333334in"}

![](vertopal_ae51b538571144f7a5ac761388741219/media/image3.png){width="4.415972222222222in"
height="9.330555555555556in"}

4

**Description:** Interactive map showing all markets pinned
geographically.

**Functionality:**

-   All markets displayed as pins

    > Clicking pin shows:

    -   Market name

    -   Date

    -   Address

    -   "View Details" button

```{=html}
<!-- -->
```
-   Zoom in/out

    > Auto-center on Copenhagen area

Future:

-   Filter map by date

**4.4 Market Detail Page**

Each market should have its own page.

**Fields:**

-   Market name

    > Cover image

    > Date & time

    > Address

    > Description

    > Google Maps link

    > Category (optional)

    > Button: "Add to Calendar"

**4.5 Search Function**

Search bar that supports:

-   Market name

    > Location

    > Keywords in description

Should be:

-   Fast

    > Autocomplete (optional but nice-to-have)

**4.6 Market Submission Form (No Account Required)**

![](vertopal_ae51b538571144f7a5ac761388741219/media/image4.png){width="5.559722222222222in"
height="4.165277777777778in"}

![](vertopal_ae51b538571144f7a5ac761388741219/media/image5.png){width="6.6930555555555555in"
height="6.916666666666667in"}

4

**Accessible from:** "Add Market" button

**Fields required:**

-   Market name

    > Date

    > Start & end time

    > Address

    > Description

    > Upload image

    > Contact email

    > Category (optional)

After submission:

-   Admin approval required (manual moderation recommended)

    > Market appears once approved

**4.7 Language Toggle (DA / EN)**

Top-right toggle switch:

-   Danish

    > English

Requirements:

-   Entire UI translatable

    > Market descriptions remain as submitted

    > Default language auto-detect based on browser

**5. Categories (Optional for MVP, but Recommended)**

Possible categories:

-   Clothing

    > Vintage

    > Kids

    > Furniture

    > Design

    > Mixed

Users can filter by category.

**6. Technical Requirements (MVP-Level)**

**Platform**

-   Web app (mobile-first design)

    > Responsive design

**Suggested Stack (if helpful for developer)**

-   Frontend: Next.js

    > Backend: Supabase

    > Hosting: Vercel / Netlify

**7. Non-Functional Requirements**

-   Fast loading time

    > SEO optimized (important for tourists searching "flea market
    > Copenhagen")

    > GDPR compliant (collect minimal personal data)

    > Secure image uploads

**8. MVP Scope Summary**

Included: ✔ Market overview ✔ Calendar view ✔ Map with pins ✔ Search ✔
Market submission form ✔ Language toggle

Not included: ✘ User accounts ✘ Booking system ✘ Payments ✘ Reviews ✘
Notifications

**9. Future Roadmap (Phase 2+)**

-   Organizer accounts

    > Recurring markets

    > Booking + payment system

    > Featured markets

    > Push notifications

    > Native mobile app

    > Social sharing

    > User favorites

**Questions I Still Have For You**

To close all holes:

1.  Should anyone be able to submit a market, or do you want manual
    > approval?

2.  Should markets automatically expire after their date passes?

3.  Do you want recurring weekly markets supported in MVP?

4.  Do you want ads eventually --- or stay completely non-commercial?

5.  Do you want the tone to feel:

    -   Minimal & modern

    -   Playful & colorful

    -   Sustainable & earthy

Honestly --- this is a very strong idea. It has social value, community
value, and real product potential.

If you'd like, next we can:

-   Turn this into a developer-ready technical spec

    > Or refine branding (name, tone, visual identity)

    > Or define a launch strategy for Copenhagen

What's the next step you want to take?
