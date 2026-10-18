// Lucy Hwang — Art Portfolio interactions (no dependencies)

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();

// Toast
const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

// Full-screen viewer
const viewer = $("#viewer");
const works = $$(".work");
let current = 0;
function show(i) {
  current = (i + works.length) % works.length;
  const w = works[current];
  const img = w.querySelector(".work__img img");
  $("#vImg").src = img.src;
  $("#vImg").alt = img.alt;
  $("#vTitle").textContent = w.querySelector("h2").textContent;
  $("#vMeta").textContent = `· ${w.querySelector(".work__meta").textContent} · ${w.querySelector(".work__year").textContent}`;
}
$$("[data-index]").forEach((el) => {
  if (el.matches(".work")) return;
  el.addEventListener("click", () => {
    show(+el.dataset.index);
    viewer.showModal();
  });
});
$("#vClose").addEventListener("click", () => viewer.close());
$("#vPrev").addEventListener("click", () => show(current - 1));
$("#vNext").addEventListener("click", () => show(current + 1));
viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Nav: underline the section in view
const links = $$(".nav__links a");
function onScroll() {
  let active = links[0];
  for (const a of links) {
    const sec = $(a.getAttribute("href"));
    if (sec && sec.getBoundingClientRect().top < innerHeight * 0.4) active = a;
  }
  links.forEach((a) => a.classList.toggle("is-active", a === active));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Hero collage drifts slightly with the mouse
const tiles = $(".tiles");
if (!calm && matchMedia("(pointer: fine)").matches) {
  $(".hero").addEventListener("mousemove", (e) => {
    const r = tiles.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tiles.style.transform = `translate(${x * -10}px, ${y * -6}px)`;
  });
  $(".hero").addEventListener("mouseleave", () => (tiles.style.transform = ""));
  tiles.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
}

// Copy email
$("#copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); toast("Email copied"); }
  catch { location.href = "mailto:" + email; }
});

// Reveal panels as they scroll in
if (!calm) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.08 });
  $$(".about, .work, .contact").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}
