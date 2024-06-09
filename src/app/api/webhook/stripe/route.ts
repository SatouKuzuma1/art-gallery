import { headers } from "next/headers";
import type Stripe from "stripe";

import { stripe } from "~/server/api/stripe/client";
import { db } from "~/server/db";

import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from "~/server/api/stripe/stripe-webhook-handlers";

const endpointSecret =
  "whsec_ec2da0f2e5caa71f730eeb585bc76d64802d48c0f4a0eb8dabe2551e3259ca77";
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }
  console.log("event.type", event.type);
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  // if (event.type === "checkout.session.completed") {
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string,
  //   );

  //   await db.user.update({
  //     where: {
  //       id: session.metadata.userId,
  //     },
  //     data: {
  //       stripeSubscriptionId: subscription.id,
  //       stripeCustomerId: subscription.customer as string,
  //     },
  //   });
  // }

  // Handle the event
  switch (event.type) {
    case "invoice.paid":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
      await handleInvoicePaid({
        event,
        stripe,
        db,
      });
      break;
    case "customer.subscription.created":
      // Used to provision services as they are added to a subscription.
      await handleSubscriptionCreatedOrUpdated({
        event,
        db,
      });
      break;
    case "customer.subscription.updated":
      // Used to provision services as they are updated.
      await handleSubscriptionCreatedOrUpdated({
        event,
        db,
      });
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
      break;
    case "customer.subscription.deleted":
      // handle subscription cancelled automatically based
      // upon your subscription settings.
      await handleSubscriptionCanceled({
        event,
        db,
      });
      break;
    default:
    // Unexpected event type
  }
  // record the event in the database
  await db.stripeEvent.create({
    data: {
      id: event.id,
      type: event.type,
      object: event.object,
      api_version: event.api_version,
      account: event.account,
      created: new Date(event.created * 1000), // convert to milliseconds
      data: {
        object: event.data.object,
        previous_attributes: event.data.previous_attributes,
      },
      livemode: event.livemode,
      pending_webhooks: event.pending_webhooks,
      request: {
        id: event.request?.id,
        idempotency_key: event.request?.idempotency_key,
      },
    },
  });

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // update user with subscription data
    await db.user.update({
      where: {
        id: subscription.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
      },
    });

    return new Response(null, { status: 200 });
  }
}
