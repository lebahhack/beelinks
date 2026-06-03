document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const header =
      document.getElementById(
        "site-header"
      );

    const footer =
      document.getElementById(
        "site-footer"
      );

    if (header) {

      header.innerHTML =
        await fetch(
          "/components/header.html"
        ).then(
          r => r.text()
        );

    }

    if (footer) {

      footer.innerHTML =
        await fetch(
          "/components/footer.html"
        ).then(
          r => r.text()
        );

    }

  }
);
