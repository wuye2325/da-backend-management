# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a community management application for "阳光花园" (Sunshine Garden) residential community. The application provides a complete community information management solution that supports collaboration between residents, the homeowners' committee, and property management.

### Core Features
- Event management (publishing, details, timeline, AI summarization)
- User roles and permissions (residents, committee members, property management)
- Interactive features (likes, comments, notifications)
- Data visualization (financial transparency, statistics)

### Technology Stack
- **Frontend**: HTML, CSS, JavaScript with component-based architecture
- **Backend**: Node.js HTTP server for static file serving
- **UI Framework**: Custom component library with Tailwind CSS classes
- **Database**: Not directly visible in this codebase, likely using external services

## Code Architecture and Structure

### Components System
The project uses a component-based architecture with reusable UI components:

1. **Layout Components**:
   - Sidebar navigation (`js/layout.js`)
   - Top navigation bar (`js/layout.js`)
   - Page layout system with breadcrumb navigation

2. **UI Components**:
   - DataTable (`components/DataTable.js`)
   - Modal (`components/Modal.js`)
   - Form (`components/Form.js`)
   - Rich Text Editor (`components/RichTextEditor.js`)
   - Toggle Switch (`components/toggle-switch.js`)

3. **Component Usage**:
   - Pages include component scripts via `<script src="components/[component].js"></script>`
   - Layout is initialized with `initPage('Page Title')` function
   - Components are rendered into designated containers (`#sidebar-container`, `#top-navigation-container`)

### Directory Structure
- `components/` - Reusable UI components
- `js/` - Main JavaScript files including layout system
- `css/` - Stylesheets
- `doc/docs/` - Project documentation
- Root directory contains HTML pages for different features

## Development Commands

### Running the Application
```bash
node server.js
# Server will start at http://localhost:8080/
```

### Development Workflow
1. All pages should use the component system by including:
   ```html
   <script src="js/layout.js"></script>
   ```
2. Initialize pages with:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       initPage('Page Title');
   });
   ```
3. Structure HTML with designated containers:
   ```html
   <div id="sidebar-container"></div>
   <div id="top-navigation-container"></div>
   <div id="main-content">
       <!-- Page content -->
   </div>
   ```

### Component Development
1. Create new components in the `components/` directory
2. Export functionality using module pattern or global functions
3. Ensure components are compatible with the existing layout system

## Testing
No specific testing framework configuration found in the codebase. Tests would need to be set up according to the project's documentation in `doc/docs/testing.md`.

## Deployment
The application uses a simple Node.js HTTP server for serving static files. For production deployment:
1. Ensure all dependencies are properly linked
2. Start the server with `node server.js`
3. The application will be available on port 8080 by default

## Important Notes
- The project uses a custom component system rather than a modern framework
- All pages should integrate with the existing layout system for consistency
- The backend appears to be handled by external services (likely Supabase based on documentation)
- State management is handled through global JavaScript functions and DOM manipulation