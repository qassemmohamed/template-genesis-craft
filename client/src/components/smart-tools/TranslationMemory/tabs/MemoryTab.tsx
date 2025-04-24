
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash, Copy } from "lucide-react";
import { TranslationMemory, getMemoryEntries, deleteMemoryEntry } from "../helpers/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languageOptions } from "../helpers/languageOptions";
import { domainOptions } from "../helpers/domainOptions";

const MemoryTab: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TranslationMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceLangFilter, setSourceLangFilter] = useState("");
  const [targetLangFilter, setTargetLangFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getMemoryEntries(
        sourceLangFilter || undefined,
        targetLangFilter || undefined,
        domainFilter || undefined
      );
      setEntries(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch translation memory entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [sourceLangFilter, targetLangFilter, domainFilter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMemoryEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      toast({
        title: "Success",
        description: "Entry deleted from translation memory",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    
    const normalizedSearch = searchTerm.toLowerCase();
    return (
      entry.sourceText.toLowerCase().includes(normalizedSearch) ||
      entry.targetText.toLowerCase().includes(normalizedSearch)
    );
  });

  const getLanguageName = (code: string) => {
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const getDomainName = (value: string) => {
    if (!value) return "General";
    const domain = domainOptions.find(d => d.value === value);
    return domain ? domain.label : value;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Translation Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                className="pl-8"
                placeholder="Search memory entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={sourceLangFilter} onValueChange={setSourceLangFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Source language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All languages</SelectItem>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={targetLangFilter} onValueChange={setTargetLangFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Target language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All languages</SelectItem>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All domains</SelectItem>
                {domainOptions.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading entries...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-10">No translation memory entries found.</div>
          ) : (
            <div className="space-y-4 mt-4">
              {filteredEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="border rounded-md p-4 bg-[var(--card)] shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                        {getLanguageName(entry.sourceLang)} → {getLanguageName(entry.targetLang)}
                      </span>
                      {entry.domain && (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                          {getDomainName(entry.domain)}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(entry.targetText)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(entry.id!)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-[var(--muted)] rounded text-sm break-words">
                      {entry.sourceText}
                    </div>
                    <div className="p-3 bg-[var(--accent)] rounded text-sm break-words">
                      {entry.targetText}
                    </div>
                  </div>
                  {entry.createdAt && (
                    <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                      Added: {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryTab;
