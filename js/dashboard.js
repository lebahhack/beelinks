/* =========================
   DASHBOARD
========================= */

let profile = null;

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);

async function initDashboard() {

  requireAuth();

  try {

    profile = await currentUser();

    renderProfile();

    renderLinks();

  } catch (err) {

    console.error(err);

  }

}

/* =========================
   RENDER PROFILE
========================= */

function renderProfile() {

  if (!profile) return;

  const name =
  document.getElementById(
    "profile-name"
  );

  const bio =
  document.getElementById(
    "profile-bio"
  );

  const avatar =
  document.getElementById(
    "profile-avatar"
  );

  if (name) {
    name.value =
    profile.name || "";
  }

  if (bio) {
    bio.value =
    profile.bio || "";
  }

  if (avatar) {
    avatar.value =
    profile.avatar || "";
  }

}

/* =========================
   SAVE PROFILE
========================= */

async function saveProfile() {

  try {

    const payload = {

      name:
      document.getElementById(
        "profile-name"
      ).value.trim(),

      bio:
      document.getElementById(
        "profile-bio"
      ).value.trim(),

      avatar:
      document.getElementById(
        "profile-avatar"
      ).value.trim()

    };

    await updateProfile(
      payload
    );

    alert(
      "Profil berhasil disimpan"
    );

  } catch (err) {

    alert(
      err.message
    );

  }

}

/* =========================
   RENDER LINKS
========================= */

function renderLinks() {

  const container =
  document.getElementById(
    "links-list"
  );

  if (!container) return;

  container.innerHTML = "";

  const links =
  profile.links || [];

  if (!links.length) {

    container.innerHTML = `
      <p>
        Belum ada link
      </p>
    `;

    return;

  }

  links.forEach(link => {

    const item =
    document.createElement(
      "div"
    );

    item.className =
    "link-item";

    item.innerHTML = `
      <div class="link-content">

        <strong>
          ${escapeHtml(link.title)}
        </strong>

        <small>
          ${escapeHtml(link.url)}
        </small>

      </div>

      <button
        onclick="removeLink('${link.id}')"
      >
        Hapus
      </button>
    `;

    container.appendChild(
      item
    );

  });

}

/* =========================
   ADD LINK
========================= */

async function addNewLink() {

  const title =
  document.getElementById(
    "link-title"
  ).value.trim();

  const url =
  document.getElementById(
    "link-url"
  ).value.trim();

  if (!title) {

    alert(
      "Judul wajib diisi"
    );

    return;

  }

  if (!url) {

    alert(
      "URL wajib diisi"
    );

    return;

  }

  try {

    const result =
    await addLink(
      title,
      url
    );

    profile.links =
    result.links || [];

    renderLinks();

    document.getElementById(
      "link-title"
    ).value = "";

    document.getElementById(
      "link-url"
    ).value = "";

  } catch (err) {

    alert(
      err.message
    );

  }

}

/* =========================
   DELETE LINK
========================= */

async function removeLink(id) {

  const ok =
  confirm(
    "Hapus link ini?"
  );

  if (!ok) return;

  try {

    const result =
    await deleteLink(id);

    profile.links =
    result.links || [];

    renderLinks();

  } catch (err) {

    alert(
      err.message
    );

  }

}

/* =========================
   COPY PROFILE URL
========================= */

async function copyMyProfile() {

  const username =
  Auth.username();

  const url =
  `${location.origin}/${username}`;

  try {

    await navigator
    .clipboard
    .writeText(url);

    alert(
      "Link profil disalin"
    );

  } catch {

    alert(
      url
    );

  }

}

/* =========================
   PREVIEW PROFILE
========================= */

function openProfile() {

  const username =
  Auth.username();

  window.open(
    `/${username}`,
    "_blank"
  );

}
