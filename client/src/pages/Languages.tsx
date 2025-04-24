"use client";

import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { PencilIcon } from "@heroicons/react/24/outline";
import { CodeBracketIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [path, setPath] = useState("");

  // Fetch languages
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/languages");
      setLanguages(response.data);
    } catch (err) {
      console.error("Error fetching languages:", err);
      setError("Failed to load languages");
      toast.error("Failed to load languages");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing a language
  const handleEditLanguage = (language) => {
    setCurrentLanguage(language);
    setFormData({
      content: JSON.stringify(language.content, null, 2),
    });
    setPath("");
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      content: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Parse JSON content
      let parsedContent;
      try {
        parsedContent = JSON.parse(formData.content);
      } catch (err) {
        toast.error("Invalid JSON format");
        return;
      }

      // Update language
      await api.put(`/languages/${currentLanguage.code}`, {
        content: parsedContent,
      });

      toast.success("Language updated successfully");

      // Refresh languages list
      fetchLanguages();

      // Close modal
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving language:", err);
      toast.error(err.response?.data?.message || "Failed to save language");
    } finally {
      setLoading(false);
    }
  };

  // Handle path-based editing
  const handlePathEdit = () => {
    if (!path) {
      toast.error("Please enter a path");
      return;
    }

    try {
      // Parse current content
      const content = JSON.parse(formData.content);

      // Get nested value using path
      const pathParts = path.split(".");
      const current = content;
      let value = content;

      for (const part of pathParts) {
        if (value[part] === undefined) {
          toast.error(`Path "${path}" not found in content`);
          return;
        }
        value = value[part];
      }

      // Prompt for new value
      const newValue = prompt("Enter new value:", value);

      if (newValue === null) {
        return; // User cancelled
      }

      // Update value at path
      let temp = content;
      for (let i = 0; i < pathParts.length - 1; i++) {
        temp = temp[pathParts[i]];
      }
      temp[pathParts[pathParts.length - 1]] = newValue;

      // Update form data
      setFormData({
        content: JSON.stringify(content, null, 2),
      });

      toast.success(`Updated "${path}" successfully`);
    } catch (err) {
      console.error("Error updating path:", err);
      toast.error("Failed to update path");
    }
  };

  // Filter language content based on search term
  const filterContent = (content, term) => {
    if (!term) return content;

    const result = {};

    const search = (obj, path = "") => {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
          search(obj[key], currentPath);
        } else if (
          currentPath.toLowerCase().includes(term.toLowerCase()) ||
          String(obj[key]).toLowerCase().includes(term.toLowerCase())
        ) {
          // Add the path and value
          let current = result;
          const pathParts = currentPath.split(".");

          for (let i = 0; i < pathParts.length - 1; i++) {
            if (!current[pathParts[i]]) {
              current[pathParts[i]] = {};
            }
            current = current[pathParts[i]];
          }

          current[pathParts[pathParts.length - 1]] = obj[key];
        }
      }
    };

    search(content);
    return Object.keys(result).length > 0 ? result : content;
  };

  if (loading && languages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--headline)]">
          Manage Languages
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Languages Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--paragraph)]"
                    >
                      Language
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--paragraph)]"
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--paragraph)]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--paragraph)]"
                    >
                      Default
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--paragraph)]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {languages.map((language) => (
                    <tr key={language._id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-[var(--headline)]">
                          {language.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-[var(--paragraph)]">
                          {language.code}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${language.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {language.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${language.isDefault ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-[var(--headline)]"}`}
                        >
                          {language.isDefault ? "Default" : "No"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditLanguage(language)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing languages */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-[var(--headline)]">
                        Edit {currentLanguage?.name} Language
                      </h3>

                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search in content..."
                          className="block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          value={path}
                          onChange={(e) => setPath(e.target.value)}
                          placeholder="Enter path (e.g., app.loading)"
                          className="block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handlePathEdit}
                          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-[var(--headline)] shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <CodeBracketIcon className="mr-1 h-4 w-4" />
                          Edit Path
                        </button>
                      </div>

                      <div className="mt-4">
                        <textarea
                          name="content"
                          id="content"
                          rows={20}
                          value={formData.content}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 font-mono shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-[var(--headline)] shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-[var(--paragraph)] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Languages;
