export async function onRequest(context) {

  const url = new URL(context.request.url);
  const path = url.pathname
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const reserved = [
    "",
    "login",
    "register",
    "dashboard",
    "profile",
    "api",
    "css",
    "js",
    "assets",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml"
  ];

  if (!reserved.includes(path)) {

    return context.env.ASSETS.fetch(
      new Request(
        new URL("/profile.html", url)
      )
    );

  }

  return context.env.ASSETS.fetch(
    context.request
  );

}
