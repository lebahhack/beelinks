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

    const data =
      await me();

    return (
      data.user ||
      data
    );

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

  const user =
    await currentUser();

  if (
    user?.username
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

function myProfileUrl() {

  const username =
    Auth.username();

  if (!username) {
    return location.origin;
  }

  return (
    location.origin +
    "/" +
    username
  );

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

  try {

    await navigator
      .clipboard
      .writeText(
        myProfileUrl()
      );

    alert(
      "Link profil berhasil disalin"
    );

  } catch {

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
   LOGOUT BUTTON
========================= */

async function logoutUser() {

  await logout();

}
