<conversation_summary>
<decisions>
1. Use Next.js App Router with route groups for authentication and main application
2. Authentication flow: separate pages for login and register
3. Primary navigation structure: sidebar for desktop, hamburger menu for mobile
4. Notes list view: list layout with infinite scroll, summary view with expandable details
5. Note creation/editing: single page with creation form on top, list below
6. Search interface: unified search bar supporting all search types (date, category, keyword, semantic)
7. AI analysis status: real-time updates using polling, show status indicators
8. Note sharing: accessible from note detail view, dedicated page with unique URL
9. Category management: separate page for category list, dropdown on main page (nice to have)
10. Tag management: tags displayed as chips, create tags using #[tag name] syntax in note content
11. Shared notes: separate page/view, add to main menu with link, same layout as user notes (list with infinite scroll)
12. Pagination: infinite scroll for all note lists
13. Image handling: copy/paste to add images, one image per note, display as content with optional text
14. Error handling: toast notifications for all errors and success messages
15. Loading states: skeleton loaders for initial loads, spinner with info text for semantic search
16. Session management: automatic token refresh
17. Responsive design: responsive adaptation of the same interface across devices
18. Offline handling: application fails gracefully when network unavailable
19. Data synchronization: background refetching using React Query
20. Word limit: word counter component showing current/remaining words
21. Initial view: direct to notes list with "What's on your mind?" title and text input field
22. User vs shared notes: completely separate views, same layout (list with infinite scroll)
23. Category deletion: silent operation (no confirmation dialog)
24. Semantic search results: displayed same as other search types, always sorted by date (not relevance)
25. Image upload: upload and save only when note is saved, simple spinner during save
26. Version conflicts: simple error messaging (no complex conflict resolution UI)
27. Keyboard shortcuts: skip for MVP
28. AI analysis retry: show retry button on notes with failed analysis
29. Semantic search timeout: automatic fallback to keyword search
30. State management: organize Zustand stores by feature, follow best practices for React Query and Zustand interaction
</decisions>

<matched_recommendations>
1. Use Next.js App Router with route groups for authentication (`(auth)`) and main application (`(app)`) to leverage server-side rendering benefits while maintaining SPA-like navigation for authenticated routes.

2. Implement a unified search interface with a single search bar that allows users to switch between search types (date, category, keyword, semantic) via tabs or a dropdown, providing a consistent search experience across all modes.

3. Use React Query (TanStack Query) for all server state management (notes, categories, search results) with appropriate cache configurations, and use Zustand only for client-side UI state (modals, filters, form state).

7. Use cursor-based pagination with infinite scroll for the notes list to provide a seamless browsing experience, especially important for users with up to 10,000 notes.

12. Use toast notifications (via Shadcn/ui Toast component) for success messages (note created, shared, etc.) and error messages (API errors, validation errors) to provide non-intrusive feedback.

13. Implement skeleton loaders for initial data fetching (notes list, categories) and use spinners for actions (saving, searching) to provide clear loading feedback without blocking the UI.

16. Implement a session management hook that automatically checks token validity on route changes, handles token refresh if needed, and redirects to login on 401 errors with a clear message.

17. Structure the application with feature-based organization: `/app/(auth)/login`, `/app/(auth)/register`, `/app/(notes)/notes`, `/app/(notes)/notes/[id]`, `/app/(notes)/shared`, `/app/(search)/search`, `/app/(categories)/categories` to leverage Next.js route groups and layouts.

18. Use React Query's `useInfiniteQuery` for paginated data (notes list, search results) to handle cursor-based pagination seamlessly with built-in support for loading more data.

19. Implement a word counter component that displays current word count and remaining words (out of 2000) during note creation/editing, with visual warnings as the limit approaches.

30. Use React Query's `staleTime` and `cacheTime` configurations appropriately: short cache for frequently changing data (notes list), longer cache for relatively static data (categories, tags), and implement manual refetch triggers for user-initiated actions.

32. Create reusable API client hooks using React Query (e.g., `useNotes`, `useCreateNote`, `useSearchNotes`) that handle authentication headers, error handling, and loading states consistently across the application.

33. Implement a global notification system for AI analysis completion using React Query's refetch on window focus and polling for notes with pending analysis status, with subtle notifications when analysis completes.

35. Implement form validation using React Hook Form with Zod schemas that match the API validation rules, providing real-time feedback and preventing invalid submissions before API calls.

40. Use React Markdown for rendering note text content to support basic markdown formatting if users include markdown syntax, enhancing the note-taking experience without requiring a full rich text editor.
</matched_recommendations>

<ui_architecture_planning_summary>

## Main UI Architecture Requirements

### Application Structure
- **Framework**: Next.js 14 with App Router using route groups for logical organization
- **Routing**: Feature-based route structure with `(auth)` and `(app)` route groups
- **State Management**: 
  - React Query (TanStack Query) for all server state (notes, categories, search results, authentication)
  - Zustand for client-side UI state (modals, filters, form state, UI preferences)
  - State stores organized by feature (notes, categories, auth, UI)

### Component Library & Styling
- **UI Components**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Form Handling**: React Hook Form with Zod validation schemas matching API validation
- **Animations**: Framer Motion for smooth transitions and loading states

## Key Views, Screens, and User Flows

### Authentication Flow
- **Login Page**: `/app/(auth)/login` - Separate page with username/password form
- **Register Page**: `/app/(auth)/register` - Separate page with username/password form
- **Post-Authentication**: Automatic redirect to notes list page

### Main Application Views

#### 1. Notes List View (`/app/(notes)/notes`)
- **Layout**: Single page with note creation form at top, notes list below
- **Creation Form**: 
  - Title: "What's on your mind?"
  - Text input field for note content
  - Word counter (current/remaining out of 2000)
  - Image support via copy/paste (one image per note)
  - Tag creation using `#[tag name]` syntax in content
  - Category dropdown (nice to have)
  - Save button with spinner during save
- **Notes List**:
  - List layout with infinite scroll
  - Summary view showing title, preview, category, tags, keywords
  - Expandable details on click
  - AI analysis status indicators (pending, completed, failed)
  - Retry button visible for failed analyses
  - Each note links to dedicated detail page

#### 2. Note Detail View (`/app/(notes)/notes/[id]`)
- **Layout**: Dedicated page with unique URL
- **Content**: Full note content with text, links, images
- **Features**:
  - Edit capability (inline or separate edit mode)
  - Share functionality accessible from detail view
  - AI analysis status and retry option
  - Sharing information (who shared, when)
  - Category and tags display
  - Version conflict handling with simple error messaging

#### 3. Shared Notes View (`/app/(notes)/shared`)
- **Layout**: Separate page with same structure as user notes
- **Features**: 
  - List layout with infinite scroll
  - Shows notes shared with current user
  - Displays sharer information (username, shared date)
  - Read-only access (no editing)
  - Accessible from main navigation menu

#### 4. Search View (`/app/(search)/search`)
- **Layout**: Dedicated search page
- **Search Interface**: 
  - Unified search bar supporting all search types
  - Search type selector (date, category, keyword, semantic)
  - Date picker for date range search
  - Category selector for category search
  - Query input for keyword/semantic search
- **Results**:
  - Same display format for all search types
  - Always sorted by date (not relevance for semantic)
  - Infinite scroll pagination
  - Loading: spinner with info text for semantic search
  - Automatic fallback to keyword search on semantic timeout

#### 5. Categories Management (`/app/(categories)/categories`)
- **Layout**: Separate dedicated page
- **Features**:
  - List of all user categories
  - Category name and note count
  - Create, edit, delete capabilities
  - Silent deletion (no confirmation, notes automatically have category removed)
- **Integration**: Category dropdown on main notes page (nice to have)

#### 6. Tags View
- **Display**: Tags shown as chips/badges on notes
- **Creation**: Inline using `#[tag name]` syntax in note content
- **Management**: View all tags with usage counts (if dedicated page exists)

### Navigation Structure
- **Desktop**: Sidebar navigation with collapsible sections
  - Notes
  - Shared Notes
  - Categories
  - Search
- **Mobile**: Hamburger menu converting sidebar to mobile-friendly navigation
- **Responsive**: Same interface adapted responsively across breakpoints (640px, 768px, 1024px, 1280px)

## API Integration and State Management Strategy

### React Query Configuration
- **Server State**: All API data managed through React Query
- **Caching Strategy**:
  - Short cache time for frequently changing data (notes list)
  - Longer cache time for relatively static data (categories, tags)
- **Pagination**: `useInfiniteQuery` for cursor-based pagination with infinite scroll
- **Background Refetching**: Automatic refetching on window focus and polling for pending AI analysis
- **Custom Hooks**: Reusable hooks (`useNotes`, `useCreateNote`, `useSearchNotes`, etc.) handling:
  - Authentication headers
  - Error handling
  - Loading states
  - Consistent API integration

### Zustand State Management
- **Organization**: Feature-based stores (notes, categories, auth, UI)
- **Usage**: Client-side UI state only
  - Modal open/close states
  - Filter states
  - Form state (before submission)
  - UI preferences
- **Best Practices**: Clear separation from React Query, no duplication of server state

### API Integration Patterns
- **Authentication**: JWT tokens stored securely, automatic token refresh
- **Error Handling**: Toast notifications for all API errors and success messages
- **Loading States**: 
  - Skeleton loaders for initial data fetching
  - Spinners for actions (saving, searching)
  - Progress indicators for long operations
- **Optimistic Updates**: Not implemented for MVP (background refetching only)

## Responsiveness, Accessibility, and Security Considerations

### Responsive Design
- **Approach**: Responsive adaptation of the same interface
- **Breakpoints**: Tailwind CSS breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Mobile-First**: Base styles target mobile devices
- **Navigation**: Sidebar on desktop, hamburger menu on mobile
- **Layout**: Single-column on mobile, multi-column on desktop where appropriate

### Accessibility
- **Components**: Shadcn/ui built on Radix UI primitives (ARIA-compliant)
- **Keyboard Navigation**: Standard form and navigation support (keyboard shortcuts skipped for MVP)
- **Screen Readers**: Proper semantic HTML and ARIA labels
- **Focus Management**: Proper focus handling in modals and forms

### Security Considerations
- **Authentication**: 
  - JWT token management with automatic refresh
  - Session validation on route changes
  - Automatic redirect to login on 401 errors
- **Input Validation**: 
  - React Hook Form with Zod schemas matching API validation
  - Real-time validation feedback
  - Prevention of invalid submissions
- **Error Messages**: Generic error messages for security (no sensitive data exposure)
- **Token Storage**: Secure storage of JWT tokens (httpOnly cookies or secure localStorage)

### Offline Handling
- **Strategy**: Application fails gracefully when network unavailable
- **User Feedback**: Clear messaging when network requests fail
- **No Offline Support**: Application is online-only per PRD requirements

## Image Handling

### Image Upload
- **Method**: Copy/paste images into note content
- **Limitation**: One image per note
- **Upload Timing**: Images uploaded and saved only when note is saved
- **Progress**: Simple spinner during note save operation
- **Display**: Images displayed as content with optional text
- **Optimization**: Next.js Image component for optimization and lazy loading

## AI Analysis Status Management

### Status Indicators
- **Display**: Badge indicators on note cards and detail view
- **States**: Pending, completed, failed
- **Updates**: Real-time polling for status updates
- **Retry**: Visible retry button on notes with failed analysis
- **Notifications**: Subtle notifications when analysis completes (via React Query polling)

## Search Functionality

### Unified Search Interface
- **Single Search Bar**: One interface for all search types
- **Search Types**: Date, category, keyword, semantic
- **Type Selection**: Tabs or dropdown to switch search types
- **Results Display**: Same format for all search types, sorted by date
- **Semantic Search**:
  - Spinner with info text during search
  - Automatic fallback to keyword search on timeout
  - No relevance score display (sorted by date like other results)

## Form Validation and User Input

### Note Creation/Editing
- **Word Limit**: 2000 words maximum
- **Word Counter**: Display current word count and remaining words
- **Visual Warnings**: Warnings as limit approaches
- **Tag Creation**: `#[tag name]` syntax in note content
- **Image Support**: Copy/paste for image insertion

### Form Validation
- **Library**: React Hook Form
- **Schema**: Zod schemas matching API validation rules
- **Feedback**: Real-time validation feedback
- **Prevention**: Invalid submissions prevented before API calls

## Error Handling and User Feedback

### Error Display
- **Method**: Toast notifications for all errors and success messages
- **Types**: 
  - API errors
  - Validation errors
  - Network errors
  - Version conflicts (simple error messaging)
- **User Experience**: Non-intrusive feedback via Shadcn/ui Toast component

### Loading Feedback
- **Initial Loads**: Skeleton loaders for notes list, categories
- **Actions**: Spinners for saving, searching
- **Long Operations**: Progress indicators with info text (semantic search)

## Data Synchronization

### Strategy
- **Method**: Background refetching using React Query
- **Triggers**: 
  - Window focus
  - Polling for pending AI analysis
  - Manual refetch on user actions
- **No Optimistic Updates**: Background refetching only for MVP

## Unresolved Issues and Areas Requiring Clarification

1. **Category Dropdown on Main Page**: Marked as "nice to have" - needs decision on priority for MVP
2. **Tag Management Page**: Decision needed on whether to include dedicated tag management page or only inline tag creation
3. **Note Editing Interface**: Need to clarify if editing is inline on detail page or separate edit mode
4. **Search History**: Recommendation mentions search history feature - needs decision on MVP inclusion
5. **Settings Page**: Recommendation mentions settings page - needs decision on MVP scope
6. **Error Boundaries**: Recommendation mentions global error boundaries - needs implementation details
7. **Image Format Support**: Clarify if all image formats (JPG, PNG, GIF) are supported via copy/paste
8. **Link Handling**: Need to clarify how links are added to notes (separate input field or inline in text)
9. **Note Preview Generation**: Need to clarify how note title and preview are generated from content
10. **Category Creation Flow**: Need to clarify if users can create categories during note creation or only from categories page
</unresolved_issues>
</conversation_summary>

