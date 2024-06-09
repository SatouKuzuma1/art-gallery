import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { stripe } from "~/server/api/stripe/client";
import { type ProductProps } from "~/types/product";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { items, email } = await reqBody;
    console.log("items", items);
    console.log("email", email);

    const updatedItems = await items.map((item: ProductProps) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
          description: item.description,
          images: [item.images[0]],
        },
      },
    }));

    // const baseUrl =
    //   env.NODE_ENV === "development"
    //     ? `http://${"localhost:3000"}`
    //     : `https://${env.NEXTAUTH_URL}`;

    stripe.invoices;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: updatedItems,
      mode: "payment",
      success_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: `http://localhost:3000/`,
      metadata: { email },
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["ES"] },
    });
    console.log("session", session);

    if (session) {
    }

    return NextResponse.json({
      message: "Connection is alive",
      success: true,
      id: session.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};
