/* =========================
   HTML ESCAPE
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

/* =========================
   NUMBER FORMAT
========================= */

function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "id-ID"
  ).format(
    value || 0
  );

}

/* =========================
   DATE FORMAT
========================= */

function formatDate(
  timestamp
) {

  if (!timestamp) {
    return "-";
  }

  return new Date(
    timestamp
  ).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}

/* =========================
   RELATIVE TIME
========================= */

function timeAgo(
  timestamp
) {

  if (!timestamp) {
    return "";
  }

  const seconds =
    Math.floor(
      (Date.now() - timestamp) /
      1000
    );

  const intervals = [

    ["tahun", 31536000],
    ["bulan", 2592000],
    ["hari", 86400],
    ["jam", 3600],
    ["menit", 60]

  ];

  for (
    const [label, value]
    of intervals
  ) {

    const count =
      Math.floor(
        seconds / value
      );

    if (count >= 1) {

      return `${count} ${label} lalu`;

    }

  }

  return "Baru saja";

}

/* =========================
   COPY TEXT
========================= */

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

/* =========================
   DEBOUNCE
========================= */

function debounce(
  fn,
  delay = 300
) {

  let timer;

  return function (
    ...args
  ) {

    clearTimeout(
      timer
    );

    timer =
      setTimeout(
        () =>
          fn.apply(
            this,
            args
          ),
        delay
      );

  };

}

/* =========================
   USERNAME CLEANER
========================= */

function cleanUsername(
  username
) {

  return String(
    username || ""
  )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9_]/g,
      ""
    );

}

/* =========================
   URL VALIDATOR
========================= */

function isValidUrl(
  url
) {

  try {

    new URL(url);

    return true;

  } catch {

    return false;

  }

}

/* =========================
   RANDOM ID
========================= */

function randomId(
  length = 8
) {

  return Math.random()
    .toString(36)
    .substring(
      2,
      2 + length
    );

}

/* =========================
   QUERY PARAM
========================= */

function getParam(
  name
) {

  return new URLSearchParams(
    location.search
  ).get(name);

}

/* =========================
   TOAST
========================= */

function toast(
  message
) {

  alert(message);

}
