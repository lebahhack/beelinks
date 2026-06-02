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

```
profile =
  await currentUser();

renderProfile();

renderLinks();
```

} catch (err) {

```
console.error(err);
```

}

}

/* =========================
PROFILE
========================= */

function renderProfile() {

if (!profile) {
return;
}

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

async function saveProfile() {

try {

```
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

alert(
  "Profil berhasil disimpan"
);
```

} catch (err) {

```
alert(
  err.message ||
  "Gagal menyimpan profil"
);
```

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

if (!links.length) {

```
container.innerHTML = `
  <p>
    Belum ada link
  </p>
`;

return;
```

}

links.forEach(link => {

```
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
    class="btn btn-danger"
    onclick="removeLink('${link.id}')">

    Hapus

  </button>
`;

container.appendChild(
  item
);
```

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

```
alert(
  "Judul wajib diisi"
);

return;
```

}

if (!url) {

```
alert(
  "URL wajib diisi"
);

return;
```

}

try {

```
const result =
  await addLink(
    title,
    url
  );

if (
  result.links
) {
  profile.links =
    result.links;
} else {

  profile.links.push({

    id:
      crypto.randomUUID(),

    title,

    url

  });

}

renderLinks();

document.getElementById(
  "link-title"
).value = "";

document.getElementById(
  "link-url"
).value = "";
```

} catch (err) {

```
alert(
  err.message ||
  "Gagal menambah link"
);
```

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

```
const result =
  await deleteLink(id);

if (
  result.links
) {

  profile.links =
    result.links;

} else {

  profile.links =
    profile.links.filter(
      link =>
        link.id !== id
    );

}

renderLinks();
```

} catch (err) {

```
alert(
  err.message ||
  "Gagal menghapus link"
);
```

}

}

/* =========================
PROFILE URL
========================= */

async function copyMyProfile() {

const url =
profileUrl();

try {

```
await navigator
  .clipboard
  .writeText(
    url
  );

alert(
  "Link profil disalin"
);
```

} catch {

```
prompt(
  "Salin link profil:",
  url
);
```

}

}

function openProfile() {

window.open(
profileUrl(),
"_blank"
);

}
