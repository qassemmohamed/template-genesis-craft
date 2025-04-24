const fs = require("fs");
const path = require("path");
const Language = require("../models/language.model.js");
const { createError } = require("../utils/error.util.js");
const {
  validateLanguage,
  validateLanguageUpdate,
} = require("../validators/language.validator.js");
const { fileURLToPath } = require("url");

// Get all languages
const getAllLanguages = async (req, res, next) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (error) {
    next(error);
  }
};

// Get language by code
const getLanguageByCode = async (req, res, next) => {
  try {
    const language = await Language.findOne({ code: req.params.code });
    if (!language) {
      return next(createError(404, "Language not found"));
    }
    res.status(200).json(language);
  } catch (error) {
    next(error);
  }
};

// Create new language
const createLanguage = async (req, res, next) => {
  try {
    const { error } = validateLanguage(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { code, name, content, isDefault, active } = req.body;

    const existingLanguage = await Language.findOne({ code });
    if (existingLanguage) {
      return next(createError(400, "Language with this code already exists"));
    }

    if (isDefault) {
      await Language.updateMany({}, { isDefault: false });
    }

    const newLanguage = new Language({
      code,
      name,
      content,
      isDefault: isDefault || false,
      active: active !== undefined ? active : true,
    });

    await newLanguage.save();
    await saveLanguageToFile(code, content);

    res.status(201).json(newLanguage);
  } catch (error) {
    next(error);
  }
};

// Update language
const updateLanguage = async (req, res, next) => {
  try {
    const { error } = validateLanguageUpdate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { name, content, isDefault, active } = req.body;
    const { code } = req.params;

    const language = await Language.findOne({ code });
    if (!language) {
      return next(createError(404, "Language not found"));
    }

    if (isDefault) {
      await Language.updateMany(
        { _id: { $ne: language._id } },
        { isDefault: false }
      );
    }

    if (name) language.name = name;
    if (content) language.content = content;
    if (isDefault !== undefined) language.isDefault = isDefault;
    if (active !== undefined) language.active = active;

    await language.save();

    if (content) {
      await saveLanguageToFile(code, content);
    }

    res.status(200).json(language);
  } catch (error) {
    next(error);
  }
};

// Delete language
const deleteLanguage = async (req, res, next) => {
  try {
    const language = await Language.findOne({ code: req.params.code });
    if (!language) {
      return next(createError(404, "Language not found"));
    }

    if (language.isDefault) {
      return next(createError(400, "Cannot delete the default language"));
    }

    await language.deleteOne();
    res.status(200).json({ message: "Language deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Helper function to save language content to file
const saveLanguageToFile = async (code, content) => {
  try {

    const languageDir = path.join(
      "..",
      "..",
      "client",
      "src",
      "languages",
      code
    );

    if (!fs.existsSync(languageDir)) {
      fs.mkdirSync(languageDir, { recursive: true });
    }

    let filename;
    switch (code) {
      case "en":
        filename = "English.json";
        break;
      case "fr":
        filename = "Franch.json";
        break;
      case "ar":
        filename = "Arabic.json";
        break;
      default:
        filename = `${code}.json`;
    }

    const filePath = path.join(languageDir, filename);

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(content, null, 2),
      "utf8"
    );

    return true;
  } catch (error) {
    console.error("Error saving language file:", error);
    throw error;
  }
};

module.exports = {
  getAllLanguages,
  getLanguageByCode,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
