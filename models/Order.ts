import mongoose from 'mongoose';

export interface IOrderItem {
  product: {
    _id?: string;
    name: string;
    price: number;
    image: string;
    unit: string;
  };
  quantity: number;
}

export interface IOrder {
  orderNumber: string;
  phone: string;
  address: string;
  details?: string;
  paymentMethod: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'rejected';
}

const OrderItemSchema = new mongoose.Schema({
  product: {
    _id: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    unit: { type: String, required: true },
  },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  details: { type: String },
  paymentMethod: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

delete mongoose.models.Order;

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
