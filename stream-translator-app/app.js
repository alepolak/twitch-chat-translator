const settingsToggle = () => {
    var panel = document.getElementsByClassName("settings")[0];
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
}

const messageInput = document.getElementsByClassName("message")[0];
messageInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementsByClassName("send")[0].click();
  }
});