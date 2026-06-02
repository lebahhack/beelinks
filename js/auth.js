/* =========================
   AUTH MANAGER
========================= */

const Auth = {

  token() {
    return localStorage.getItem("token") || "";
  },

  username() {
    return localStorage.getItem("username") || "";
  },

  loggedIn() {
    return !!this.token();
  },

  save(data = {}) {

    if (data.token) {
      localStorage.setItem(
        "token",
        data.token
      );
    }

    if (data.username) {
      localStorage.setItem(
        "username",
        data.username
      );
    }

  },

  clear() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

  }

};

/* =========================
   AUTH HEADER
========================= */

function authHeaders() {

  return {
    Authorization:
      `Bearer ${Auth.token()}`
  };

}

/* =========================
   LOGOUT
========================= */

function logout() {

  Auth.clear();

  location.href =
    "/login.html";

}

/* =========================
   CHECK LOGIN
========================= */

function requireAuth() {

  if (!Auth.loggedIn()) {

    location.href =
      "/login.html";

    return false;

  }

  return true;

}

/* =========================
   GUEST ONLY
========================= */

function guestOnly() {

  if (Auth.loggedIn()) {

    location.href =
      "/dashboard.html";

    return false;

  }

  return true;

}

/* =========================
   CURRENT USER
========================= */

async function currentUser() {

  try {

    const data =
      await api("/me", {
        headers:
          authHeaders()
      });

    return data.user || data;

  } catch (err) {

    console.error(err);

    Auth.clear();

    location.href =
      "/login.html";

    return null;

  }

}

/* =========================
   REFRESH USER
========================= */

async function refreshUser() {

  const user =
    await currentUser();

  if (
    user &&
    user.username
  ) {

    localStorage.setItem(
      "username",
      user.username
    );

  }

  return user;

}

/* =========================
   PROFILE URL
========================= */

function profileUrl() {

  const username =
    Auth.username();

  if (!username) {
    return location.origin;
  }

  return `${location.origin}/@${username}`;

}

/* =========================
   OPEN PROFILE
========================= */

function openProfile() {

  window.open(
    profileUrl(),
    "_blank"
  );

}

/* =========================
   COPY PROFILE URL
========================= */

async function copyProfileUrl() {

  try {

    await navigator
      .clipboard
      .writeText(
        profileUrl()
      );

    alert(
      "Link profil berhasil disalin"
    );

  } catch {

    alert(
      "Gagal menyalin link"
    );

  }

}

/* =========================
   LOGIN PAGE HELPER
========================= */

async function handleLogin(
  username,
  password
) {

  const data =
    await login(
      username,
      password
    );

  Auth.save({
    token:
      data.token,
    username:
      data.username
  });

  return data;

}

/* =========================
   REGISTER PAGE HELPER
========================= */

async function handleRegister(
  username,
  name,
  password
) {

  return register(
    username,
    name,
    password
  );

}
