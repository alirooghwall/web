# DERMASAN Website Management Guide

## 📋 Who Can Update This Website?

**Anyone who can edit HTML files!** No programming knowledge required for most updates.

You can update:
- ✅ Text content (prices, descriptions, etc.)
- ✅ Contact information
- ✅ Product photos
- ✅ Translations
- ✅ Google Maps location

---

## 🔧 How to Update the Website

### 1️⃣ **Changing Text Content**

#### Edit in Dari:
1. Open `index.html` in a text editor (Notepad, VS Code, etc.)
2. Find the text you want to change (use Ctrl+F to search)
3. Change the Dari text between the HTML tags
4. Save the file

#### Example - Changing Phone Number:
```html
<!-- Find this line: -->
<p dir="ltr"><a href="tel:+93796582690">+93 79 658 2690</a></p>

<!-- Change to your new number: -->
<p dir="ltr"><a href="tel:+93701234567">+93 70 123 4567</a></p>
```

---

### 2️⃣ **Updating Translations (Dari/Pashto/English)**

1. Open `translations.js` in text editor
2. Find the language section (dari, pashto, or english)
3. Update the text inside quotes
4. Save the file

#### Example - Changing Product Description:
```javascript
dari: {
    product_health_desc: "YOUR NEW DESCRIPTION IN DARI HERE",
},
pashto: {
    product_health_desc: "YOUR NEW DESCRIPTION IN PASHTO HERE",
},
english: {
    product_health_desc: "YOUR NEW DESCRIPTION IN ENGLISH HERE",
}
```

**⚠️ Important:** Keep the key names (like `product_health_desc`) the same! Only change the text in quotes.

---

### 3️⃣ **Adding/Changing Product Photos**

1. Prepare your images:
   - Format: JPG or PNG
   - Size: 800x600 pixels recommended
   - File size: Under 500KB

2. Name your images:
   - `health-product.jpg` (for health products)
   - `beauty-product.jpg` (for beauty products)
   - `organic-product.jpg` (for organic products)

3. Put them in the `products/` folder

4. Refresh the website - images will update automatically!

---

### 4️⃣ **Updating Google Maps Location**

1. Go to https://www.google.com/maps
2. Search for your office location
3. Click "Share" button
4. Click "Embed a map" tab
5. Copy the `<iframe>` code
6. Open `index.html`
7. Find line ~368 (search for "iframe")
8. Replace the entire `<iframe>` tag with your new one
9. Save the file

---

### 5️⃣ **Changing Contact Information**

#### In index.html:
Search for these and update:
- Phone: `+93 79 658 2690`
- Address: `حصه اول، شفاخانه فیضی. عقب پوهنتون کابورا`
- WhatsApp: `93796582690`

#### In translations.js:
Update in all 3 language sections:
```javascript
phone_label: "تلفن - دفتر مرکزی",
address_text: "YOUR NEW ADDRESS",
hours_text: "YOUR NEW HOURS",
```

---

### 6️⃣ **Adding a New Product**

This requires copying HTML code:

1. Open `index.html`
2. Find the products section (line ~150)
3. Copy one complete `<div class="product-card">...</div>` block
4. Paste it after the last product
5. Update:
   - Image name: `src="products/YOUR-IMAGE.jpg"`
   - Title: `<h4 data-translate="YOUR_KEY">Your Title</h4>`
   - Description and features
   - WhatsApp link

6. Add translations to `translations.js` for your new product

---

## 👥 Who Should Update What?

### **Marketing Team / Content Manager:**
- Product descriptions
- Prices (if you add them)
- Promotions and offers
- Gallery images

### **Administrator:**
- Contact information
- Office location
- Working hours
- Product photos

### **Technical Person (minimal HTML knowledge):**
- Adding new products
- Changing website structure
- Updating Google Maps
- Major design changes

---

## 🚀 Publishing Updates

### **After Making Changes:**

1. **Test Locally First:**
   - Open `index.html` in your browser
   - Click all links
   - Test language switcher
   - Check on mobile (phone browser)

2. **Upload to Server:**
   - Use FTP client (FileZilla, etc.)
   - Upload ALL changed files:
     - `index.html`
     - `translations.js`
     - Any new images
   - **DO NOT** delete old files unless you're sure

3. **Clear Cache:**
   - After uploading, press Ctrl+F5 in browser to see changes
   - Tell users to refresh if they don't see updates

---

## ⚠️ IMPORTANT - Do Not Edit:

### Files to NEVER touch (unless you know what you're doing):
- `script.js` - Main JavaScript functionality
- `styles.css` - Website design and layout
- Logo file: `Adobe ds- file۱.png`

### Lines to be CAREFUL with:
- Anything with `<script>`
- Anything with `data-translate="`
- CSS class names like `class="product-card"`

---

## 🆘 Common Issues & Solutions

### **Problem: Translations not working**
**Solution:** 
- Check `translations.js` for syntax errors (missing quotes, commas)
- Make sure key names match in HTML and translations.js
- Clear browser cache (Ctrl+F5)

### **Problem: Images not showing**
**Solution:**
- Check image file names match exactly (case-sensitive!)
- Make sure images are in `products/` folder
- Check image file size (must be under 500KB)

### **Problem: Layout broken after editing**
**Solution:**
- You probably deleted a closing tag (`</div>`, `</p>`, etc.)
- Use "Undo" (Ctrl+Z) and try again carefully
- Or restore from backup

### **Problem: WhatsApp link not working**
**Solution:**
- Check phone number format: `93796582690` (no + or spaces)
- Make sure URL starts with: `https://wa.me/`

---

## 💾 Backup Strategy

### **BEFORE making any changes:**

1. **Make a copy of the entire website folder**
2. Name it with date: `dermasan-backup-2026-01-16`
3. Keep at least 3 most recent backups

### **Version Control (Advanced):**
- Use Git/GitHub to track all changes
- Each update = one commit with description
- Easy to undo mistakes

---

## 📞 Need Help?

### **For Content Updates:**
- Marketing team can handle text changes
- Use this guide for reference

### **For Technical Issues:**
- Find a web developer
- Show them this guide
- They'll understand the structure

### **Quick Reference:**
- Text content: `index.html`
- Translations: `translations.js`  
- Photos: `products/` folder
- Styling: `styles.css` (advanced)
- Functionality: `script.js` (advanced)

---

## ✅ Update Checklist

Before publishing any changes:

- [ ] Backup created
- [ ] Changes tested locally
- [ ] Checked in all 3 languages (Dari/Pashto/English)
- [ ] Links tested (especially WhatsApp)
- [ ] Images loading correctly
- [ ] Mobile view checked
- [ ] No console errors (F12 in browser)
- [ ] FTP uploaded all changed files
- [ ] Cache cleared and verified live

---

## 🎯 Summary

**Simple Updates (Anyone):**
- Changing text in Dari
- Updating phone numbers
- Adding new images

**Medium Updates (Basic HTML):**
- Updating translations
- Changing contact info everywhere
- Updating Google Maps

**Advanced Updates (Need Developer):**
- Adding new sections
- Changing design/layout
- Modifying animations
- Adding new features

---

**Last Updated:** January 16, 2026  
**Website Version:** 2.0  
**Maintained By:** DERMASAN Team
