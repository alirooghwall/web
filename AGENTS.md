# DERMASAN Project Context

## Project Overview
DERMASAN is an International Health & Beauty Organization website with a comprehensive Content Management System (CMS). The project uses Node.js/Express backend with vanilla JavaScript frontend.

## Architecture

### Backend (Node.js + Express)
- **Server**: `server.js` - Main Express application entry point
- **Config**: `server/config.js` - Server configuration and paths
- **Routes**: 
  - `server/routes/auth.js` - Authentication endpoints
  - `server/routes/api.js` - CMS API endpoints (products, gallery, testimonials, settings)
- **Middleware**: `server/middleware/auth.js` - Session-based authentication
- **Utils**: File handling and upload management

### Frontend
- **Public Site**: `index.html`, `script.js`, `styles.css`
- **Admin Panel**: `admin/login.html`, `admin/index.html`, `admin/admin.js`, `admin/admin.css`
- **Translations**: `translations.js` - Multi-language support (EN, FA, AR)
- **Product Pages**: `products/` directory with category-specific HTML

### Data Storage
- **JSON Files**: All data stored in `cms/data/` as JSON files
  - `products.json` - Product catalog
  - `gallery.json` - Gallery metadata
  - `testimonials.json` - Customer reviews
  - `settings.json` - Site configuration
- **File Uploads**: `uploads/` directory for images (products, gallery)

## Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript (no framework)
- **Authentication**: express-session with in-memory store
- **File Upload**: multer
- **Data Storage**: JSON files (no database)
- **Styling**: Pure CSS with gradients and animations

## Key Features
1. **Admin Panel**: Full CMS with dashboard, product management, gallery, testimonials
2. **Multi-language**: English, Persian (Farsi), Arabic support
3. **Product Categories**: Supplements, Cosmetics, Healthcare
4. **Session-based Auth**: Secure admin authentication
5. **File Uploads**: Image handling with preview
6. **Responsive Design**: Mobile-friendly interface

## Security Notes
- Session-based authentication (not JWT)
- Default credentials should be changed immediately
- File upload validation in place
- Environment variables for sensitive data (`.env`)
- No PHP components (removed legacy PHP files)

## Development Workflow
1. All CMS operations go through REST API
2. Admin UI is pure JavaScript (no build step required)
3. Data persists in JSON files
4. File uploads handled by multer middleware
5. Authentication checked on protected routes

## Important Paths
- Public site: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- API endpoints: `/api/*`
- Uploads: `/uploads/*`

## Environment Setup
Required environment variables in `.env`:
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Admin password

## Code Conventions
- ES6+ JavaScript throughout
- Async/await for asynchronous operations
- RESTful API design
- Inline styles in HTML for admin pages
- Modular route handlers
- Error handling with try-catch blocks

## Future Considerations
- Consider migrating to database (MongoDB/PostgreSQL) for better scalability
- Add user roles and permissions
- Implement CSRF protection
- Add API rate limiting
- Consider adding TypeScript for type safety
- Add automated testing
- Implement proper logging system

## Common Tasks

### Adding New API Endpoint
1. Add route in `server/routes/api.js`
2. Add authentication middleware if needed
3. Implement data handling logic
4. Update frontend in `admin/admin.js`

### Adding New Admin Section
1. Add sidebar menu item in `admin/index.html`
2. Create content section HTML
3. Add JavaScript handlers in `admin/admin.js`
4. Create corresponding API endpoints

### Modifying Authentication
- Edit `server/middleware/auth.js` for middleware changes
- Edit `server/routes/auth.js` for auth endpoints
- Update login UI in `admin/login.html`

## Troubleshooting
- **Data not persisting**: Check `cms/data/` directory permissions
- **Uploads failing**: Verify `uploads/` directory exists
- **Session issues**: Check SESSION_SECRET in `.env`
- **Port conflicts**: Change PORT in `.env`

## Testing
- Manual testing through admin panel
- Test all CRUD operations for each content type
- Verify authentication flows
- Check file upload limits and validation
- Test multi-language switching on public site
