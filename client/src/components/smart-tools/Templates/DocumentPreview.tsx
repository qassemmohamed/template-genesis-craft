import { useState } from "react";
import { ClientInfo, Template } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateDocument,
  copyToClipboard,
  downloadDocument,
} from "@/utils/templateUtils";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewProps {
  template: Template;
  clientInfo: ClientInfo;
  onBack: () => void;
  onReset: () => void;
}

export default function DocumentPreview({
  template,
  clientInfo,
  onBack,
  onReset,
}: DocumentPreviewProps) {
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string>(
    generateDocument(template, clientInfo),
  );
  const [fileName, setFileName] = useState<string>(
    `${template.name.replace(/\s+/g, "_")}_${clientInfo.lastName}.txt`,
  );

  const handleEdit = (content: string) => {
    setDocumentContent(content);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(documentContent);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Document content has been copied to clipboard",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    downloadDocument(documentContent, fileName);
    toast({
      title: "Document downloaded",
      description: `File "${fileName}" has been downloaded`,
    });
  };

  return (
    <Card className="border-cardBg-border w-full border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <span>Document Preview</span>
          <div className="text-sm font-normal">Template: {template.name}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="fileName">File Name</Label>
          <Input
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentContent">Document Content</Label>
          <Textarea
            id="documentContent"
            value={documentContent}
            onChange={(e) => handleEdit(e.target.value)}
            className="min-h-[400px]"
          />
        </div>

        <div className="flex flex-wrap justify-between gap-2 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-outline-button text-outline-button-text hover:bg-accent"
          >
            Back to Form
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="border-outline-button text-outline-button-text hover:bg-accent"
            >
              Copy to Clipboard
            </Button>
            <Button type="button" onClick={handleDownload}>
              Download Document
            </Button>
            <Button
              type="button"
              onClick={onReset}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Start Over
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
