// Change information
var modalInfo = document.getElementById("changeInfo");
var changeBtn = document.getElementById("changeBtn");
var closeBtn = document.getElementsByClassName("closeBtn")[0];
changeBtn.onclick = function() {
  modalInfo.style.display = "block";
}
closeBtn.onclick = function() {
  modalInfo.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modalInfo) {
    modalInfo.style.display = "none";
  }
}
// Change transport company
var transInfo = document.getElementById("changeTrans");
var changeTransBtn = document.getElementById("changeTransBtn");
var closeTransBtn = document.getElementsByClassName("closeTransBtn")[0];
changeTransBtn.onclick = function() {
  transInfo.style.display = "block";
}
closeTransBtn.onclick = function() {
  transInfo.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == transInfo) {
    transInfo.style.display = "none";
  }
}