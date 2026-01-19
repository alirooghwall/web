# DERMASAN - Quick Setup Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
╔══════════════════════════════════════════╗
║     DERMASAN Admin Server Running        ║
╠══════════════════════════════════════════╣
║  Port: 3000                              ║
║  Environment: development                ║
║  Admin Panel: http://localhost:3000/admin║
╚══════════════════════════════════════════╝
```

### Step 3: Access Your Website
- **Public Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

### Step 4: Login to Admin Panel
Credentials are defined in your .env file:
- ADMIN_USERNAME
- ADMIN_PASSWORD_HASH

Generate a bcrypt hash for your password:
- Run: npm run hash:password -- "YourStrongPassword"
- Paste the output into ADMIN_PASSWORD_HASH

---

## ✅ What's Been Completed

### ✨ New Admin Panel (JavaScript-based)
- ✅ Modern, responsive admin login page
- ✅ Full-featured admin dashboard
- ✅ Product management (add, view, delete)
- ✅ Gallery management (upload, view, delete images)
- ✅ Testimonials management (add, view, delete)
- ✅ Site settings configuration
- ✅ Password change functionality
- ✅ Session-based authentication

### 🗂️ Project Structure
- ✅ All PHP files removed (admin/*.php, cms/*.php)
- ✅ Created required directories (cms/data, uploads)
- ✅ Added .gitignore file
- ✅ Complete README.md with documentation
- ✅ Updated AGENTS.md with project context

### 🔌 API Endpoints Ready
- ✅ `/api/auth/*` - Authentication (login, logout, status)
- ✅ `/api/products` - Product CRUD operations
- ✅ `/api/gallery` - Gallery image management
- ✅ `/api/testimonials` - Testimonial management
- ✅ `/api/settings` - Site settings
- ✅ `/api/change-password` - Password management

---

## 🎯 First Steps After Setup

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use credentials: Ali / Login@123

2. **Change Your Password**
   - Navigate to Settings tab
   - Use the "Change Password" form
   - Follow instructions to update .env file with new hash

3. **Add Your First Product**
   - Go to Products tab
   - Fill in the form
   - Upload an image (optional)
   - Click "Add Product"

4. **Upload Gallery Images**
   - Go to Gallery tab
   - Add title and category
   - Select an image file
   - Click "Upload Image"

5. **Add Customer Testimonials**
   - Go to Testimonials tab
   - Enter customer details
   - Add their review and rating
   - Click "Add Testimonial"

---

## 🛡️ Security Checklist

- [ ] Change default admin username in `.env`
- [ ] Change default admin password
- [ ] Update `SESSION_SECRET` in `.env` to a random string
- [ ] Set `NODE_ENV=production` for production deployment
- [ ] Enable HTTPS in production
- [ ] Regular backups of `cms/data/` directory
- [ ] Regular backups of `uploads/` directory

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Configuration & credentials |
| `server.js` | Main server entry point |
| `admin/login.html` | Admin login page |
| `admin/index.html` | Admin dashboard |
| `admin/admin.js` | Admin functionality |
| `cms/data/*.json` | All CMS data stored here |
| `uploads/` | Uploaded images |

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill the process or change PORT in .env
```

### Can't login
- Verify credentials in `.env` file
- Clear browser cookies
- Check server console for errors

### Images not uploading
- Verify `uploads/` directory exists
- Check directory write permissions
- Ensure file size < 5MB

### Data not saving
- Check `cms/data/` directory exists
- Verify write permissions
- Look for errors in server console

---

## 📊 Feature Overview

### Dashboard
- View total counts of products, gallery items, and testimonials
- Quick overview of your content

### Products Management
- **Add Products**: Name, description, price, image, category
- **Categories**: Supplements, Cosmetics, Healthcare
- **View All**: Table view with edit/delete options
- **Delete**: Remove products with confirmation

### Gallery Management
- **Upload Images**: With title and category
- **Grid View**: Visual display of all gallery images
- **Delete**: Remove images with confirmation

### Testimonials
- **Add Reviews**: Customer name, role, review text, rating (1-5 stars)
- **View All**: Table view of all testimonials
- **Delete**: Remove testimonials with confirmation

### Settings
- **Site Configuration**: Name, description, contact info
- **Password Change**: Secure password update

---

## 🚢 Production Deployment

1. **Update Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=<very-long-random-string>
   SESSION_STORE=file
   CORS_ORIGIN=https://yourdomain.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=<bcrypt-hash>
   ```

2. **Use Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name dermasan
   pm2 startup
   pm2 save
   ```

3. **Set Up Reverse Proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL/HTTPS**
   ```bash
   # Use Let's Encrypt
   certbot --nginx -d yourdomain.com
   ```

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `AGENTS.md` for technical architecture
- Check server logs for error messages

---

**🎉 You're all set! Enjoy managing your DERMASAN website!**
