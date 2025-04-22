
import { useState } from "react";
import TemplateSelector from "@/components/TemplateSelector";
import ClientInfoForm from "@/components/ClientInfoForm";
import DocumentPreview from "@/components/DocumentPreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, templates } from "@/data/mockData";
import { ClientInfo, Template } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "form" | "preview">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Header 
          description="Create professional documents by selecting a template and filling in your information" 
        />

        <main className="max-w-4xl mx-auto">
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

        <Footer />
      </div>
    </div>
  );
};

export default Index;
