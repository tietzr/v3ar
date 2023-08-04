const makeRequest = async (url, method, body) => {
  return await fetch(`${API_BASE_URL}/${url}`, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result => result.json()));
}

// Check if the request result returned 200
// Otherwise set the error message in the given nodeId
const hasError = (result, nodeId) => {
  if (result.status == "error") {
    $(`#${nodeId}`).html(result.message);
    $(`#${nodeId}`).show();

    return true
  }

  return false;
}
const success = (result, nodeId) => {
  if (result.status != "error") {
    $(`#${nodeId}`).html("Successfully registered! Redirecting to Login.");
    $(`#${nodeId}`).show();

    return true
  }

  return false;
}
