const form = document.querySelector("#form");
const inputs = document.querySelectorAll(".form-control");

form.addEventListener("submit", (event) => {
  let isNull = Array.from(inputs).some((input) => input.value === "");
  if (isNull) {
    event.preventDefault();
    alert("不可空白!");
    return;
  }
});
