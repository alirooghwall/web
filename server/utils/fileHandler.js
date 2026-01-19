const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const config = require('../config');

// Ensure directory exists
async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Load JSON data
async function loadData(filename) {
    try {
        const filePath = path.join(config.paths.dataDir, `${filename}.json`);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null; // File doesn't exist
        }
        throw error;
    }
}

// Save JSON data with backup
async function saveData(filename, data) {
    try {
        await ensureDir(config.paths.dataDir);
        
        const filePath = path.join(config.paths.dataDir, `${filename}.json`);
        
        // Create backup if file exists
        if (fsSync.existsSync(filePath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `${filePath}.backup.${timestamp}`;
            await fs.copyFile(filePath, backupPath);
            
            // Keep only last 5 backups
            const backupPattern = path.join(config.paths.dataDir, `${filename}.json.backup.*`);
            const backups = await getFiles(config.paths.dataDir, `${filename}.json.backup.`);
            
            if (backups.length > 5) {
                // Sort by modification time
                const backupStats = await Promise.all(
                    backups.map(async (file) => ({
                        file,
                        mtime: (await fs.stat(file)).mtime
                    }))
                );
                backupStats.sort((a, b) => a.mtime - b.mtime);
                
                // Delete oldest backups
                for (let i = 0; i < backupStats.length - 5; i++) {
                    await fs.unlink(backupStats[i].file);
                }
            }
        }
        
        // Save data
        const json = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, json, 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Get files matching pattern
async function getFiles(dirPath, prefix = '') {
    try {
        const files = await fs.readdir(dirPath);
        return files
            .filter(file => file.startsWith(prefix))
            .map(file => path.join(dirPath, file));
    } catch (error) {
        return [];
    }
}

// Sanitize input
function sanitize(input) {
    if (Array.isArray(input)) {
        return input.map(sanitize);
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = sanitize(value);
        }
        return sanitized;
    }
    if (typeof input === 'string') {
        return input
            .trim()
            .replace(/[<>]/g, ''); // Basic XSS prevention
    }
    return input;
}

module.exports = {
    ensureDir,
    loadData,
    saveData,
    sanitize
};
