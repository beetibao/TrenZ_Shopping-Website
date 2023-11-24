document.addEventListener('DOMContentLoaded', function () {
  var logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
          e.preventDefault(); // Ngăn chặn hành động mặc định của nút
          var logoutConfirm = confirm('Bạn có muốn đăng xuất không?');
          if (logoutConfirm) {
              // Nếu người dùng xác nhận, chuyển hướng đến trang login.html
              window.location.href = 'login.html';
          }
      });
  }
});
