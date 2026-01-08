
export interface ServicePackage {
  id: string;
  name: string;
  items: string[];
  price: number;
  featured?: boolean;
  description: string;
}

export interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  seasonTag?: string;
}

export interface ContactInfo {
  phones: string[];
  gpay: string;
  whatsapp: string;
}

export interface BookingData {
  planId: string;
  name: string;
  phone: string;
  carModel: string;
  address: string;
  date: string;
  time: string;
}
