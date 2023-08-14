"use strict";

$(document).ready(function () {
  $("#logoutButton").click(logout);
  checkLoggedUser();
  startScrollEvents();
  toggleNavbarMethod();
  $(window).resize(toggleNavbarMethod);
  updateCartCounter();
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

  if (isLoggedUserAdmin()) {
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
  if (cartInfo) {
    return JSON.parse(cartInfo);
  }
  return [];
};

const updateCartCounter = () => {
  const cartInfo = getCartInfo();

  $("#cartCounterBadge").attr("value", cartInfo.length);
};

const shakeCart = () => {
  $("#cartCounterBadge").addClass("cart-badge-animation");

  setTimeout(() => {
    $("#cartCounterBadge").removeClass("cart-badge-animation");
  }, 3000);
};

const toggleNavbarMethod = () => {
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
};

const startScrollEvents = () => {
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
};
