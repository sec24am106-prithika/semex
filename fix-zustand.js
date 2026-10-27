const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'node_modules', 'zustand');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('import.meta.env')) {
                console.log(`Fixing: ${fullPath}`);
                const newContent = content.replace(/import\.meta\.env\s*\?\s*import\.meta\.env\.MODE\s*:\s*void 0/g, '(typeof process !== "undefined" && process.env ? process.env.NODE_ENV : undefined)');
                fs.writeFileSync(fullPath, newContent);
            }
        }
    }
}

console.log('Starting Zustand patch...');
walk(targetDir);
console.log('Zustand patch complete!');
