
import { useEffect, useState } from "react";
import { ClientInfo, CustomField, Template } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { customFields } from "../data/mockData";

interface ClientInfoFormProps {
  template: Template;
  onSubmit: (clientInfo: ClientInfo) => void;
  onBack: () => void;
}

export default function ClientInfoForm({
  template,
  onSubmit,
  onBack,
}: ClientInfoFormProps) {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [templateFields, setTemplateFields] = useState<CustomField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setTemplateFields(customFields[template.id] || []);
    }
  }, [template]);

  const handleChange = (field: string, value: string) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate standard fields
    const requiredStandardFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    requiredStandardFields.forEach(field => {
      if (!clientInfo[field]) {
        newErrors[field] = "This field is required";
      }
    });
    
    // Validate email format
    if (clientInfo.email && !/^\S+@\S+\.\S+$/.test(clientInfo.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Validate template-specific fields
    templateFields.forEach(field => {
      if (field.required && !clientInfo[field.id]) {
        newErrors[field.id] = "This field is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(clientInfo);
    }
  };

  return (
    <Card className="w-full border border-cardBg-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-semibold">Enter Client Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={clientInfo.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="bg-inputBg border-input"
                  error={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={clientInfo.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="bg-inputBg border-input"
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email"
                  className="bg-inputBg border-input"
                  error={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientInfo.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-inputBg border-input"
                  error={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={clientInfo.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter street address"
                className="bg-inputBg border-input"
                error={!!errors.address}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={clientInfo.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="bg-inputBg border-input"
                  error={!!errors.city}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={clientInfo.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="Enter state"
                  className="bg-inputBg border-input"
                  error={!!errors.state}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={clientInfo.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  placeholder="Enter ZIP code"
                  className="bg-inputBg border-input"
                  error={!!errors.zipCode}
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          {templateFields.length > 0 && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Template-Specific Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templateFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.id.toLowerCase().includes("notes") ? (
                        <Textarea
                          id={field.id}
                          value={clientInfo[field.id] || ""}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="bg-inputBg border-input min-h-[100px]"
                          error={!!errors[field.id]}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          value={clientInfo[field.id] || ""}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="bg-inputBg border-input"
                          error={!!errors[field.id]}
                        />
                      )}
                      {errors[field.id] && (
                        <p className="text-sm text-destructive">{errors[field.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="border-outline-button text-outline-button-text hover:bg-accent"
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="bg-button text-button-text hover:bg-button-hover"
            >
              Generate Document
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
