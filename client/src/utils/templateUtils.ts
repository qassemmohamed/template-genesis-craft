import { ClientInfo, Template } from "@/types/index";

export const generateDocument = (
  template: Template,
  clientInfo: ClientInfo,
): string => {
  let content = template.content;

  // Replace all placeholders with client information
  Object.keys(clientInfo).forEach((key) => {
    const placeholder = `{{${key}}}`;
    content = content.replace(
      new RegExp(placeholder, "g"),
      clientInfo[key] || "",
    );
  });

  return content;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy: ", error);
    return false;
  }
};

export const downloadDocument = (content: string, fileName: string): void => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
