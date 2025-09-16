import { ReactNode } from "react";

export type AppProps = {
  children: ReactNode;
  pageName: string;
};

export type CustomTriggerProps = {
  handleToggle: () => void;
  pageName: string;
};

export type OrderSheetProps = {
  data: Order;
};

export type ActionProps = {
  onEditClick: () => void;
};

export type Order = {
  _id: string;
  user: { _id: string; name: string };
  items: [
    {
      product: { _id: string; name: string };
      quantity?: number;
      unitPrice: number;
      size?: string;
      color?: string;
      deliveryDate?: string;
      _id?: string;
      userComment?: string;
      rating?: number;
    },
  ];
  voucher?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  deliveryDate: string;
  trackingNumber: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  paymentMethod: string;
  paidAmount?: number;
  __v?: number;
  createdAt: string;
  updatedAt?: string;
  adminComment?: string;
  paymentId?: string;
};

export type DashboardCardProps = {
  title: string;
  primary: number;
  secondary?: number;
  paint: string;
};

export type Product = {
  _id: string;
  sku: string;
  name: string;
  categories: string[];
  price: number;
  pictures: string[];
  pictureLinks: string[];
  description: string;
  features: string;
  idealFor: string;
  colors: string[];
  size: string[];
  estDelivaryTime: number;
  shipFrom: string;
  stock: number;
  oldPrice?: number;
  primaryPicture?: string;
  discount?: number;
  __v?: number;
};

export type Voucher = {
  _id?: string;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  expiryDate: Date;
  isActive: boolean;
  __v?: number;
};

export type Category = {
  _id?: string;
  category: string;
  __v?: number;
};

export type Banner = {
  _id?: string;
  title: string;
  description?: string;
  btnText: string;
  btnLink: string;
  imgName?: string;
  imgUrl?: string;
  __v?: number;
  isActive: boolean;
};
