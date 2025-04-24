const Service = require("../models/service.model.js");
const { createError } = require("../utils/error.util.js");
const { saveFile, deleteFile } = require("../utils/file.util.js");
const { validateService } = require("../validators/service.validator.js");
const fs = require("fs");

// Generate a unique key for service
const generateKeyForService = (title) => {
  // Generate a simple key based on title with timestamp to ensure uniqueness
  const timestamp = Date.now();
  return `${title.toLowerCase().replace(/\s+/g, "-")}-${timestamp}`;
};

// Get all services
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// Get service by ID
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Validate the input data (title and description are required)
    const { error } = validateService(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    // Generate a unique key for the service
    const key = generateKeyForService(title);

    // Create new service
    const newService = new Service({
      title,
      description,
      key,
      active: true,
    });

    // Handle image upload if present
    if (req.file) {
      try {
        // Log file information for debugging
        console.log("File information:", {
          path: req.file.path,
          exists: fs.existsSync(req.file.path),
          size: req.file.size,
          mimetype: req.file.mimetype,
        });

        const fileResult = await saveFile(req.file, "services");
        newService.imageUrl = fileResult.url;
      } catch (fileError) {
        console.error("File upload error:", fileError);
        return next(
          createError(400, `File upload error: ${fileError.message}`)
        );
      }
    }

    // Save the new service
    await newService.save();

    // Respond with the newly created service
    res.status(201).json(newService);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { title, description, active } = req.body;

    // Validate the input data
    const { error } = validateService(req.body, true);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }

    // Update fields
    if (title) {
      service.title = title;
      // If title changes, update the key as well to maintain consistency
      if (title !== service.title) {
        service.key = generateKeyForService(title);
      }
    }

    if (description) service.description = description;

    // Handle active status if provided
    if (active !== undefined) {
      service.active = active === "true" || active === true;
    }

    // Handle image upload if present
    if (req.file) {
      try {
        // Delete old image if exists
        if (service.imageUrl) {
          await deleteFile(service.imageUrl);
        }

        // Log file information for debugging
        console.log("File information:", {
          path: req.file.path,
          exists: fs.existsSync(req.file.path),
          size: req.file.size,
          mimetype: req.file.mimetype,
        });

        // Save new image
        const fileResult = await saveFile(req.file, "services");
        service.imageUrl = fileResult.url;
      } catch (fileError) {
        console.error("File upload error:", fileError);
        return next(
          createError(400, `File upload error: ${fileError.message}`)
        );
      }
    }

    // Save the updated service
    await service.save();

    // Respond with the updated service
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

// Delete service
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }

    // Delete associated image if exists
    if (service.imageUrl) {
      await deleteFile(service.imageUrl);
    }

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
