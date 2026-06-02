/* =========================
   SEO CORE
========================= */

function setTitle(
  title
) {

  document.title =
    title || "BeeLinks";

}

/* =========================
   META NAME
========================= */

function setMeta(
  name,
  content
) {

  if (!content) return;

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

function setMetaProperty(
  property,
  content
) {

  if (!content) return;

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
   CANONICAL
========================= */

function setCanonical(
  url
) {

  let tag =
    document.querySelector(
      'link[rel="canonical"]'
    );

  if (!tag) {

    tag =
      document.createElement(
        "link"
      );

    tag.rel =
      "canonical";

    document.head.appendChild(
      tag
    );

  }

  tag.href =
    url ||
    location.href;

}

/* =========================
   ROBOTS
========================= */

function setRobots(
  value =
    "index,follow"
) {

  setMeta(
    "robots",
    value
  );

}

/* =========================
   OG
========================= */

function setOG({

  title,

  description,

  image,

  url,

  type = "website"

} = {}) {

  setMetaProperty(
    "og:title",
    title
  );

  setMetaProperty(
    "og:description",
    description
  );

  setMetaProperty(
    "og:image",
    image
  );

  setMetaProperty(
    "og:url",
    url
  );

  setMetaProperty(
    "og:type",
    type
  );

}

/* =========================
   TWITTER
========================= */

function setTwitter({

  title,

  description,

  image

} = {}) {

  setMeta(
    "twitter:card",
    "summary_large_image"
  );

  setMeta(
    "twitter:title",
    title
  );

  setMeta(
    "twitter:description",
    description
  );

  setMeta(
    "twitter:image",
    image
  );

}

/* =========================
   PROFILE SEO
========================= */

function profileSEO(
  profile
) {

  const title =
    profile.name
      ? `${profile.name} | BeeLinks`
      : `${profile.username} | BeeLinks`;

  const description =
    profile.bio ||
    `Lihat semua link ${
      profile.name ||
      profile.username
    } di BeeLinks`;

  const image =
    avatarUrl(
      profile
    );

  setTitle(
    title
  );

  setMeta(
    "description",
    description
  );

  setCanonical(
    location.href
  );

  setRobots(
    "index,follow"
  );

  setOG({

    title,
    description,
    image,

    url:
      location.href,

    type:
      "profile"

  });

  setTwitter({

    title,
    description,
    image

  });

}

/* =========================
   LANDING SEO
========================= */

function landingSEO() {

  const title =
    "BeeLinks - Semua Link Anda dalam Satu Halaman";

  const description =
    "Buat halaman bio link gratis untuk Instagram, TikTok, WhatsApp, YouTube dan semua media sosial.";

  const image =
    location.origin +
    "/assets/og-default.png";

  setTitle(
    title
  );

  setMeta(
    "description",
    description
  );

  setCanonical(
    location.href
  );

  setOG({

    title,
    description,
    image,

    url:
      location.href

  });

  setTwitter({

    title,
    description,
    image

  });

}
