# Campus Connect

Campus Connect is a student networking and support platform for finding tutors,
joining events, discovering groups, sending messages, sharing skills, and
keeping campus activity organized in one place.

The site is built as a polished browser experience with HTML, CSS, and vanilla
JavaScript. It uses browser storage for account state, saved profile details,
reviews, filters, and interactive page behavior.

## Live Demo

- https://campus-connect-phi-teal.vercel.app/

## Features

- Simplified navigation for Home, Discover, People, Community, Inbox, and Profile
- Grouped student hub for academic support, campus community, and student tools
- Account pages for sign in, registration, email verification, and password reset
- Profile editor with saved preview details
- Tutor listings with filters, recommendations, ratings, and reviews
- Student requests for classmates looking for academic help
- Campus-wide search for people, tutors, subjects, interests, and events
- Event listings, RSVP actions, waitlist actions, and event creation
- Group discovery and group detail pages
- Inbox-style messaging screen
- Campus map with study, event, and meetup pins
- Skill exchange marketplace
- Admin dashboard for users, flagged content, and engagement analytics
- Community guidelines and reporting flow
- Custom Campus Connect symbol and browser tab icon

## Design Notes

Campus Connect keeps the main navigation intentionally short. Detailed tools
such as Requests, Search, Map, Skill Exchange, Guidelines, and Admin live inside
the homepage hub or related pages, so the site feels easier to scan.

The interface uses responsive cards, page-specific hero images, accessible form
labels, a mobile navigation drawer, active navigation states, and browser-saved
state for a smoother user experience.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage
- Responsive CSS Grid and Flexbox
- Custom SVG symbol assets

## Project Structure

```text
Campus-Connect/
  index.html
  network.html
  login.html
  register.html
  verify.html
  forgot.html
  profile.html
  tutors.html
  requests.html
  search.html
  events.html
  event.html
  event_create.html
  groups.html
  group.html
  messages.html
  map.html
  skills.html
  admin.html
  contact.html
  about.html
  guidelines.html
  styles.css
  app.js
  assets/
  images/
```

## Author

Built by Fidel Anyanwu.
