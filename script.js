const sidebar = document.getElementById("sidebar");
const searchInput = document.getElementById("search");
const previewFrame = document.getElementById("preview-frame");

const htmlCode = document.getElementById("html-code");
const cssCode = document.getElementById("css-code");
const jsCode = document.getElementById("js-code");

function loadComponent(cat, comp) {
  const { html, css, js } = comp;

  Promise.all([
    fetch(html).then(res => res.text()),
    fetch(css).then(res => res.text()),
    js ? fetch(js).then(res => res.text()) : Promise.resolve("")
  ]).then(([htmlText, cssText, jsText]) => {
    htmlCode.value = htmlText;
    cssCode.value = cssText;
    jsCode.value = jsText;

// Update tabs and preview
document.querySelector("[data-tab='js']").style.display = js ? "inline-block" : "none";
document.querySelector(".js-tab").style.display = js ? "block" : "none";

// Reset all tabs to hidden except HTML by default
document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
document.querySelector(".html-tab").style.display = "block";

document.querySelectorAll(".tabs button").forEach(tab => tab.classList.remove("active"));
document.querySelector("[data-tab='html']").classList.add("active");

updatePreview();

  });
}

function updatePreview() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}</script>`;

  const content = `${css}${html}${js}`;
  const frame = previewFrame.contentWindow.document;
  frame.open();
  frame.write(content);
  frame.close();
}

function renderSidebar() {
  sidebar.innerHTML = "";

  Object.entries(components).forEach(([category, comps], index) => {
    // Create category header
    const section = document.createElement("div");
    section.className = "sidebar-section";

    const header = document.createElement("div");
    header.className = "sidebar-header";
    header.textContent = category[0].toUpperCase() + category.slice(1);
    header.dataset.index = index;

    const list = document.createElement("ul");
    list.className = "component-list";
    list.style.display = "none";

    comps.forEach(comp => {
      const li = document.createElement("li");
      li.textContent = comp.name;
      li.onclick = () => loadComponent(category, comp);
      list.appendChild(li);
    });

    section.appendChild(header);
    section.appendChild(list);
    sidebar.appendChild(section);
  });

  // Add dropdown toggle logic
  const headers = document.querySelectorAll(".sidebar-header");
  headers.forEach(h => {
    h.onclick = () => {
      document.querySelectorAll(".component-list").forEach(list => list.style.display = "none");
      document.querySelectorAll(".sidebar-header").forEach(head => head.classList.remove("open"));

      const list = h.nextElementSibling;
      list.style.display = "block";
      h.classList.add("open");
    };
  });
}


function setupTabs() {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");

      btn.classList.add("active");
      document.querySelector(`.${btn.dataset.tab}-tab`).style.display = "block";
    };
  });
}

function setupCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.copy;
      const textarea = document.getElementById(`${type}-code`);
      navigator.clipboard.writeText(textarea.value);
    };
  });
}

function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  btn.onclick = () => {
    document.body.classList.toggle("light");
    btn.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
  };
}

function setupSearch() {
  searchInput.oninput = () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".component-list").forEach(list => {
      let hasMatch = false;

      list.querySelectorAll("li").forEach(li => {
        const original = li.textContent;
        const name = original.toLowerCase();

        // If query is empty, show all and remove highlight
        if (!query) {
          li.style.display = "block";
          li.innerHTML = original;
          hasMatch = true;
          return;
        }

        if (name.includes(query)) {
          li.style.display = "block";

          // Highlight match
          const regex = new RegExp(`(${query})`, "gi");
          li.innerHTML = original.replace(regex, `<span class="highlight">$1</span>`);
          hasMatch = true;
        } else {
          li.style.display = "none";
          li.innerHTML = original;
        }
      });

      // Section show/hide
      const header = list.previousElementSibling;
      if (hasMatch) {
        list.style.display = "block";
        header.classList.add("open");
      } else {
        list.style.display = "none";
        header.classList.remove("open");
      }
    });
  };
}


window.onload = () => {
  renderSidebar();
  setupTabs();
  setupCopyButtons();
  setupThemeToggle();
  setupSearch();

  htmlCode.addEventListener("input", updatePreview);
  cssCode.addEventListener("input", updatePreview);
  jsCode.addEventListener("input", updatePreview);

  const sidebarEl = document.querySelector("aside");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  // Hamburger toggle
  document.getElementById("sidebar-toggle").addEventListener("click", () => {
    sidebarEl.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  // Overlay click closes sidebar
  overlay.addEventListener("click", () => {
    sidebarEl.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Mobile search auto open sidebar
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    if (window.innerWidth <= 768 && searchInput.value.trim() !== "") {
      sidebarEl.classList.add("open");
      overlay.classList.add("show");
    }
    if (searchInput.value.trim() === "") {
      sidebarEl.classList.remove("open");
      overlay.classList.remove("show");
    }
  });
};

