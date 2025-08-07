document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("auth-section");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    authSection.innerHTML = `
      <div class="user-dropdown">
        <span class="user-greeting" id="user-toggle"><strong>${user.name}</strong></span>
        <div class="dropdown-menu" id="dropdown-menu" style="display: none;">
          <button id="logout-btn" class="auth-link">Đăng xuất</button>
        </div>
      </div>
    `;

    const toggle = document.getElementById("user-toggle");
    const menu = document.getElementById("dropdown-menu");
    const logoutBtn = document.getElementById("logout-btn");

    toggle.addEventListener("click", () => {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.reload();
    });
  } else {
    authSection.innerHTML = `
      <a href="login.html" class="auth-link">Đăng nhập</a>
      <a href="register.html" class="auth-link">Đăng ký</a>
    `;
  }
});
