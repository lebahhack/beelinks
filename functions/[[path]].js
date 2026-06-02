export async function onRequest(context){

  const path =
    context.params.path;

  const reserved = [
    "",
    "login",
    "register",
    "dashboard",
    "assets",
    "css",
    "js"
  ];

  if (
    path &&
    !reserved.includes(path)
  ) {

    return context.env.ASSETS.fetch(
      new Request(
        new URL(
          "/profile.html",
          context.request.url
        )
      )
    );

  }

  return context.next();

}
