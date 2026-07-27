/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await dbConnect();
    
    // We update by MongoDB _id in this case, since it's the natural identifier for orders
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update order', details: message }, { status: 400 });
  }
}
