export async function onRequest(context) {

  const url = new URL(context.request.url);
  const path = url.pathname.replace(/^\/+/, "");

  // proxy redirect link ke worker
  if (
  url.pathname.startsWith("/r/")
) {

  const response = await fetch(
    "https://api-biolink.lebahhack.workers.dev" +
    url.pathname,
    {
      redirect: "manual"
    }
  );

  return response;

}

  // biarkan file statis lewat
  if (
    path.includes(".") ||
    path.startsWith("css/") ||
    path.startsWith("js/") ||
    path.startsWith("assets/")
  ) {
    return context.env.ASSETS.fetch(
      context.request
    );
  }

  const reserved = [
    "",
    "login",
    "register",
    "dashboard",
    "profile"
  ];

  // username profile
  if (
    path &&
    !reserved.includes(path)
  ) {

    return context.env.ASSETS.fetch(
      new Request(
        new URL(
          "/profile.html",
          url
        )
      )
    );

  }

  return context.env.ASSETS.fetch(
    context.request
  );

}
