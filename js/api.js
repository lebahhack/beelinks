const API_BASE =
"https://api-biolink.lebahhack.workers.dev";

/* =========================
   TOKEN
========================= */

function getToken() {
  return localStorage.getItem("token") || "";
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

function isLoggedIn() {
  return !!getToken();
}

/* =========================
   REQUEST
========================= */

async function api(path, options = {}) {

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      success: false,
      message: "Invalid server response"
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

  return api("/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      name,
      password
    })
  });

}

async function login(
  username,
  password
) {

  const data = await api(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

async function logout() {

  try {

    await api("/logout", {
      method: "POST"
    });

  } catch (err) {
    console.error(err);
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
    `/profile/${username}`
  );

}

async function updateProfile(
  payload
) {

  return api(
    "/profile/update",
    {
      method: "POST",
      body: JSON.stringify(payload)
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
    "/link/add",
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
  url
) {

  return api(
    "/link/update",
    {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        url
      })
    }
  );

}

async function deleteLink(
  id
) {

  return api(
    "/link/delete",
    {
      method: "POST",
      body: JSON.stringify({
        id
      })
    }
  );

}

/* =========================
   ANALYTICS
========================= */

async function getStats(
  username
) {

  return api(
    `/stats/${username}`
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

/* =========================
   UTIL
========================= */

function escapeHtml(text) {

  const div =
  document.createElement("div");

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
