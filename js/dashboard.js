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

    profile = await me();

    console.log(
      "PROFILE:",
      profile
    );

    if (!profile) {
      throw new Error(
        "Profile tidak ditemukan"
      );
    }

    renderProfile();
    renderLinks();

  } catch (err) {

    console.error(err);

    alert(
      err.message ||
      "Gagal memuat dashboard"
    );

  }

}

/* =========================
   PROFILE
========================= */

function renderProfile() {

  if (!profile) {
    return;
  }

  // form

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

   const theme =
  document.getElementById(
    "profile-theme"
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

   if (theme) {
  theme.value =
    profile.theme || "default";
}
  // sidebar

  const avatarPreview =
    document.getElementById(
      "avatar-preview"
    );

  const namePreview =
    document.getElementById(
      "profile-name-preview"
    );

  const usernamePreview =
    document.getElementById(
      "sidebar-username"
    );

  const totalLinks =
    document.getElementById(
      "total-links"
    );

  if (avatarPreview) {

    avatarPreview.src =
      profile.avatar ||
      `${API_BASE}/avatar/${profile.username}`;

  }

  if (namePreview) {

    namePreview.textContent =
      profile.name ||
      profile.username;

  }

  if (usernamePreview) {

    usernamePreview.textContent =
      "@" +
      profile.username;

  }

  if (totalLinks) {

    totalLinks.textContent =
      (
        profile.links || []
      ).length;

  }

}

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
     theme:
        document
    .getElementById(
      "profile-theme"
    )
    .value
     
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
      err.message ||
      "Gagal menyimpan profil"
    );

  }

}

/* =========================
   LINKS
========================= */

function renderLinks() {

  const container =
    document.getElementById(
      "links-list"
    );

  if (!container) {
    return;
  }

  const links =
    profile?.links || [];

  container.innerHTML = "";

  const totalLinks =
    document.getElementById(
      "total-links"
    );

  if (totalLinks) {

    totalLinks.textContent =
      links.length;

  }

  if (!links.length) {

    container.innerHTML = `
      <p>Belum ada link</p>
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
    class="btn btn-secondary"
    onclick="editLink('${link.id}')">

    Edit

  </button>

  <button
    class="btn btn-danger"
    onclick="removeLink('${link.id}')">

    Hapus

  </button>
    `;

    container.appendChild(
      item
    );

  });

}

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

    await addLink(
      title,
      url
    );

    // reload profile dari server
    profile =
      await me();

    renderProfile();
    renderLinks();

    document.getElementById(
      "link-title"
    ).value = "";

    document.getElementById(
      "link-url"
    ).value = "";

  } catch (err) {

    console.error(err);

    alert(
      err.message ||
      "Gagal menambah link"
    );

  }

}

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

    profile =
      await me();

    renderProfile();
    renderLinks();

  } catch (err) {

    alert(
      err.message ||
      "Gagal menghapus link"
    );

  }

}





async function editLink(id) {

  const link =
    profile.links.find(
      item => item.id === id
    );

  if (!link) return;

  const title =
    prompt(
      "Judul Link",
      link.title
    );

  if (title === null) {
    return;
  }

  const url =
    prompt(
      "URL Link",
      link.url
    );

  if (url === null) {
    return;
  }

  try {

    await updateLink(
      id,
      title,
      url,
      true
    );

    profile =
      await me();

    renderLinks();

  } catch (err) {

    alert(
      err.message ||
      "Gagal update link"
    );

  }

}

/* =========================
   PROFILE URL
========================= */

async function copyMyProfile() {

  const url =
    profileUrl();

  try {

    await navigator
      .clipboard
      .writeText(url);

    alert(
      "Link profil disalin"
    );

  } catch {

    prompt(
      "Salin link profil:",
      url
    );

  }

}

function openProfile() {

  window.open(
    profileUrl(),
    "_blank"
  );

}
