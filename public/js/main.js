(function ($) {
  "use strict";

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);

    checkLoggedUser();
    updateCartCounter();
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Vendor carousel
  $(".vendor-carousel").owlCarousel({
    loop: true,
    margin: 29,
    nav: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 2,
      },
      576: {
        items: 3,
      },
      768: {
        items: 4,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    },
  });

  // Related carousel
  $(".related-carousel").owlCarousel({
    loop: true,
    margin: 29,
    nav: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
    },
  });

})(jQuery);

$(document).ready(function () {
  $("#logoutButton").click(logout);
  checkLoggedUser();
});

const checkLoggedUser = () => {
  let userInfo = window.localStorage.getItem("bookshelf@authentication");

  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    const name = userInfo.name?.split(" ").shift() || "";
    $("#userNameHeader").html(`Welcome ${name || ""}`);
    $("#loggedUserArea").show();
    $("#userLoginArea").hide();
  } else {
    $("#loggedUserArea").hide();
    $("#userLoginArea").show();
  }

  if (isLoggedUserAdmin()){
    $("#adminMenu").show();
  } else {
    $("#adminMenu").hide();
  }
};

const logout = () => {
  window.localStorage.removeItem("bookshelf@authentication");

  location.reload();
};

const getCartInfo = () => {
  let cartInfo = window.localStorage.getItem("bookshelf@cart");  
  if (cartInfo){
    return JSON.parse(cartInfo);
  }
  return [];
}

const updateCartCounter = () => {
  const cartInfo = getCartInfo();

  $("#cartInfoLabel").html(cartInfo.length);
};