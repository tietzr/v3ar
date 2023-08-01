$(document).ready(function () {
  $("#loginForm").submit(onLoginSubmit);
});

const onLoginSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());

  const result = await makeRequest(`api/user/login`, "POST", jsonData);

  if (!hasError(result, "loginError")){
    window.localStorage.setItem("bookshelf@authentication", JSON.stringify(result));
  }

  return false;
};
