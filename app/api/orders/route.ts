/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Save to DB
    const order = await Order.create(body);

    // Send Email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const itemsList = order.items.map((item: any) => 
        `- ${item.quantity}x ${item.product.name} (₦${item.product.price.toLocaleString()})`
      ).join('\n');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'awoluowolabisamuel@gmail.com',
        subject: `New Order Received! #${order.orderNumber}`,
        text: `
Hello Admin,

A new order has just been placed.

Order Number: ${order.orderNumber}
Customer Phone: ${order.phone}
Delivery Address: ${order.address}
Notes: ${order.details || 'None'}
Payment Method: ${order.paymentMethod}

Items Ordered:
${itemsList}

Total: ₦${order.total.toLocaleString()}

Log into the admin dashboard to process this order.
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email failed to send:', emailError);
      // We still return success for the order itself even if email fails
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create order', details: message }, { status: 400 });
  }
}
