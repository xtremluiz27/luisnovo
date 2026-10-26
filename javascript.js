const filterButtons = document.querySelectorAll('.filter');
const fruitCards = document.querySelectorAll('.fruit-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    fruitCards.forEach((card) => {
      card.hidden = selected !== 'all' && card.dataset.type !== selected;
    });
  });
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  navigation.classList.toggle('open', !expanded);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const fruitCatalog = [
  ['Rocket','Natural','Common'],['Spin','Natural','Common'],['Blade','Natural','Common'],['Spring','Natural','Common'],['Bomb','Natural','Common'],['Smoke','Elemental','Common'],['Spike','Natural','Common'],
  ['Flame','Elemental','Uncommon'],['Ice','Elemental','Uncommon'],['Sand','Elemental','Uncommon'],['Dark','Elemental','Uncommon'],['Eagle','Beast','Uncommon'],['Diamond','Natural','Uncommon'],
  ['Light','Elemental','Rare'],['Rubber','Natural','Rare'],['Ghost','Natural','Rare'],['Magma','Elemental','Rare'],
  ['Quake','Natural','Legendary'],['Buddha','Beast','Legendary'],['Love','Natural','Legendary'],['Creation','Natural','Legendary'],['Spider','Natural','Legendary'],['Sound','Natural','Legendary'],['Phoenix','Beast','Legendary'],['Portal','Natural','Legendary'],['Lightning','Elemental','Legendary'],['Pain','Natural','Legendary'],['Blizzard','Elemental','Legendary'],
  ['Gravity','Natural','Mythical'],['Mammoth','Beast','Mythical'],['T-Rex','Beast','Mythical'],['Dough','Elemental','Mythical'],['Shadow','Natural','Mythical'],['Venom','Natural','Mythical'],['Gas','Elemental','Mythical'],['Spirit','Natural','Mythical'],['Tiger','Beast','Mythical'],['Yeti','Beast','Mythical'],['Magnet','Natural','Mythical'],['Kitsune','Beast','Mythical'],['Control','Natural','Mythical'],['Dragon','Beast','Mythical']
];
const showcaseGrid = document.querySelector('#showcase-grid');
const fruitSearch = document.querySelector('#fruit-search');
const typeLabels = { Natural: 'NATURAL', Elemental: 'ELEMENTAL', Beast: 'BESTIAL' };
const featuredFruitMedia = {
  Dragon: {
    video: 'z-i1pAF6FjE',
    image: 'https://wikiassets.net/bloxfruits-3bec24/images/c17c3878fc62726beca8774a107e2e09.webp',
    description: 'Transformações East e West, ataques de fogo e formas híbridas.'
  },
  Kitsune: {
    video: '92NdP3HNp8A',
    image: 'https://wikiassets.net/bloxfruits-3bec24/images/be07ec067c6f44dd1141b806b0fbf7cd.webp',
    description: 'Fogo azul, mobilidade e transformação inspirada na raposa mítica.'
  },
  Magnet: {
    video: '1tffqhaqxRI',
    image: 'https://wikiassets.net/bloxfruits-3bec24/images/896b3a0f6578535ac56efed826bbe1b1.webp',
    description: 'Controle magnético, coleta de sucata e uma transformação mecânica.'
  }
};

function renderFruitShowcase(query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const visibleFruits = fruitCatalog.filter(([name]) => name.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
  showcaseGrid.innerHTML = visibleFruits.map(([name, type, rarity]) => {
    const search = (move) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} ${move} ability showcase`)}`;
    const moves = ['Z', 'X', 'C', 'V', 'F'].map((key) => `<a href="${search(`${key} move`)}" target="_blank" rel="noopener noreferrer" aria-label="Assistir vídeos da habilidade ${key} de ${name}">${key}</a>`).join('');
    const guide = `https://www.gamersberg.com/blox-fruits/wiki/fruits/${encodeURIComponent(name.toLowerCase().replaceAll(' ', '-'))}`;
    const allMoves = `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} all moves showcase awakened`)}`;
    const imageName = name === 'Blade' ? 'Chop' : name;
    const image = featuredFruitMedia[name]?.image || `https://asset.gamersberg.com/Blox-Fruits/physical/${rarity.toLowerCase()}/${encodeURIComponent(imageName)}.webp`;
    return `<article class="showcase-card"><img class="showcase-fruit-image" src="${image}" alt="Imagem da fruta ${name}" loading="lazy" onerror="this.onerror=null;this.src='https://blox-fruits.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name.replaceAll(' ', '_'))}_Fruit.png';this.onerror=function(){this.onerror=null;this.src='noFilter.webp'}"><div class="showcase-title"><span class="showcase-orb ${type.toLowerCase()}">✦</span><div><span class="fruit-type">${typeLabels[type]} · ${rarity.toUpperCase()}</span><h3>${name}</h3></div></div><p class="move-label">DEMONSTRAÇÃO POR TECLA</p><div class="move-links">${moves}</div><div class="showcase-links"><a href="${guide}" target="_blank" rel="noopener noreferrer">▶ Abrir ficha com showcase</a><a href="${allMoves}" target="_blank" rel="noopener noreferrer">Buscar vídeos por habilidade ↗</a></div></article>`;
  }).join('');
  if (!visibleFruits.length) showcaseGrid.innerHTML = '<p class="no-results">Nenhuma fruta encontrada. Confira a grafia ou tente outro nome.</p>';
}

if (showcaseGrid && fruitSearch) {
  renderFruitShowcase();
  fruitSearch.addEventListener('input', () => renderFruitShowcase(fruitSearch.value));
}

const spotlightButtons = document.querySelectorAll('.spotlight-choice');
const spotlightImage = document.querySelector('#spotlight-image');
const spotlightVideo = document.querySelector('#spotlight-video');
if (spotlightButtons.length && spotlightImage && spotlightVideo) {
  spotlightButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.fruit;
      const media = featuredFruitMedia[name];
      spotlightButtons.forEach((choice) => {
        const active = choice === button;
        choice.classList.toggle('active', active);
        choice.setAttribute('aria-pressed', String(active));
      });
      spotlightImage.src = media.image;
      spotlightImage.alt = `Ícone da ${name} Fruit em Blox Fruits`;
      spotlightVideo.src = `https://www.youtube-nocookie.com/embed/${media.video}`;
      spotlightVideo.title = `Vídeo oficial de showcase da fruta ${name} em Blox Fruits`;
      document.querySelector('#spotlight-name').textContent = name;
      document.querySelector('#spotlight-description').textContent = media.description;
      document.querySelector('#spotlight-watch').href = `https://www.youtube.com/watch?v=${media.video}`;
    });
  });
}
