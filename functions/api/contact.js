// Cloudflare Pages Function - Contact Form Handler
// POST /api/contact

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Name, email, and message are required." }),
        { status: 400, headers }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide a valid email address." }),
        { status: 400, headers }
      );
    }

    const submission = {
      name,
      email,
      phone: phone || "Not provided",
      message,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("CF-Connecting-IP") || "unknown",
    };

    // Store in KV if available
    if (env.CONTACT_SUBMISSIONS) {
      const key = `contact_${Date.now()}_${crypto.randomUUID()}`;
      await env.CONTACT_SUBMISSIONS.put(key, JSON.stringify(submission), {
        // Auto-expire after 90 days
        expirationTtl: 60 * 60 * 24 * 90,
      });
    }

    // If an email sending service is configured (e.g. Mailgun, Resend),
    // you can send notification emails here. Example with env vars:
    //
    // if (env.NOTIFICATION_EMAIL && env.MAILGUN_API_KEY) {
    //   await sendNotificationEmail(env, submission);
    // }

    console.log("Contact form submission:", JSON.stringify(submission));

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thanks for your message! We'll get back to you shortly.",
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong. Please try again." }),
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
