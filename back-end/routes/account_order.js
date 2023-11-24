document.addEventListener('DOMContentLoaded', function () {
  var logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
          e.preventDefault();
          var logoutConfirm = confirm('Bạn có muốn đăng xuất không?');
          if (logoutConfirm) {
              window.location.href = 'login.html';
          }
      });
  }
});
