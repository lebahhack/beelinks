/* =========================
   PROFILE PAGE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  loadProfile
);

/* =========================
   LOAD PROFILE
========================= */

async function loadProfile() {

  try {

    const username =
      getProfileUsername();

    if (!username) {

      showNotFound();

      return;

    }

    const profile =
      await getProfile(
        username
      );

    if (!profile) {

      showNotFound();

      return;

    }

    renderProfile(
      profile
    );

  } catch (err) {

    console.error(err);

    showNotFound();

  }

}

/* =========================
   USERNAME FROM URL
========================= */

function getProfileUsername() {

  const path =
    location.pathname
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .toLowerCase();

  const reserved = [

    "",

    "login",
    "register",

    "dashboard",
    "profile",

    "admin",

    "about",
    "contact",

    "privacy",
    "terms",

    "favicon.ico",

    "robots.txt",
    "sitemap.xml"

  ];

  if (
    reserved.includes(
      path
    )
  ) {

    return null;

  }

  return path;

}

/* =========================
   RENDER PROFILE
========================= */

function renderProfile(
  profile
) {

  const avatar =
    document.getElementById(
      "profile-avatar"
    );

  const name =
    document.getElementById(
      "profile-name"
    );

  const bio =
    document.getElementById(
      "profile-bio"
    );

  if (avatar) {

    avatar.src =
      avatarUrl(
        profile
      );

    avatar.alt =
      profile.name ||
      profile.username;

  }

  if (name) {

    name.textContent =
      profile.name ||
      profile.username;

  }

  if (bio) {

    bio.textContent =
      profile.bio || "";

  }

  renderLinks(
    profile
  );

  updateSEO(
    profile
  );

}

/* =========================
   RENDER LINKS
========================= */

function renderLinks(
  profile
) {

  const container =
    document.getElementById(
      "profile-links"
    );

  if (!container) return;

  container.innerHTML =
    "";

  const links =
    (profile.links || [])
      .filter(
        link =>
          link.active !== false
      );

  if (!links.length) {

    container.innerHTML = `
      <p>
        Belum ada link tersedia.
      </p>
    `;

    return;

  }

  links.forEach(link => {

    const a =
      document.createElement(
        "a"
      );

    a.className =
      "profile-link";

    a.href =
      `${API_BASE}/r/${profile.username}/${link.id}`;

    a.target =
      "_blank";

    a.rel =
      "noopener noreferrer";

    a.textContent =
      link.title;

    container.appendChild(
      a
    );

  });

}

/* =========================
   SEO
========================= */

function updateSEO(
  profile
) {

  const title =
    profile.name
      ? `${profile.name} | BeeLinks`
      : `${profile.username} | BeeLinks`;

  const description =
    profile.bio ||
    `${profile.name || profile.username} di BeeLinks`;

  document.title =
    title;

  updateMeta(
    "description",
    description
  );

  updateMetaProperty(
    "og:title",
    title
  );

  updateMetaProperty(
    "og:description",
    description
  );

  updateMetaProperty(
    "og:image",
    avatarUrl(
      profile
    )
  );

  updateMetaProperty(
    "og:type",
    "profile"
  );

  updateMetaProperty(
    "og:url",
    location.href
  );

}

/* =========================
   META NAME
========================= */

function updateMeta(
  name,
  content
) {

  let tag =
    document.querySelector(
      `meta[name="${name}"]`
    );

  if (!tag) {

    tag =
      document.createElement(
        "meta"
      );

    tag.setAttribute(
      "name",
      name
    );

    document.head.appendChild(
      tag
    );

  }

  tag.setAttribute(
    "content",
    content
  );

}

/* =========================
   META PROPERTY
========================= */

function updateMetaProperty(
  property,
  content
) {

  let tag =
    document.querySelector(
      `meta[property="${property}"]`
    );

  if (!tag) {

    tag =
      document.createElement(
        "meta"
      );

    tag.setAttribute(
      "property",
      property
    );

    document.head.appendChild(
      tag
    );

  }

  tag.setAttribute(
    "content",
    content
  );

}

/* =========================
   NOT FOUND
========================= */

function showNotFound() {

  document.title =
    "Profil Tidak Ditemukan";

  document.body.innerHTML = `

    <main
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        text-align:center;
        padding:20px;
        font-family:system-ui;
      "
    >

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

  `;

}
