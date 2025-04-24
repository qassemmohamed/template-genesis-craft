const fs = require("fs");
const path = require("path");

// Get directory path
const uploadsDir = path.join(__dirname, "..", "public", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Save file locally
const saveFile = async (file, folder = "") => {
  try {
    // Check if file is valid
    if (!file || !file.path || !file.originalname) {
      throw new Error("Invalid file");
    }

    const folderPath = folder ? path.join(uploadsDir, folder) : uploadsDir;

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(folderPath, filename);

    // Check if source file exists
    if (!fs.existsSync(file.path)) {
      throw new Error(`Source file not found: ${file.path}`);
    }

    // Move file from temp location to uploads directory
    fs.copyFileSync(file.path, filepath);

    // Only delete the temp file if it exists and the copy was successful
    if (fs.existsSync(file.path) && fs.existsSync(filepath)) {
      fs.unlinkSync(file.path);
    }

    // Return relative path for storage in database
    const relativePath = path
      .join("/uploads", folder, filename)
      .replace(/\\/g, "/");
    return {
      filename,
      path: filepath,
      url: relativePath,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};

// Delete file
const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) return true;

    // Convert URL to local path
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      fileUrl.replace(/^\//, "")
    );

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

module.exports = { saveFile, deleteFile };
