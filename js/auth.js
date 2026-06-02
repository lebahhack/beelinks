/* =========================
   AUTH MANAGER
========================= */

const Auth = {

  token() {
    return getToken();
  },

  username() {
    return getUsername();
  },

  loggedIn() {
    return isLoggedIn();
  },

  save(data = {}) {

    if (data.token) {
      setToken(
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

    clearAuth();

  }

};

/* =========================
   AUTH HEADER
========================= */

function authHeaders() {

  const token =
    Auth.token();

  return token
    ? {
        Authorization:
          `Bearer ${token}`
      }
    : {};

}

/* =========================
   CURRENT USER
========================= */

async function currentUser() {

  try {

    const user =
      await me();

    if (
      user?.username
    ) {

      localStorage.setItem(
        "username",
        user.username
      );

    }

    return user;

  } catch (err) {

    console.error(
      err
    );

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

  return await currentUser();

}

/* =========================
   PROFILE URL
========================= */

function myProfileUrl() {

  return profileUrl();

}

/* =========================
   OPEN PROFILE
========================= */

function openMyProfile() {

  window.open(
    myProfileUrl(),
    "_blank"
  );

}

/* =========================
   COPY PROFILE URL
========================= */

async function copyMyProfileUrl() {

  const ok =
    await copyText(
      myProfileUrl()
    );

  if (ok) {

    alert(
      "Link profil berhasil disalin"
    );

  } else {

    alert(
      myProfileUrl()
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

/* =========================
   LOGOUT
========================= */

async function logoutUser() {

  await logout();

}

/* =========================
   GUARD
========================= */

function requireLogin() {

  if (
    !Auth.loggedIn()
  ) {

    location.href =
      "/login.html";

    return false;

  }

  return true;

}

function guestOnlyPage() {

  if (
    Auth.loggedIn()
  ) {

    location.href =
      "/dashboard.html";

    return false;

  }

  return true;

}
