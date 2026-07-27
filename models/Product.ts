import mongoose from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  unit: string;
  hasDiscount?: boolean;
  discountPrice?: number | null;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  unit: {
    type: String,
    required: true,
  },
  hasDiscount: {
    type: Boolean,
    default: false,
  },
  discountPrice: {
    type: Number,
  }
}, {
  timestamps: true,
});

// Fix for Next.js hot reloading caching old schemas
delete mongoose.models.Product;

export default mongoose.model<IProduct>('Product', ProductSchema);
