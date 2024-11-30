import { Request, Response } from 'express';
import { PaymentStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new payment record.
export const createPayment = async (req: Request, res: Response) => {
  const { jobId, contractId, amount, currency, paymentMethod } = req.body;

  try {
    const payment = await prisma.payment.create({
      data: {
        jobId,
        contractId,
        amount,
        currency,
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Simulate payment processing.
export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
    });
    if (!payment) {
      throw new Error('Payment not found.');
    }
    // Simulate payment processing logic
    const paymentStatus =
      Math.random() > 0.5 ? PaymentStatus.PAID : PaymentStatus.ESCROW;

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { paymentStatus },
    });

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get payment details.
export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new Error('Payment not found.');
    }
    res.json(payment);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 'Payment not found' });
  }
};
