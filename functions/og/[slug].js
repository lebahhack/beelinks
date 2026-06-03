export async function onRequest(context) {

  try {

    const slug =
      context.params.slug
        ?.toLowerCase()
        ?.trim();

    if (!slug) {

      return new Response(
        "Invalid username",
        {
          status: 400
        }
      );

    }

    const response =
      await fetch(
        `https://api-biolink.lebahhack.workers.dev/${slug}`
      );

    if (!response.ok) {

      return new Response(
        "Profile not found",
        {
          status: 404
        }
      );

    }

    const profile =
      await response.json();

    const title =
      profile.name ||
      profile.username;

    const bio =
      profile.bio ||
      "BeeLinks";

    const avatar =
      profile.avatar ||
      `https://api-biolink.lebahhack.workers.dev/avatar/${profile.username}`;

    const theme =
      profile.theme ||
      "default";

    const themes = {

      default:
        ["#f59e0b", "#111827"],

      dark:
        ["#111827", "#000000"],

      neon:
        ["#22c55e", "#111827"],

      pink:
        ["#ec4899", "#111827"],

      blue:
        ["#06b6d4", "#0f172a"]

    };

    const [
      color1,
      color2
    ] =
      themes[theme] ||
      themes.default;

    const svg = `
<svg
xmlns="http://www.w3.org/2000/svg"
width="1200"
height="630"
viewBox="0 0 1200 630">

<defs>

<linearGradient
id="bg"
x1="0"
y1="0"
x2="1"
y2="1">

<stop
offset="0%"
stop-color="${color1}"/>

<stop
offset="100%"
stop-color="${color2}"/>

</linearGradient>

<filter id="blur">
<feGaussianBlur stdDeviation="80"/>
</filter>

</defs>

<rect
width="1200"
height="630"
fill="url(#bg)"/>

<circle
cx="1000"
cy="100"
r="250"
fill="#ffffff"
opacity="0.08"
filter="url(#blur)"/>

<circle
cx="180"
cy="560"
r="200"
fill="#ffffff"
opacity="0.05"
filter="url(#blur)"/>

<rect
x="60"
y="60"
width="1080"
height="510"
rx="40"
fill="rgba(255,255,255,.06)"
stroke="rgba(255,255,255,.12)"
stroke-width="2"/>

<image
href="${avatar}"
x="80"
y="140"
width="180"
height="180"
preserveAspectRatio="xMidYMid slice"/>

<text
x="300"
y="200"
fill="#ffffff"
font-size="64"
font-weight="700"
font-family="Arial">

${escapeXML(title)}

</text>

<text
x="300"
y="270"
fill="#e5e7eb"
font-size="32"
font-family="Arial">

@${escapeXML(profile.username)}

</text>

<foreignObject
x="300"
y="320"
width="760"
height="140">

<div
xmlns="http://www.w3.org/1999/xhtml"
style="
color:white;
font-size:34px;
font-family:Arial;
line-height:1.4;
">

${escapeXML(bio)}

</div>

</foreignObject>

<text
x="80"
y="520"
fill="#ffffff"
font-size="36"
font-weight="700"
font-family="Arial">

BeeLinks

</text>

<text
x="1080"
y="520"
text-anchor="end"
fill="#cbd5e1"
font-size="24"
font-family="Arial">

${escapeXML(profile.username)}

</text>

</svg>
`;

    return new Response(
      svg,
      {
        headers: {
          "Content-Type":
            "image/svg+xml",
          "Cache-Control":
            "public,max-age=86400"
        }
      }
    );

  } catch (err) {

    return new Response(
      "OG Error: " +
      err.message,
      {
        status: 500
      }
    );

  }

}

function escapeXML(
  str = ""
) {

  return String(str)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&apos;"
    );

}
