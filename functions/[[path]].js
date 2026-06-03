export async function onRequest(context) {

  const url =
    new URL(
      context.request.url
    );

  const path =
    url.pathname
      .replace(/^\/+/, "");

  // =========================
  // REDIRECT LINK
  // =========================

  if (
    url.pathname.startsWith("/r/")
  ) {

    const response =
      await fetch(
        "https://api-biolink.lebahhack.workers.dev" +
        url.pathname,
        {
          redirect: "manual"
        }
      );

    return response;

  }

  // =========================
  // STATIC FILES
  // =========================

  if (
    path.includes(".") ||
    path.startsWith("css/") ||
    path.startsWith("js/") ||
    path.startsWith("assets/")
  ) {

    return context.env.ASSETS.fetch(
      context.request
    );

  }

  const reserved = [

    "",

    "login",

    "register",

    "dashboard",

    "profile"

  ];

  // =========================
  // PROFILE PAGE + SEO
  // =========================

  if (
    path &&
    !reserved.includes(path)
  ) {

    try {

      const apiResponse =
        await fetch(
          `https://api-biolink.lebahhack.workers.dev/${path}`
        );

      if (
        !apiResponse.ok
      ) {

        return context.env.ASSETS.fetch(
          new Request(
            new URL(
              "/404.html",
              url
            )
          )
        );

      }

      const profile =
        await apiResponse.json();

      const assetResponse =
        await context.env.ASSETS.fetch(
          new Request(
            new URL(
              "/profile.html",
              url
            )
          )
        );

      let html =
        await assetResponse.text();

      const title =
        `${profile.name || profile.username} | BeeLinks`;

      const description =
        profile.bio ||
        `Lihat semua link ${
          profile.name ||
          profile.username
        }`;

      const image =
        profile.avatar ||
        `https://api-biolink.lebahhack.workers.dev/avatar/${profile.username}`;

      html =
        html.replace(
          /<title>.*?<\/title>/i,
          `<title>${escapeHtml(title)}</title>`
        );

      html =
        html.replace(
          /<meta\s+name="description"\s+content=".*?">/i,
          `<meta name="description" content="${escapeHtml(description)}">`
        );

      html =
        html.replace(
          /<meta\s+property="og:title"\s+content=".*?">/i,
          `<meta property="og:title" content="${escapeHtml(title)}">`
        );

      html =
        html.replace(
          /<meta\s+property="og:description"\s+content=".*?">/i,
          `<meta property="og:description" content="${escapeHtml(description)}">`
        );

      html =
        html.replace(
          /<meta\s+property="og:image"\s+content=".*?">/i,
          `<meta property="og:image" content="${image}">`
        );

      html =
        html.replace(
          /<link\s+rel="canonical"\s+href=".*?">/i,
          `<link rel="canonical" href="${url.href}">`
        );

      return new Response(
        html,
        {
          headers: {
            "Content-Type":
              "text/html;charset=UTF-8"
          }
        }
      );

    } catch {

      return context.env.ASSETS.fetch(
        new Request(
          new URL(
            "/404.html",
            url
          )
        )
      );

    }

  }

  // =========================
  // DEFAULT
  // =========================

  return context.env.ASSETS.fetch(
    context.request
  );

}

function escapeHtml(
  text = ""
) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
