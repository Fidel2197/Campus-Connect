# Campus Connect — Milestone 3 (Frontend Prototype)

This submission represents the frontend-only prototype for **Campus Connect**, built for Milestone 3 of the course project. This version includes only **HTML, CSS, and JavaScript**, as required. No backend, database, authentication services, or server logic are included — all functionality is simulated via UI and localStorage placeholders.

The purpose of this milestone is to demonstrate the **Graphical User Interface (GUI)** and user experience for the main features that will be developed fully in the final project (Milestone 4).

---

## Features Implemented (UI Only)

The prototype includes full UI mockups for the following pages:
### Core Screens
- **Home**
- **Network (Discover)**
- **Profile + Preview**
- **Login / Register / Verify / Forgot Password**
- **Tutors & Ratings**
- **Requests (students looking for help)**
- **Search Page**
- **Events (List, Filter, Detail, Create)**
- **Groups (List + Group Page)**
- **Messages (mock chat UI)**
- **Map (interactive pins, filter layers)**
- **Skill Exchange**
- **Admin Dashboard**
- **Guidelines & Report Form**
- **Contact Page**
- **About Page**

All pages include full navigation, layout, and visual components.

---

## Responsive Design

The site uses:
- Flexbox and CSS Grid
- A mobile navigation drawer using JavaScript
- A `<900px` media query for layout adjustments
- Fluid buttons, cards, and forms
---

## Accessibility Features

Implemented accessibility improvements include:
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Labeled form inputs
- `aria-label` for navigation
- `aria-live="polite"` for the message badge
- High-contrast theme
- Keyboard-friendly interaction patterns

---

## Form Validation & Security (Frontend Only)

Even though backend is not included, the prototype demonstrates:

- HTML5 validation (`required`, `type="email"`, `minlength`, etc.)
- `form.checkValidity()` for JS validation
- A `sanitize()` function to prevent unsafe HTML injection in the UI
- Mock hashing (`btoa`) for demonstration only
- Mock authentication stored in `localStorage` for UI state only

These techniques will be replaced by **secure server-side logic** in the final milestone.

---

## Technologies Used
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- No external frameworks (per milestone rules)
- No backend code included
---
## File Structure
campus_connect/
│── index.html
│── network.html
│── login.html
│── register.html
│── verify.html
│── forgot.html
│── profile.html
│── tutors.html
│── requests.html
│── search.html
│── discover.html
│── events.html
│── event.html
│── event_create.html
│── groups.html
│── group.html
│── messages.html
│── map.html
│── skills.html
│── admin.html
│── contact.html
│── about.html
│── guidelines.html
│── styles.css
│── app.js
│── images/
│── icons/
