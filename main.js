const shortenUrlSpan = document.getElementById("shorten-url-span");
const headline = document.getElementById("headline");
const subline = document.getElementById("subline");
const ring = document.getElementById("ring");
const copyBtn = document.getElementById("copyBtn");
const qrBtn = document.getElementById("qrBtn");

function preecherDados(url) {
  headline.textContent = "Sua URL foi encurtada!";
  subline.textContent =
    "Já está na sua área de transferência e pronta para compartilhar";
  shortenUrlSpan.textContent = url;
  ring.innerHTML = `
  
        <svg class="success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
`;
  copyBtn.style.display = "block";
  copyBtn.onclick = () => {
    copyToClipboard(url);
    playCheckAnimation();
  };
  qrBtn.style.display = "block";
}

function dadosIniciais() {
  headline.textContent = "Encurtando sua URL...";
  subline.textContent = "Em instantes ela estará pronta para compartilhar";
  shortenUrlSpan.textContent = "";
  ring.innerHTML = `
  
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" id="spinner" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
`;
  copyBtn.style.display = "none";
  qrBtn.style.display = "none";
}

function copyToClipboard(text) {
  const input = document.createElement("textarea");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

async function shortenUrl(url) {
  //alert("Shortening URL: " + url);
  const res = await fetch("http://127.0.0.1:8000/api/shorten", {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  const shortUrl = data.shortUrl;

  copyToClipboard(shortUrl);
  //alert("Texto copiado com sucesso!");
  preecherDados(shortUrl);
}

document.addEventListener("DOMContentLoaded", async () => {
  dadosIniciais();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await shortenUrl(tab.url);
});
