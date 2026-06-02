/* =========================
   AUTH MANAGER
========================= */

const Auth = {

  token() {
    return localStorage.getItem("token");
  },

  username() {
    return localStorage.getItem("username");
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
   LOGOUT
========================= */

async function logout() {

  try {

    await fetch(
      "https://api-biolink.lebahhack.workers.dev/logout",
      {
        method: "POST",
        headers: {
          Authorization:
          `Bearer ${Auth.token()}`
        }
      }
    );

  } catch (e) {

    console.error(e);

  }

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

    const res = await fetch(
      "https://api-biolink.lebahhack.workers.dev/me",
      {
        headers: {
          Authorization:
          `Bearer ${Auth.token()}`
        }
      }
    );

    if (!res.ok) {

      throw new Error();

    }

    return await res.json();

  } catch {

    Auth.clear();

    location.href =
    "/login.html";

    return null;

  }

}

/* =========================
   PROFILE URL
========================= */

function profileUrl() {

  const username =
  Auth.username();

  return `${location.origin}/${username}`;

}

/* =========================
   COPY PROFILE URL
========================= */

async function copyProfileUrl() {

  const url =
  profileUrl();

  await navigator.clipboard.writeText(
    url
  );

  alert(
    "Link profil berhasil disalin"
  );

}
