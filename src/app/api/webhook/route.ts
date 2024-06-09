import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "~/server/api/stripe/client";
import { db } from "~/server/db";

const webhookSecret =
  "whsec_ec2da0f2e5caa71f730eeb585bc76d64802d48c0f4a0eb8dabe2551e3259ca77";

const fullfillOrder = async ({
  session,
  event,
}: {
  session: any;
  event: Stripe.Event | null;
}) => {
  console.log("session", session);
  console.log("event.data.object.amount", event.data.object.amount);
  console.log("event.data.object", event.data.object);
  NextResponse.json({
    message: "Payment done",
    status: true,
    method: session.status,
    data: session,
  });
};

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  console.log("req", req);

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(payload, signature!, webhookSecret);

    if (event?.type === "payment_intent.succeeded") {
      const session = event.data.object;
      // await db.stripeEvent.create({
      //   data: {
      //     id: event.id,
      //     type: event.type,
      //     object: event.object,
      //     api_version: event.api_version,
      //     account: event.account,
      //     created: new Date(event.created * 1000), // convert to milliseconds
      //     data: {
      //       object: event.data.object,
      //       previous_attributes: event.data.previous_attributes,
      //     },
      //     livemode: event.livemode,
      //     pending_webhooks: event.pending_webhooks,
      //     request: {
      //       id: event.request?.id,
      //       idempotency_key: event.request?.idempotency_key,
      //     },
      //   },
      // });

      return fullfillOrder(session)
        .then(() => NextResponse.json({ status: 200 }))
        .catch((err) =>
          NextResponse.json({ error: err?.message }, { status: 500 })
        );
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
