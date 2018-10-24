window.addEventListener("scroll", handleScroll);

function handleScroll(event) {
  const body = document.querySelector("body");

  if (window.scrollY <= 120) {
    body.classList.remove("scrolled");
  } else {
    body.classList.add("scrolled");
  }
}
