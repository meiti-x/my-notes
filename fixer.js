const fs = require('fs').promises;
const path = require('path');

// Change the docsPath to point to the docs folder inside your project
const docsPath = path.join(__dirname, 'docs');

async function renameSpaces(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (let entry of entries) {
      const oldPath = path.join(dir, entry.name);
      // Replace spaces with underscores in filename/directory name
      const newName = entry.name.replace(/\s+/g, '_');
      const newPath = path.join(dir, newName);
      
      if (newName !== entry.name) {
        console.log(`Renaming "${oldPath}" to "${newPath}"`);
        await fs.rename(oldPath, newPath);
      }
      
      if (entry.isDirectory()) {
        // Recursively rename files within subdirectories.
        await renameSpaces(path.join(dir, newName));
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}:`, err);
  }
}

renameSpaces(docsPath)
  .then(() => console.log('Renaming completed.'))
  .catch(err => console.error('Error during renaming:', err));