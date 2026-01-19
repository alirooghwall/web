# DERMASAN - International Health & Beauty Organization

![DERMASAN](https://img.shields.io/badge/DERMASAN-Health%20%26%20Beauty-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

A comprehensive website and content management system for DERMASAN, featuring product management, gallery, testimonials, and more.

## 🌟 Features

### Public Website
- **Multi-language Support**: English, Persian (Farsi), and Arabic translations
- **Product Categories**: Supplements, Cosmetics, and Healthcare products
- **Responsive Design**: Mobile-friendly interface
- **Interactive Gallery**: Showcase products and events
- **Testimonials**: Customer reviews and feedback
- **Video Content**: Promotional and educational videos

### Admin Panel
- **🔐 Secure Authentication**: Login system with session management
- **📦 Product Management**: Add, view, and delete products by category
- **🖼️ Gallery Management**: Upload and manage images with categories
- **💬 Testimonials Management**: Manage customer reviews and ratings
- **⚙️ Site Settings**: Configure site information and contact details
- **👤 User Management**: Change admin password
- **📊 Dashboard**: Overview of all content statistics

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dermasan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   SESSION_SECRET=your-secret-key-here-change-this-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash
   ```

   **⚠️ IMPORTANT**: Change the default credentials before deploying to production!

   Generate a bcrypt hash for your admin password:
   - Run: npm run hash:password -- "YourStrongPassword"
   - Paste the output into ADMIN_PASSWORD_HASH

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the website**
   - Public Site: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login

### Default Login Credentials
Credentials are defined by ADMIN_USERNAME and ADMIN_PASSWORD_HASH in your .env file.

## 📁 Project Structure

```
dermasan/
├── admin/                  # Admin panel files
│   ├── login.html         # Admin login page
│   ├── index.html         # Admin dashboard
│   ├── admin.js           # Admin JavaScript logic
│   └── admin.css          # Admin styles
├── cms/                   # CMS backend
│   └── data/              # JSON data storage
├── products/              # Product pages
│   ├── supplements.html
│   ├── cosmetics.html
│   └── healthcare.html
├── server/                # Node.js server
│   ├── config.js          # Server configuration
│   ├── middleware/        # Express middleware
│   │   └── auth.js        # Authentication middleware
│   ├── routes/            # API routes
│   │   ├── auth.js        # Auth endpoints
│   │   └── api.js         # CMS endpoints
│   └── utils/             # Utility functions
│       ├── fileHandler.js
│       └── uploadHandler.js
├── uploads/               # Uploaded files
│   ├── products/          # Product images
│   └── gallery/           # Gallery images
├── video/                 # Video files
├── index.html             # Homepage
├── script.js              # Main JavaScript
├── styles.css             # Main styles
├── translations.js        # Language translations
├── server.js              # Express server entry point
├── package.json           # Node.js dependencies
└── .env                   # Environment variables (create this)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `SESSION_SECRET` | Session encryption key | (required) |
| `ADMIN_USERNAME` | Admin username | admin |
| `ADMIN_PASSWORD_HASH` | Admin bcrypt password hash | (required) |
| `SESSION_STORE` | Session storage backend (memory or file) | memory |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | (all) |

### Server Configuration

Edit `server/config.js` to customize:
- Data storage paths
- Upload directories
- File size limits
- Allowed file types

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check auth status

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `DELETE /api/products/:id` - Delete product

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Upload gallery image
- `DELETE /api/gallery/:id` - Delete gallery item

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Add testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Settings
- `GET /api/settings` - Get site settings
- `POST /api/settings` - Update settings
- `POST /api/change-password` - Change admin password

## 🎨 Customization

### Styling
- Edit `styles.css` for public site styling
- Edit `admin/admin.css` for admin panel styling

### Translations
- Edit `translations.js` to add or modify translations
- Currently supports: English (en), Persian (fa), Arabic (ar)

### Adding New Languages
```javascript
// In translations.js
export const translations = {
  // ... existing translations
  es: {  // Spanish
    welcome: 'Bienvenido',
    // ... add all translations
  }
};
```

## 🔒 Security

### Best Practices
1. **Change default credentials** immediately after first login
2. **Use strong passwords** (minimum 12 characters)
3. **Keep SESSION_SECRET** random and secure
4. **Update dependencies** regularly: `npm update`
5. **Use HTTPS** in production
6. **Backup data** regularly from `cms/data/` directory

### Production Deployment
- Set `NODE_ENV=production`
- Use process manager like PM2
- Set up reverse proxy (nginx/Apache)
- Enable firewall rules
- Regular security updates
- Set `SESSION_STORE=file` for persistent sessions
- Configure `CORS_ORIGIN` to your domain(s)

## 📦 Data Storage

All CMS data is stored in JSON files in `cms/data/`:
- `products.json` - Product data
- `gallery.json` - Gallery metadata
- `testimonials.json` - Customer testimonials
- `settings.json` - Site settings

**💾 Backup Strategy**: 
- Regularly backup the `cms/data/` directory
- Backup the `uploads/` directory
- Keep backups in a secure location

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify `.env` file exists and is configured
- Run `npm install` to ensure dependencies are installed

### Can't login to admin
- Check credentials in `.env` file
- Clear browser cookies/cache
- Check server logs for errors

### Uploads not working
- Verify `uploads/` directory exists
- Check directory permissions
- Ensure file size is within limits

### Data not saving
- Verify `cms/data/` directory exists
- Check write permissions
- Look for errors in server console

## 📝 Development

### Running in Development Mode
```bash
npm run dev  # If you have nodemon installed
# or
node server.js
```

### Code Style
- Use ES6+ features where possible
- Follow consistent naming conventions
- Comment complex logic
- Keep functions small and focused

### Adding New Features
1. Update API routes in `server/routes/`
2. Add frontend logic in `admin/admin.js`
3. Update UI in `admin/index.html`
4. Test thoroughly before deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Copyright © 2024 DERMASAN. All rights reserved.

## 📞 Support

For support and inquiries:
- Email: info@dermasan.com
- Website: [dermasan.com](http://dermasan.com)

## 🎯 Roadmap

### Planned Features
- [ ] Multi-admin support
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Product inventory tracking
- [ ] Customer order management
- [ ] Newsletter system
- [ ] Advanced search functionality
- [ ] API rate limiting
- [ ] Two-factor authentication

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [Web Security Guidelines](https://owasp.org/)

---

**Built with ❤️ by the DERMASAN Team**
