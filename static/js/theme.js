const themeToggle =
document.getElementById("themeToggle");

if (themeToggle) {

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "dark") {

    document.body.classList.add(
      "dark-mode"
    );

    themeToggle.innerHTML =
      "☀️ Light Mode";
  }

  // themeToggle.addEventListener(
  //   "click",
  //   function () {

  //     document.body.classList.toggle(
  //       "dark-mode"
  //     );

  //     if (
  //       document.body.classList.contains(
  //         "dark-mode"
  //       )
  //     ) {

  //       localStorage.setItem(
  //         "theme",
  //         "dark"
  //       );

  //       themeToggle.innerHTML =
  //         "☀️ Light Mode";

  //     } else {

  //       localStorage.setItem(
  //         "theme",
  //         "light"
  //       );

  //       themeToggle.innerHTML =
  //         "🌙 Dark Mode";
  //     }
  //   }
  // );

  themeToggle.addEventListener(
  "click",
  function () {

    document.body.classList.toggle(
      "dark-mode"
    );

    if (
      document.body.classList.contains(
        "dark-mode"
      )
    ) {

      localStorage.setItem(
        "theme",
        "dark"
      );

      themeToggle.innerHTML =
        "☀️ Light Mode";

    } else {

      localStorage.setItem(
        "theme",
        "light"
      );

      themeToggle.innerHTML =
        "🌙 Dark Mode";
    }

    location.reload();   // ADD THIS

  }
);

}
