function initPage() {
  handleScroll();
}

function handleScroll() {
  $(window).scroll(function(e) {
    if ($(e.target).scrollTop() <= 120) {
      $("body").removeClass("scrolled");
    } else {
      $("body").addClass("scrolled");
    }
  });
}

$(initPage);
