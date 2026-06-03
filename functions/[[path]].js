export async function onRequest(context) {

  const url =
    new URL(
      context.request.url
    );

  const path =
    url.pathname
      .replace(/^\/+/, "")
      .toLowerCase();

  // =========================
  // REDIRECT LINK
  // =========================

  if (
    url.pathname.startsWith("/r/")
  ) {

    return fetch(
      "https://api-biolink.lebahhack.workers.dev" +
      url.pathname,
      {
        redirect: "manual"
      }
    );

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
  // PUBLIC PROFILE
  // =========================

  if (
    path &&
    !reserved.includes(path)
  ) {

    try {

      const api =
        await fetch(
          `https://api-biolink.lebahhack.workers.dev/${path}`
        );

      if (!api.ok) {

        return new Response(
          notFoundHtml(),
          {
            status: 404,
            headers: {
              "Content-Type":
                "text/html;charset=UTF-8"
            }
          }
        );

      }

      const profile =
        await api.json();

      return new Response(
        profileHtml(
          profile,
          url
        ),
        {
          headers: {
            "Content-Type":
              "text/html;charset=UTF-8"
          }
        }
      );

    } catch {

      return new Response(
        notFoundHtml(),
        {
          status: 404,
          headers: {
            "Content-Type":
              "text/html;charset=UTF-8"
          }
        }
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

function profileHtml(
  profile,
  url
) {

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

const theme =
  profile.theme ||
  "default";
  
  const links =
    (profile.links || [])
      .filter(
        link =>
          link.active !== false
      )
      .map(
        link => `
<a
class="profile-link"
href="/r/${profile.username}/${link.id}"
target="_blank"
rel="noopener noreferrer">

${escapeHtml(link.title)}

</a>
`
      )
      .join("");

  return `
<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>${escapeHtml(title)}</title>

<meta
name="description"
content="${escapeHtml(description)}">

<meta
name="robots"
content="index,follow">

<meta
property="og:type"
content="profile">

<meta
property="og:title"
content="${escapeHtml(title)}">

<meta
property="og:description"
content="${escapeHtml(description)}">

<meta
property="og:image"
content="${image}">

<meta
property="og:url"
content="${url.href}">

<meta
name="twitter:card"
content="summary_large_image">

<meta
name="twitter:title"
content="${escapeHtml(title)}">

<meta
name="twitter:description"
content="${escapeHtml(description)}">

<meta
name="twitter:image"
content="${image}">

<link
rel="canonical"
href="${url.href}">

<link
rel="stylesheet"
href="/css/profile.css">

<link
rel="stylesheet"
href="/css/themes/profile-${theme}.css">

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfilePage",
  "name":"${escapeHtml(profile.name || profile.username)}",
  "description":"${escapeHtml(description)}",
  "url":"${url.href}",
  "image":"${image}"
}
</script>

</head>

<body>

<main class="profile">

<div class="profile-card">

<img
class="profile-avatar"
src="${image}"
alt="${escapeHtml(
  profile.name ||
  profile.username
)}"
loading="eager">

<h1
class="profile-name">

${escapeHtml(
  profile.name ||
  profile.username
)}

</h1>

<p
class="profile-bio">

${escapeHtml(
  profile.bio || ""
)}

</p>

</div>

<div
class="profile-links">

${links}

</div>

<footer
class="profile-footer">

<a
href="/"
class="btn btn-secondary">

Buat Halaman Seperti Ini

</a>

</footer>

</main>

</body>

</html>
`;

}

function notFoundHtml() {

  return `
<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<title>
Profil Tidak Ditemukan
</title>

</head>

<body>

<main class="not-found">

<h1>
404
</h1>

<p>
Profil tidak ditemukan.
</p>

<br>

<a href="/">
Kembali ke Beranda
</a>

</main>

</body>

</html>
`;

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
