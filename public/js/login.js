$(document).ready(function () {
  $("#loginForm").submit(onLoginSubmit);
  $("#registerForm").submit(onRegisterSubmit);
});

const onLoginSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());

  const result = await makeRequest(`api/user/login`, "POST", jsonData);

  if (!hasError(result, "loginError")){
    // If credential match then save to local storage
    window.localStorage.setItem("bookshelf@authentication", JSON.stringify(result));    
    window.location.href = '/pages/shop';
  }  
  return false;
};

const onRegisterSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());

  const result = await makeRequest(`api/user/register`, "POST", jsonData);
  if (!hasError(result, "registerError")){
    // If successfully registered then take to login form
    if(success(result, "registerSuccess")){
      setTimeout(() => {
        window.location.href = '/pages/login';
      }, 2000);
    }     
  }
  return false;
}
