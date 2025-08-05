import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { streamId, streamerName, amount } = await request.json()

    if (!streamId || !streamerName || !amount) {
      return NextResponse.json(
        { error: 'streamId, streamerName och amount krävs' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Donation till ${streamerName}`,
              description: 'Stöd för streamer på The Stream',
            },
            unit_amount: amount * 100, // Stripe använder ören
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/donation/cancel`,
      metadata: {
        streamId,
        streamerName,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { error: 'Kunde inte skapa donation' },
      { status: 500 }
    )
  }
} 