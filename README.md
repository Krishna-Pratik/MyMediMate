# MyMediMate - Hospital Appointment Scheduler

[![Deploy to GitHub Pages](https://github.com/Krishna-Pratik/MyMediMate/actions/workflows/deploy.yml/badge.svg)](https://github.com/Krishna-Pratik/MyMediMate/actions/workflows/deploy.yml)

## Project Overview

MyMediMate is a modern hospital appointment scheduling system that provides an intuitive interface for managing doctor appointments with day and week calendar views.

**Live Demo:** [https://krishna-pratik.github.io/MyMediMate/](https://krishna-pratik.github.io/MyMediMate/)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps to run the project locally:

```sh
# Clone the repository
git clone https://github.com/Krishna-Pratik/MyMediMate.git

# Navigate to the project directory
cd MyMediMate

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
npm run build
```

## Tech Stack

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React** - UI library
- **shadcn-ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Modern date utility library
- **React Router** - Client-side routing
- **Tanstack Query** - Data fetching and caching

## Features

- 📅 Day and Week calendar views
- 👨‍⚕️ Multi-doctor appointment management
- 🎨 Clean, modern UI with shadcn-ui components
- 📱 Responsive design
- ⚡ Fast and performant
- 🔍 Appointment filtering and search
- 🎯 Type-safe with TypeScript

---

## Architecture Documentation

### Architecture Decisions

This project follows **modern frontend architecture patterns** with a focus on separation of concerns and maintainability:

#### 1. **Service Layer Pattern**
- Created `AppointmentService` class to abstract all data access logic
- Centralized business rules for filtering appointments by doctor, date, and week
- Makes it easy to swap mock data for real API calls in the future
- Methods are static since we're working with immutable mock data

#### 2. **Headless Components / Custom Hooks**
- Implemented `useAppointmentScheduler` hook to separate business logic from UI
- Returns structured data (appointments, time slots, doctor info) that any component can consume
- Enables testing logic independently from React components
- Follows the "headless component" pattern for maximum reusability

#### 3. **Composable Component Architecture**
- Split calendar views into focused, single-responsibility components:
  - `DayView` - Handles single day rendering
  - `WeekView` - Handles 7-day grid rendering
  - `AppointmentCard` - Reusable appointment display
  - `DoctorSelector` - Isolated doctor selection logic
- Each component can be tested and modified independently
- Easy to add new views (e.g., Month View) by composing existing components

#### 4. **Design System Approach**
- Used Tailwind CSS with semantic color tokens in `index.css`
- Defined appointment type colors as CSS custom properties
- Ensures consistent theming across the application
- Easy to implement dark mode or rebrand in the future

#### 5. **TypeScript-First Development**
- Strict typing throughout with no `any` types
- Type definitions in `src/types/index.ts` serve as documentation
- Compile-time safety prevents bugs before runtime
- Better IDE autocomplete and refactoring support

### Component Structure

```
Index (Main Page)
├── DoctorSelector
│   └── Select (shadcn-ui)
│
├── Calendar (react-day-picker)
│
├── View Mode Toggles (Buttons)
│
└── Calendar Views
    ├── DayView
    │   ├── ScrollArea
    │   └── AppointmentCard (multiple)
    │
    └── WeekView
        ├── ScrollArea
        └── AppointmentCard (multiple, per day)
```

**Data Flow:**
1. User selects doctor → Updates `selectedDoctorId` state
2. User selects date → Updates `selectedDate` state
3. `useAppointmentScheduler` hook recomputes based on doctor + date
4. Service layer filters appointments from mock data
5. Components receive filtered data and render accordingly

**Key Design Choices:**
- **Controlled components** for all inputs (doctor selector, date picker)
- **Single source of truth** in Index page state
- **Unidirectional data flow** from parent to children
- **No prop drilling** - hooks access service layer directly when needed

### Trade-offs & Future Improvements

#### What Would I Improve With More Time?

**1. Enhanced Time Slot Rendering**
- **Current:** Fixed 30-minute slots, appointments displayed within slots
- **Improvement:** Calculate exact pixel positioning based on start/end times for visual accuracy
- **Trade-off:** Current approach is simpler and easier to maintain, but less visually precise for appointments that don't align to 30-min boundaries

**2. Overlapping Appointment Handling**
- **Current:** Overlapping appointments stack vertically
- **Improvement:** Side-by-side rendering with width calculation (like Google Calendar)
- **Trade-off:** Chose simplicity over complexity - vertical stacking is easier to implement and still functional

**3. Performance Optimization**
- **Current:** Recalculates appointments on every render when date/doctor changes
- **Improvement:** Implement `React.memo` for AppointmentCard, use virtual scrolling for large datasets
- **Trade-off:** With 50 appointments, performance is fine; optimization would add complexity without current benefit

**4. Accessibility Enhancements**
- **Current:** Basic semantic HTML and ARIA labels from shadcn-ui components
- **Improvement:** 
  - Keyboard navigation for time slots and appointments
  - Screen reader announcements for appointment details
  - Focus management when switching views
  - ARIA live regions for dynamic content updates
- **Trade-off:** Time constraints prioritized core functionality over advanced a11y

**5. Loading & Error States**
- **Current:** Basic loading state (though mock data loads instantly)
- **Improvement:** Skeleton loaders, retry logic, error boundaries
- **Trade-off:** Mock data scenario doesn't require complex loading states

**6. State Management**
- **Current:** Local component state with hooks
- **Improvement:** Context API or Zustand for global state (if app grows)
- **Trade-off:** Local state is simpler for current scope; global state would be overkill

**7. Testing**
- **Current:** No tests implemented
- **Improvement:** 
  - Unit tests for AppointmentService methods
  - Hook tests for useAppointmentScheduler
  - Component tests for Day/Week views
  - E2E tests for user flows
- **Trade-off:** Tests weren't part of the 3-4 hour scope

**8. Mobile Optimization**
- **Current:** Responsive design, but week view is cramped on mobile
- **Improvement:** 
  - Mobile-first design with swipeable days
  - Single day view as default on mobile
  - Bottom sheet for appointment details
- **Trade-off:** Desktop-first approach meets requirements, mobile is usable but not optimal

**9. Empty States & Edge Cases**
- **Current:** Basic empty state handling
- **Improvement:** 
  - Helpful messages for no appointments
  - Visual indicators for outside working hours
  - Handling of appointments spanning midnight
- **Trade-off:** Happy path prioritized over edge cases

**10. Date Range Validation**
- **Current:** Can select any date, even if no appointments exist
- **Improvement:** Highlight dates with appointments, disable dates outside data range
- **Trade-off:** Simple is better for demo purposes

## Author

**Krishna Pratik**
- GitHub: [@Krishna-Pratik](https://github.com/Krishna-Pratik)

## License

This project is open source and available under the MIT License.
