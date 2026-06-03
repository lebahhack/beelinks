export async function onRequest(context) {

  const url = new URL(context.request.url);
  const path = url.pathname.replace(/^\/+/, "");

  // =========================
  // CORS PRE-FLIGHT
  // =========================
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders()
    });
  }

  try {

    const isStatic =
      path.includes(".") ||
      path.startsWith("css/") ||
      path.startsWith("js/") ||
      path.startsWith("assets/") ||
      path.startsWith("components/") ||
      path.startsWith("amp/") ||
      path.startsWith("og/");

    // =========================
    // 1. REDIRECT LINK /r/
    // =========================
    if (url.pathname.startsWith("/r/")) {
      return fetch(
        "https://api-biolink.lebahhack.workers.dev" + url.pathname,
        { redirect: "manual" }
      );
    }


    // =========================
    // RESERVED ROUTES
    // =========================
    const reserved = [
      "",
      "login",
      "register",
      "dashboard",
      "profile",
      "admin",
      "api",
      "me",
      "logout",
      "stats",
      "kv-test",
      "privacy",
      "terms",
      "about"
    ];

    // =========================
    // 3. AMP ROUTE (fallback to assets)
    // =========================
    if (url.pathname.startsWith("/amp/")) {
      return context.env.ASSETS.fetch(context.request);
    }

    // =========================
    // 4. OG ROUTE (fallback to assets)
    // =========================
    if (url.pathname.startsWith("/og/")) {
      return context.env.ASSETS.fetch(context.request);
    }

    // =========================
    // 5. PROFILE SSR SEO (/username)
    // =========================
    if (!reserved.includes(path)) {

      const user = await context.env.BIO_KV.get(
        `user:${path}`,
        "json"
      );

      if (user) {

        const title = `${user.name || user.username} | BeeLinks`;
        const description = user.bio || `Link page ${user.username}`;
        const image = user.avatar || `${url.origin}/avatar/${user.username}`;

        const links = (user.links || [])
          .filter(l => l.active !== false)
          .map(l => `
            <a class="profile-link"
               href="/r/${user.username}/${l.id}">
              ${l.title}
            </a>
          `).join("");

        return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>${title}</title>
<meta name="description" content="${description}">

<meta property="og:type" content="profile">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url.href}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">

<link rel="canonical" href="${url.href}">

<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/profile.css">

</head>
<body>

<main class="profile">

<div class="profile-card">

<img class="profile-avatar" src="${image}" alt="${user.username}">

<h1 class="profile-name">
${user.name || user.username}
</h1>

<p class="profile-bio">
${user.bio || ""}
</p>

</div>

<div class="profile-links">
${links}
</div>

</main>

</body>
</html>
`, {
          headers: {
            "content-type": "text/html;charset=UTF-8"
          }
        });
      }
    }


        // =========================
    // 2. STATIC FILES BYPASS
    // =========================
    if (isStatic) {
      return context.env.ASSETS.fetch(context.request);
    }


    
    // =========================
    // 6. NOT FOUND
    // =========================
    return json({
      success: false,
      message: "Not found"
    }, 404);

  } catch (err) {
    return json({
      success: false,
      error: err.message
    }, 500);
  }
}

// =========================
// HELPERS
// =========================

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders()
    }
  });
}
