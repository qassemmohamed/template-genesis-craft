
import { useState } from "react";
import { Category, Template } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  categories: Category[];
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({ 
  categories, 
  templates, 
  onSelectTemplate 
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || "");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  
  const filteredTemplates = templates.filter(
    (template) => template.category === selectedCategory
  );
  
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTemplateId("");
  };
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };
  
  const handleContinue = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <Card className="w-full border border-cardBg-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-semibold">Select Template</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue={selectedCategory} onValueChange={handleCategoryChange}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-button data-[state=active]:text-button-text"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">
                  Select a {category.name} Template
                </h3>
                <RadioGroup
                  value={selectedTemplateId}
                  onValueChange={handleTemplateSelect}
                >
                  <div className="space-y-2">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`flex items-center p-3 rounded-md border ${
                          selectedTemplateId === template.id
                            ? "border-selectBox-border bg-accent"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="mr-2"
                        />
                        <Label
                          htmlFor={template.id}
                          className="flex-1 cursor-pointer"
                        >
                          {template.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedTemplateId}
            className="bg-button text-button-text hover:bg-button-hover"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
