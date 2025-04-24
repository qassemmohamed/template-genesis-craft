
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { uploadMemoryFile } from "../helpers/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languageOptions } from "../helpers/languageOptions";

const UploadTab: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [fileFormat, setFileFormat] = useState("tmx");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!sourceLang || !targetLang) {
      toast({
        title: "Error",
        description: "Please select source and target languages",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadMemoryFile(file);
      
      toast({
        title: "Upload successful",
        description: `${result.count} entries imported to translation memory`,
      });
      
      setFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Translation Memory</CardTitle>
        <CardDescription>
          Import your translation memory from TMX, XLIFF, or CSV files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger>
                <SelectValue placeholder="Source Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger>
                <SelectValue placeholder="Target Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select value={fileFormat} onValueChange={setFileFormat}>
            <SelectTrigger>
              <SelectValue placeholder="File Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tmx">TMX (Translation Memory Exchange)</SelectItem>
              <SelectItem value="xliff">XLIFF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="txt">TXT (Tab-delimited)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="border-2 border-dashed border-[var(--input)] rounded-md p-6 text-center">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".tmx,.xliff,.xml,.csv,.txt"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-10 w-10 text-[var(--muted-foreground)] mb-2" />
              <span className="text-sm font-medium">
                {file ? file.name : "Click to select file"}
              </span>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Supported formats: TMX, XLIFF, CSV, TXT
              </p>
            </label>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading || !sourceLang || !targetLang}
            >
              {isUploading ? "Uploading..." : "Upload Memory File"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadTab;
