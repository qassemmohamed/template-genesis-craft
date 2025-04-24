
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Save } from "lucide-react";
import { getTranslationHistory, saveToMemory, TranslationHistory } from "../helpers/utils";
import { languageOptions } from "../helpers/languageOptions";

const HistoryTab: React.FC = () => {
  const { toast } = useToast();
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getTranslationHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch translation history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const saveToTranslationMemory = async (item: TranslationHistory) => {
    try {
      await saveToMemory({
        sourceText: item.sourceText,
        targetText: item.targetText,
        sourceLang: item.sourceLang,
        targetLang: item.targetLang
      });
      
      toast({
        title: "Success",
        description: "Translation saved to memory",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to translation memory",
        variant: "destructive",
      });
    }
  };

  const getLanguageName = (code: string) => {
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">No translation history found.</div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id}
                className="border rounded-md p-4 bg-[var(--card)] shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                    {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
                  </span>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--muted)] rounded text-sm break-words">
                    {item.sourceText}
                  </div>
                  <div className="p-3 bg-[var(--accent)] rounded text-sm break-words">
                    {item.targetText}
                  </div>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(item.targetText)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => saveToTranslationMemory(item)}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Memory
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
