const API_BASE =
"https://api-biolink.lebahhack.workers.dev";

/* =========================
   AUTH HELPERS
========================= */

function getToken() {
  return localStorage.getItem("token") || "";
}

function setToken(token) {
  localStorage.setItem(
    "token",
    token
  );
}

function getUsername() {
  return (
    localStorage.getItem(
      "username"
    ) || ""
  );
}

function removeToken() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "username"
  );

}

function isLoggedIn() {
  return !!getToken();
}

/* =========================
   AVATAR
========================= */

function avatarUrl(
  user
) {

  return (
    user?.avatar ||
    `${API_BASE}/avatar/${
      user?.username || "user"
    }`
  );

}

/* =========================
   PROFILE URL
========================= */

function profileUrl() {

  return (
    location.origin +
    "/" +
    getUsername()
  );

}

/* =========================
   REQUEST
========================= */

async function api(
  path,
  options = {}
) {

  const headers = {
    ...(options.headers || {})
  };

  if (
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  const token =
    getToken();

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response =
    await fetch(
      API_BASE + path,
      {
        ...options,
        headers
      }
    );

  let data;

  try {

    data =
      await response.json();

  } catch {

    data = {
      success: false,
      message:
        "Invalid server response"
    };

  }

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Request failed"
    );

  }

  return data;

}

/* =========================
   AUTH
========================= */

async function register(
  username,
  name,
  password
) {

  return api(
    "/register",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        name,
        password
      })
    }
  );

}

async function login(
  username,
  password
) {

  const data =
    await api(
      "/login",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        })
      }
    );

  if (
    data.success &&
    data.token
  ) {

    localStorage.setItem(
      "username",
      data.username
    );

    setToken(
      data.token
    );

  }

  return data;

}

async function logout() {

  try {

    await api(
      "/logout",
      {
        method: "POST"
      }
    );

  } catch (e) {

    console.error(e);

  }

  removeToken();

  location.href =
    "/login.html";

}

async function me() {
  return api("/me");
}

/* =========================
   PROFILE
========================= */

async function getProfile(
  username
) {

  return api(
    `/${username}`
  );

}

async function updateProfile(
  payload
) {

  return api(
    "/profile/update",
    {
      method: "POST",
      body: JSON.stringify(
        payload
      )
    }
  );

}

/* =========================
   LINKS
========================= */

async function addLink(
  title,
  url
) {

  return api(
    "/links/add",
    {
      method: "POST",
      body: JSON.stringify({
        title,
        url
      })
    }
  );

}

async function updateLink(
  id,
  title,
  url,
  active = true
) {

  return api(
    "/links/update",
    {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        url,
        active
      })
    }
  );

}

async function deleteLink(
  id
) {

  return api(
    "/links/delete",
    {
      method: "POST",
      body: JSON.stringify({
        id
      })
    }
  );

}

/* =========================
   GUARD
========================= */

function requireAuth() {

  if (!isLoggedIn()) {

    location.href =
      "/login.html";

    return false;

  }

  return true;

}

function guestOnly() {

  if (isLoggedIn()) {

    location.href =
      "/dashboard.html";

    return false;

  }

  return true;

}

/* =========================
   UTIL
========================= */

function escapeHtml(
  text
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text || "";

  return div.innerHTML;

}

function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "id-ID"
  ).format(
    value || 0
  );

}

async function copyText(
  text
) {

  try {

    await navigator
      .clipboard
      .writeText(text);

    return true;

  } catch {

    return false;

  }

}

async function copyProfileUrl() {

  const ok =
    await copyText(
      profileUrl()
    );

  if (ok) {

    alert(
      "Link profil berhasil disalin"
    );

  }

}
