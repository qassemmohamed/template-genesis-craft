
import { Category, CustomField, Template } from "../types";

export const categories: Category[] = [
  { id: "tax", name: "Tax Filing" },
  { id: "immigration", name: "Immigration" },
  { id: "legal", name: "Legal Documents" },
  { id: "business", name: "Business" },
  { id: "personal", name: "Personal" }
];

export const templates: Template[] = [
  {
    id: "tax-individual",
    name: "Individual Tax Filing Cover Letter",
    category: "tax",
    content: `[Date]

[IRS Office Address]

Re: Tax Filing for {{firstName}} {{lastName}}, Tax Year {{taxYear}}

Dear Sir/Madam,

Please find enclosed the {{taxYear}} individual income tax return for {{firstName}} {{lastName}}, SSN: {{ssn}}.

{{additionalNotes}}

Thank you for your attention to this matter. Should you have any questions, please contact me at {{phone}} or {{email}}.

Sincerely,
{{firstName}} {{lastName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
`
  },
  {
    id: "tax-business",
    name: "Business Tax Filing Cover Letter",
    category: "tax",
    content: `[Date]

[IRS Office Address]

Re: Business Tax Filing for {{businessName}}, Tax Year {{taxYear}}

Dear Sir/Madam,

Please find enclosed the {{taxYear}} business tax return for {{businessName}}, EIN: {{ein}}.

{{additionalNotes}}

Thank you for your attention to this matter. Should you have any questions, please contact me at {{phone}} or {{email}}.

Sincerely,
{{firstName}} {{lastName}}
{{businessTitle}}
{{businessName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
`
  },
  {
    id: "immigration-cover",
    name: "Immigration Application Cover Letter",
    category: "immigration",
    content: `[Date]

[USCIS Office Address]

Re: {{applicationType}} Application for {{firstName}} {{lastName}}

Dear Sir/Madam,

I am writing to submit my application for {{applicationType}}. Please find enclosed all required documentation as listed in the checklist.

Applicant Information:
Name: {{firstName}} {{lastName}}
A-Number (if applicable): {{aNumber}}
Date of Birth: {{dateOfBirth}}
Country of Citizenship: {{citizenship}}

{{additionalNotes}}

Thank you for your consideration. Should you require any additional information, please contact me at {{phone}} or {{email}}.

Sincerely,
{{firstName}} {{lastName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
`
  },
  {
    id: "legal-demand",
    name: "Demand Letter",
    category: "legal",
    content: `[Date]

{{recipientName}}
{{recipientAddress}}
{{recipientCity}}, {{recipientState}} {{recipientZip}}

Re: Demand for Payment

Dear {{recipientName}},

This letter serves as a formal demand for payment in the amount of {{amountOwed}} for {{serviceProvided}} provided on {{serviceDate}}.

Despite several previous attempts to resolve this matter, the payment remains outstanding. Please remit payment within {{paymentDays}} days of receipt of this letter.

If payment is not received by {{dueDate}}, I will have no choice but to pursue legal remedies, including filing a lawsuit to recover the amount owed plus additional costs.

{{additionalNotes}}

Sincerely,
{{firstName}} {{lastName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
{{phone}}
{{email}}
`
  },
  {
    id: "business-proposal",
    name: "Business Proposal",
    category: "business",
    content: `[Date]

{{recipientName}}
{{recipientCompany}}
{{recipientAddress}}
{{recipientCity}}, {{recipientState}} {{recipientZip}}

Re: Business Proposal for {{projectName}}

Dear {{recipientName}},

I am pleased to submit this proposal for {{projectName}} on behalf of {{businessName}}.

Project Overview:
{{projectDescription}}

Proposed Timeline:
{{projectTimeline}}

Budget and Cost Breakdown:
{{budgetDetails}}

I believe this proposal addresses your requirements as discussed during our meeting on {{meetingDate}}. We look forward to the opportunity to work with {{recipientCompany}} on this project.

{{additionalNotes}}

Please feel free to contact me at {{phone}} or {{email}} if you have any questions.

Sincerely,
{{firstName}} {{lastName}}
{{businessTitle}}
{{businessName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
`
  },
  {
    id: "personal-letter",
    name: "Personal Reference Letter",
    category: "personal",
    content: `[Date]

To Whom It May Concern:

I am writing this letter to recommend {{referenceName}} whom I have known for {{yearsKnown}} years as {{relationship}}.

{{referenceName}} has consistently demonstrated {{qualityOne}}, {{qualityTwo}}, and {{qualityThree}} during the time I have known them.

{{specificExample}}

I confidently recommend {{referenceName}} for {{recommendation}}. If you have any questions, please feel free to contact me at {{phone}} or {{email}}.

Sincerely,
{{firstName}} {{lastName}}
{{address}}
{{city}}, {{state}} {{zipCode}}
`
  }
];

export const customFields: Record<string, CustomField[]> = {
  "tax-individual": [
    { id: "taxYear", name: "Tax Year", placeholder: "e.g., 2024", required: true },
    { id: "ssn", name: "SSN", placeholder: "e.g., XXX-XX-XXXX", required: true },
    { id: "additionalNotes", name: "Additional Notes", placeholder: "Any additional information...", required: false }
  ],
  "tax-business": [
    { id: "businessName", name: "Business Name", placeholder: "e.g., Acme Corp", required: true },
    { id: "businessTitle", name: "Business Title", placeholder: "e.g., CEO", required: true },
    { id: "taxYear", name: "Tax Year", placeholder: "e.g., 2024", required: true },
    { id: "ein", name: "EIN", placeholder: "e.g., XX-XXXXXXX", required: true },
    { id: "additionalNotes", name: "Additional Notes", placeholder: "Any additional information...", required: false }
  ],
  "immigration-cover": [
    { id: "applicationType", name: "Application Type", placeholder: "e.g., Green Card, Visa Extension", required: true },
    { id: "aNumber", name: "A-Number (if applicable)", placeholder: "e.g., A123456789", required: false },
    { id: "dateOfBirth", name: "Date of Birth", placeholder: "e.g., 01/01/1980", required: true },
    { id: "citizenship", name: "Country of Citizenship", placeholder: "e.g., Canada", required: true },
    { id: "additionalNotes", name: "Additional Notes", placeholder: "Any additional information...", required: false }
  ],
  "legal-demand": [
    { id: "recipientName", name: "Recipient Name", placeholder: "e.g., John Smith", required: true },
    { id: "recipientAddress", name: "Recipient Address", placeholder: "e.g., 123 Main St", required: true },
    { id: "recipientCity", name: "Recipient City", placeholder: "e.g., New York", required: true },
    { id: "recipientState", name: "Recipient State", placeholder: "e.g., NY", required: true },
    { id: "recipientZip", name: "Recipient ZIP", placeholder: "e.g., 10001", required: true },
    { id: "amountOwed", name: "Amount Owed", placeholder: "e.g., $500", required: true },
    { id: "serviceProvided", name: "Service Provided", placeholder: "e.g., Consulting Services", required: true },
    { id: "serviceDate", name: "Service Date", placeholder: "e.g., 05/15/2024", required: true },
    { id: "paymentDays", name: "Payment Days", placeholder: "e.g., 30", required: true },
    { id: "dueDate", name: "Due Date", placeholder: "e.g., 06/15/2024", required: true },
    { id: "additionalNotes", name: "Additional Notes", placeholder: "Any additional information...", required: false }
  ],
  "business-proposal": [
    { id: "recipientName", name: "Recipient Name", placeholder: "e.g., Jane Doe", required: true },
    { id: "recipientCompany", name: "Recipient Company", placeholder: "e.g., XYZ Corp", required: true },
    { id: "recipientAddress", name: "Recipient Address", placeholder: "e.g., 456 Business Ave", required: true },
    { id: "recipientCity", name: "Recipient City", placeholder: "e.g., Chicago", required: true },
    { id: "recipientState", name: "Recipient State", placeholder: "e.g., IL", required: true },
    { id: "recipientZip", name: "Recipient ZIP", placeholder: "e.g., 60601", required: true },
    { id: "businessName", name: "Your Business Name", placeholder: "e.g., Acme Services", required: true },
    { id: "businessTitle", name: "Your Business Title", placeholder: "e.g., CEO", required: true },
    { id: "projectName", name: "Project Name", placeholder: "e.g., Website Redesign", required: true },
    { id: "projectDescription", name: "Project Description", placeholder: "Brief description of the project...", required: true },
    { id: "projectTimeline", name: "Project Timeline", placeholder: "e.g., 8 weeks beginning July 1, 2024", required: true },
    { id: "budgetDetails", name: "Budget Details", placeholder: "Detailed breakdown of costs...", required: true },
    { id: "meetingDate", name: "Meeting Date", placeholder: "e.g., 05/20/2024", required: false },
    { id: "additionalNotes", name: "Additional Notes", placeholder: "Any additional information...", required: false }
  ],
  "personal-letter": [
    { id: "referenceName", name: "Reference Name", placeholder: "e.g., John Smith", required: true },
    { id: "yearsKnown", name: "Years Known", placeholder: "e.g., 5", required: true },
    { id: "relationship", name: "Relationship", placeholder: "e.g., colleague, student", required: true },
    { id: "qualityOne", name: "Quality #1", placeholder: "e.g., leadership", required: true },
    { id: "qualityTwo", name: "Quality #2", placeholder: "e.g., dedication", required: true },
    { id: "qualityThree", name: "Quality #3", placeholder: "e.g., creativity", required: true },
    { id: "specificExample", name: "Specific Example", placeholder: "Describe a specific situation demonstrating their qualities...", required: true },
    { id: "recommendation", name: "Recommendation For", placeholder: "e.g., the position of Marketing Manager", required: true }
  ]
};
