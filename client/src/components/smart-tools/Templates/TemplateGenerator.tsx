import { useState } from "react";

import { categories, templates } from "@/data/mockData";
import { ClientInfo, Template } from "@/types";
import { useToast } from "@/hooks/use-toast";
import TemplateSelector from "./TemplateSelector";
import ClientInfoForm from "./ClientInfoForm";
import DocumentPreview from "./DocumentPreview";

const TemplateGenerator = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "form" | "preview">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep("form");
    toast({
      title: "Template selected",
      description: `${template.name} template has been selected.`,
    });
  };

  const handleClientInfoSubmit = (info: ClientInfo) => {
    setClientInfo(info);
    setStep("preview");
    toast({
      title: "Document generated",
      description: "Your document has been generated successfully.",
    });
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("select");
    } else if (step === "preview") {
      setStep("form");
    }
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setClientInfo(null);
    setStep("select");
    toast({
      title: "Process reset",
      description: "Start a new document with a fresh template.",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
         Create templates for your work
        </p>
      </div>
      <div className="">
        <main className="w-full">
          {step === "select" && (
            <TemplateSelector
              categories={categories}
              templates={templates}
              onSelectTemplate={handleTemplateSelect}
            />
          )}

          {step === "form" && selectedTemplate && (
            <ClientInfoForm
              template={selectedTemplate}
              onSubmit={handleClientInfoSubmit}
              onBack={handleBack}
            />
          )}

          {step === "preview" && selectedTemplate && clientInfo && (
            <DocumentPreview
              template={selectedTemplate}
              clientInfo={clientInfo}
              onBack={handleBack}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TemplateGenerator;
