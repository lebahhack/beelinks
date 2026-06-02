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

  if (!requireAuth()) {
    return;
  }

  try {

    const res =
      await me();

    profile =
      res.user;

    renderProfile();

    renderLinks();

  } catch (err) {

    console.error(err);

    alert(
      "Session expired"
    );

    logout();

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

  const preview =
    document.getElementById(
      "avatar-preview"
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

  if (preview) {
    preview.src =
      avatarUrl(profile);
  }

}

/* =========================
   SAVE PROFILE
========================= */

async function saveProfile() {

  try {

    const payload = {

      name:
        document
          .getElementById(
            "profile-name"
          )
          .value
          .trim(),

      bio:
        document
          .getElementById(
            "profile-bio"
          )
          .value
          .trim(),

      avatar:
        document
          .getElementById(
            "profile-avatar"
          )
          .value
          .trim()

    };

    await updateProfile(
      payload
    );

    profile = {
      ...profile,
      ...payload
    };

    renderProfile();

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
    profile?.links || [];

  if (!links.length) {

    container.innerHTML =
      "<p>Belum ada link</p>";

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
        onclick="removeLink('${link.id}')">
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
    document
      .getElementById(
        "link-title"
      )
      .value
      .trim();

  const url =
    document
      .getElementById(
        "link-url"
      )
      .value
      .trim();

  if (!title) {
    return alert(
      "Judul wajib diisi"
    );
  }

  if (!url) {
    return alert(
      "URL wajib diisi"
    );
  }

  try {

    await addLink(
      title,
      url
    );

    const res =
      await me();

    profile =
      res.user;

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

  if (
    !confirm(
      "Hapus link ini?"
    )
  ) {
    return;
  }

  try {

    await deleteLink(id);

    const res =
      await me();

    profile =
      res.user;

    renderLinks();

  } catch (err) {

    alert(
      err.message
    );

  }

}

/* =========================
   COPY PROFILE
========================= */

async function copyMyProfile() {

  try {

    await navigator
      .clipboard
      .writeText(
        profileUrl()
      );

    alert(
      "Link profil disalin"
    );

  } catch {

    alert(
      profileUrl()
    );

  }

}

/* =========================
   OPEN PROFILE
========================= */

function openProfile() {

  window.open(
    "/" + getUsername(),
    "_blank"
  );

}
