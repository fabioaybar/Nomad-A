export interface VendorOnboardingForm {
  company_name: string;
  business_type: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  business_license: File | null;
  tax_id: File | null;
  additional_docs: File[];
  agreements: {
    vendor_agreement: boolean;
    terms_of_service: boolean;
    privacy_policy: boolean;
    data_agreement: boolean;
  };
}