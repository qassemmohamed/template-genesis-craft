
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowDown, Save } from "lucide-react";
import { translateText, saveToMemory } from "../helpers/utils";
import { languageOptions } from "../helpers/languageOptions";
import { domainOptions } from "../helpers/domainOptions";

const TranslateTab: React.FC = () => {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [domain, setDomain] = useState("");
  const [saveToTM, setSaveToTM] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang, domain || undefined);
      setTranslatedText(result.targetText);
      
      if (saveToTM) {
        await saveToMemory({
          sourceText,
          targetText: result.targetText,
          sourceLang,
          targetLang,
          domain: domain || undefined
        });
        
        toast({
          title: "Success",
          description: "Translation saved to memory",
        });
      }
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "An error occurred during translation",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveManually = async () => {
    if (!sourceText.trim() || !translatedText.trim()) {
      toast({
        title: "Error",
        description: "Both source and target texts are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveToMemory({
        sourceText,
        targetText: translatedText,
        sourceLang,
        targetLang,
        domain: domain || undefined
      });
      
      toast({
        title: "Success",
        description: "Translation saved to memory",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "An error occurred while saving",
        variant: "destructive",
      });
    }
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex space-x-2">
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
            
            <Button variant="outline" onClick={swapLanguages} className="px-2">
              <ArrowDown className="rotate-90" />
            </Button>
            
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

          <Textarea 
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select domain (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">General</SelectItem>
                {domainOptions.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="save-tm" 
                checked={saveToTM} 
                onCheckedChange={setSaveToTM} 
              />
              <Label htmlFor="save-tm">Save to memory</Label>
            </div>
          </div>

          <Textarea 
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
            placeholder="Translation will appear here..."
            className="min-h-[200px]"
          />

          <div className="flex justify-between">
            <Button onClick={handleTranslate} disabled={isTranslating || !sourceText.trim()}>
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSaveManually} 
              disabled={!sourceText.trim() || !translatedText.trim()}
            >
              <Save className="mr-2 h-4 w-4" />
              Save to Memory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslateTab;
