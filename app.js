const tabs = document.getElementById("character-tabs");
const grid = document.getElementById("card-grid");
const search = document.getElementById("search");
const currentCharacter = document.getElementById("current-character");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const dialog = document.getElementById("card-dialog");
let selectedCharacter = characters[0]?.id || "";

function renderTabs() {
  tabs.innerHTML = "";
  characters.forEach(character => {
    const button = document.createElement("button");
    button.className = "character-tab" + (character.id === selectedCharacter ? " active" : "");
    button.textContent = character.name;
    button.type = "button";
    button.setAttribute("aria-pressed", character.id === selectedCharacter ? "true" : "false");
    button.addEventListener("click", () => {
      selectedCharacter = character.id;
      renderTabs();
      renderCards();
    });
    tabs.appendChild(button);
  });
}

function renderCards() {
  const character = characters.find(item => item.id === selectedCharacter);
  currentCharacter.textContent = character ? character.name : "フレカ一覧";
  const query = search.value.trim().toLocaleLowerCase();
  const visibleCards = cards.filter(card => {
    const matchesCharacter = card.characterId === selectedCharacter;
    const matchesSearch = !query || `${card.name || ""} ${card.note || ""}`.toLocaleLowerCase().includes(query);
    return matchesCharacter && matchesSearch;
  });

  grid.innerHTML = "";
  visibleCards.forEach(card => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card-tile";
    button.setAttribute("aria-label", `${card.name} のフレカを表示`);
    const img = document.createElement("img");
    img.src = card.cardImage;
    img.alt = card.name || "フレカ";
    img.loading = "lazy";
    img.onerror = () => { img.alt = "画像が見つかりません。画像ファイル名を確認してください。"; };
    const caption = document.createElement("div");
    caption.className = "card-caption";
    const title = document.createElement("p");
    title.className = "card-name";
    title.textContent = card.name || "名前未設定";
    const sub = document.createElement("p");
    sub.className = "card-character";
    sub.textContent = character?.name || "";
    caption.append(title, sub);
    button.append(img, caption);
    button.addEventListener("click", () => openCard(card, character));
    grid.appendChild(button);
  });

  resultCount.textContent = `${visibleCards.length} cards`;
  emptyState.hidden = visibleCards.length !== 0;
}

function openCard(card, character) {
  document.getElementById("modal-character").textContent = character?.name || "";
  document.getElementById("modal-title").textContent = card.name || "フレカ";
  const cardImage = document.getElementById("modal-card-image");
  cardImage.src = card.cardImage;
  cardImage.alt = `${card.name} のフレカ画像`;
  const qrFigure = document.getElementById("qr-figure");
  const qrImage = document.getElementById("modal-qr-image");
  if (card.qrImage) {
    qrImage.src = card.qrImage;
    qrFigure.hidden = false;
  } else {
    qrImage.removeAttribute("src");
    qrFigure.hidden = true;
  }
  document.getElementById("modal-note").textContent = card.note || "";
  dialog.showModal();
}

search.addEventListener("input", renderCards);
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
renderTabs();
renderCards();
