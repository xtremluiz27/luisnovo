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

const topbar = document.querySelector('.topbar');
let previousScrollY = window.scrollY;
let scrollDirection = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const difference = currentScrollY - previousScrollY;
  if (Math.abs(difference) >= 8) {
    const nextDirection = difference > 0 ? 1 : -1;
    if (nextDirection !== scrollDirection) scrollDirection = nextDirection;
    if (currentScrollY < 90 || (nextDirection < 0) || navigation.classList.contains('open')) {
      topbar.classList.remove('topbar-hidden');
    } else {
      topbar.classList.add('topbar-hidden');
    }
    previousScrollY = currentScrollY;
  }
}, { passive: true });

document.querySelector('#year').textContent = new Date().getFullYear();

const fruitCatalog = [
  ['Rocket','Natural','Common'],['Spin','Natural','Common'],['Blade','Natural','Common'],['Spring','Natural','Common'],['Bomb','Natural','Common'],['Smoke','Elemental','Common'],['Spike','Natural','Common'],
  ['Flame','Elemental','Uncommon'],['Ice','Elemental','Uncommon'],['Sand','Elemental','Uncommon'],['Dark','Elemental','Uncommon'],['Eagle','Beast','Uncommon'],['Diamond','Natural','Uncommon'],
  ['Light','Elemental','Rare'],['Rubber','Natural','Rare'],['Ghost','Natural','Rare'],['Magma','Elemental','Rare'],
  ['Quake','Natural','Legendary'],['Buddha','Beast','Legendary'],['Love','Natural','Legendary'],['Creation','Natural','Legendary'],['Spider','Natural','Legendary'],['Sound','Natural','Legendary'],['Phoenix','Beast','Legendary'],['Portal','Natural','Legendary'],['Lightning','Elemental','Legendary'],['Pain','Natural','Legendary'],['Blizzard','Elemental','Legendary'],
  ['Gravity','Natural','Mythical'],['Mammoth','Beast','Mythical'],['T-Rex','Beast','Mythical'],['Dough','Elemental','Mythical'],['Shadow','Natural','Mythical'],['Venom','Natural','Mythical'],['Gas','Elemental','Mythical'],['Spirit','Natural','Mythical'],['Tiger','Beast','Mythical'],['Yeti','Beast','Mythical'],['Magnet','Natural','Mythical'],['Kitsune','Beast','Mythical'],['Control','Natural','Mythical'],['Dragon','Beast','Mythical']
];
// Preços de compra no dealer e de frutas permanentes; o último valor é o custo total do despertar.
const fruitShopInfo = {
  Rocket:[5000,50], Spin:[7500,75], Blade:[30000,100], Spring:[60000,180], Bomb:[80000,220], Smoke:[100000,250], Spike:[180000,380],
  Flame:[250000,550,14500], Ice:[350000,750,14500], Sand:[420000,850,14500], Dark:[500000,950,14500], Eagle:[550000,975], Diamond:[600000,1000],
  Light:[650000,1100,14500], Rubber:[750000,1200], Ghost:[940000,1275], Magma:[960000,1300,14500],
  Quake:[1000000,1500,17000], Buddha:[1200000,1650,14500], Love:[1300000,1700], Creation:[1400000,1750], Spider:[1500000,1800,17300], Sound:[1700000,1900], Phoenix:[1800000,2000,18500], Portal:[1900000,2000], Lightning:[2100000,2100,14500], Pain:[2300000,2200], Blizzard:[2400000,2250],
  Gravity:[2500000,2300], Mammoth:[2700000,2350], 'T-Rex':[2700000,2350], Dough:[2800000,2400,18500], Shadow:[2900000,2425], Venom:[3000000,2450], Gas:[3200000,2500], Spirit:[3400000,2550], Tiger:[5000000,3000], Yeti:[5000000,3000], Magnet:[6000000,3500], Kitsune:[8000000,4000], Control:[9000000,4000], Dragon:[15000000,5000]
};
const showcaseGrid = document.querySelector('#showcase-grid');
const fruitSearch = document.querySelector('#fruit-search');
const typeLabels = { Natural: 'NATURAL', Elemental: 'ELEMENTAL', Beast: 'BESTIAL' };
// Explicações por fruta, na ordem Z, X, C, V e F. “—” indica tecla sem movimento.
const abilityNotes = {
  Rocket:['Dispara um projétil explosivo.','Lança vários foguetes em sequência.','Avança como um foguete e explode no impacto.','Dispara uma salva de projéteis.','Impulsiona o usuário pelo ar.'],
  Spin:['Lança lâminas de vento.','Gira no ar e atinge inimigos próximos.','Cria um tornado que avança.','Lança bombas giratórias.','Voa girando.'],
  Blade:['Projeta cortes à distância.','Avança com um corte que interrompe o alvo.','Executa cortes em sequência e em área.','Amplia o alcance dos golpes de lâmina.','Avança rapidamente com um corte.'],
  Spring:['Estica o braço e golpeia o alvo.','Salta e causa impacto ao pousar.','Avança com um golpe usando as pernas elásticas.','Impulsiona o usuário para cima.','Salta para se deslocar.'],
  Bomb:['Arremessa uma bomba que explode no impacto.','Lança uma bomba maior com explosão em área.','Dispara bombas ao redor do usuário.','Detona uma explosão concentrada.'],
  Smoke:['Dispara fumaça em linha reta.','Cria uma explosão de fumaça em área.','Avança em forma de fumaça e atinge inimigos.','','Voa em uma nuvem de fumaça.'],
  Spike:['Dispara espinhos pelo chão.','Faz espinhos surgirem ao redor do usuário.','Projeta uma sequência de espinhos.'],
  Flame:['Lança uma bola de fogo explosiva.','Dispara projéteis flamejantes em sequência.','Ergue uma coluna de fogo.','Cria uma explosão de chamas em área.','Voa envolto em fogo.'],
  Ice:['Dispara uma lança que congela o alvo.','Cria estalagmites de gelo à frente.','Congela o chão e atinge a área próxima.','Invoca uma tempestade de gelo.','Desliza sobre o gelo.'],
  Sand:['Lança areia que prende o alvo.','Cria uma onda de areia pelo chão.','Prende o inimigo em areia movediça.','Ergue uma tempestade de areia.','Voa em um redemoinho de areia.'],
  Dark:['Dispara uma esfera escura.','Cria gravidade que atrai inimigos.','Prende o alvo em uma prisão escura.','Puxa inimigos para uma explosão sombria.'],
  Eagle:['Dispara penas contra o alvo.','Avança com um golpe de asas.','Ataca inimigos em uma área.','','Voa usando as asas.'],
  Diamond:['Avança com um soco reforçado.','Cria espinhos no chão.','Gira e atinge inimigos próximos.','Reveste o corpo para aumentar a resistência.'],
  Light:['Dispara um feixe perfurante.','Atira flechas de luz em uma área.','Invoca uma espada e corta inimigos próximos.','Faz cair raios de luz sobre o local.','Voa em alta velocidade como um feixe.'],
  Rubber:['Estica o braço e desfere um soco.','Dispara uma sequência de golpes elásticos.','Gira os braços e atinge a área próxima.','Amplia o corpo e golpeia uma área extensa.'],
  Ghost:['Invoca um espírito perseguidor.','Lança uma onda espectral.','Cria uma explosão fantasmagórica.','Invoca espíritos para atacar a área.','Levanta voo e se desloca.'],
  Magma:['Lança magma que deixa lava no impacto.','Cria um vulcão que lança rochas.','Dispara uma onda de magma pelo chão.','Invoca uma chuva de meteoros.','Desliza sobre a lava.'],
  Quake:['Dispara uma onda sísmica.','Abre uma fissura que avança pelo chão.','Cria uma esfera de choque em área.','Provoca um terremoto ao redor.'],
  Buddha:['Aumenta muito o tamanho e alcance dos ataques.','Salta e causa impacto ao pousar.','Emite uma onda de choque próxima.','Transforma o corpo em uma forma dourada resistente.'],
  Love:['Arremessa um coração que prende o alvo.','Avança montado em um coração.','Cria uma área de corações que atinge inimigos.','Faz cair corações sobre o local.','Voa em um coração como montaria.'],
  Creation:['Cria uma plataforma ou estrutura.','Invoca uma construção que avança.','Ergue estruturas para bloquear ou controlar área.','Faz construções caírem sobre o local.'],
  Spider:['Dispara fios que prendem o alvo.','Lança uma teia em linha reta.','Cria fios ao redor do usuário.','Dispara uma grande teia em área.'],
  Sound:['Dispara uma nota sonora.','Cria ondas sonoras ao redor do alvo.','Lança notas que explodem no impacto.','Gera uma onda sonora ampla.','Voa em uma prancha sonora.'],
  Phoenix:['Dispara fogo azul.','Avança em forma de ave.','Explode em fogo azul ao redor.','Transforma-se em fênix, mudando ataques e habilitando cura.','Voa transformado; a forma permite curar aliados.'],
  Portal:['Abre um portal para a posição marcada.','Cria portais que puxam ou transportam alvos.','Ataca e se desloca dentro da dimensão.','Viaja entre locais liberados.','Teleporta para um jogador ou ponto disponível.'],
  Lightning:['Lança um raio em linha reta.','Cria uma tempestade elétrica.','Avança como relâmpago contra inimigos.','Invoca uma descarga elétrica ampla.','Voa como um raio.'],
  Pain:['Dispara uma onda de choque concentrada.','Projeta uma explosão de pressão.','Atinge o alvo com uma descarga de dor.','Libera uma onda ampla que repele inimigos.'],
  Blizzard:['Dispara uma rajada congelante.','Cria um tornado de neve que avança.','Invoca uma tempestade ao redor do usuário.','Prende inimigos em uma nevasca.','Voa em um redemoinho de neve.'],
  Gravity:['Arremessa rochas contra os alvos.','Cria uma onda gravitacional pelo chão.','Puxa inimigos para uma área de gravidade.','Invoca meteoros sobre o local.'],
  Mammoth:['Avança e atropela inimigos.','Executa uma investida em área.','Bate no chão e atinge alvos próximos.','Transforma-se em mamute, alterando ataques e resistência.','Corre em investida transformado.'],
  'T-Rex':['Morde o alvo à frente.','Avança mordendo inimigos pelo caminho.','Ruge e atinge a área próxima.','Transforma-se em T-Rex e altera os ataques.','Corre transformado para alcançar alvos.'],
  Dough:['Dispara um punho de massa que prende.','Lança uma rajada de massa pegajosa.','Cria uma onda de massa que avança.','Arremessa uma grande esfera de massa.'],
  Shadow:['Lança uma esfera sombria explosiva.','Projeta uma onda de sombras.','Invoca sombras para atacar em área.','Cria um domínio que drena energia dos alvos.'],
  Venom:['Dispara veneno que deixa uma poça tóxica.','Lança uma rajada venenosa.','Cria uma explosão tóxica.','Invoca uma nuvem que causa dano contínuo.','Voa como dragão venenoso transformado.'],
  Gas:['Dispara gás que contamina a área.','Cria uma nuvem de dano contínuo.','Avança em forma gasosa.','Transforma-se em gás e amplia os ataques.','Desloca-se em forma gasosa.'],
  Spirit:['Invoca um espírito atacante.','Lança uma chama espiritual explosiva.','Invoca espíritos que perseguem inimigos.','Alterna espíritos com efeitos ofensivos ou de suporte.'],
  Tiger:['Avança com um corte veloz.','Ataca em sequência com garras.','Salta sobre o alvo e causa dano em área.','Transforma-se em tigre e amplia mobilidade e ataques.','Corre transformado para perseguir alvos.'],
  Yeti:['Dispara uma bola de neve explosiva.','Avança com um golpe congelante.','Cria uma nevasca ao redor.','Transforma-se em Yeti e altera os ataques.','Corre ou salta em forma de Yeti.'],
  Magnet:['Atrai metal e o arremessa contra alvos.','Cria um campo magnético que agrupa objetos.','Monta estruturas metálicas para atacar.','Transforma-se em forma mecânica magnética.','Desloca-se com impulso magnético.'],
  Kitsune:['Dispara uma chama azul contra o alvo.','Avança em investidas com fogo azul.','Invoca chamas explosivas ao redor.','Transforma-se em raposa e aprimora ataques.','Corre transformado e pode transportar um aliado.'],
  Control:['Cria uma área onde reposiciona alvos.','Corta o espaço dentro da área.','Arremessa objetos e inimigos na área.','Ataca em grande alcance usando a zona.'],
  Dragon:['Dispara uma rajada de fogo.','Avança com um ataque de dragão.','Explode em fogo em uma área.','Transforma-se em dragão; East e West têm ataques distintos.','Voa enquanto transformado.']
};
// Valores de referência publicados em uma comparação comunitária (2024), para
// nível 2800, maestria 600, Aura completa e sem acessórios ou bônus.
const fruitDamageReference = {
  Rocket:{Z:'2.851',X:'3.388',C:'3.835'}, Spin:{Z:'3.030',X:'3.567',C:'4.193'}, Spring:{Z:'2.851',X:'3.298',C:'4.104',V:'5.536'},
  Smoke:{Z:'3.209',X:'6.256',C:'4.820',F:'10 s: 10.600'}, Spike:{Z:'4.104',X:'4.820',C:'4.641',V:'4.641'}, Flame:{Z:'4.820',X:'4.999',C:'5.986',V:'8.493'},
  Ice:{M1:'4 ataques: 8.616',Z:'6.610',X:'3.746',C:'3.209',V:'3.388'}, Sand:{Z:'3.925',X:'3.388',C:'3.388',V:'5.357'}, Dark:{Z:'3.388',X:'3.424',C:'3.522',V:'5.357'},
  Light:{M1:'4 ataques: 11.392',Z:'5.387',X:'5.729',C:'4.104',V:'5.894'}, Rubber:{M1:'4 ataques: 11.404',Z:'4.105',X:'4.641',C:'10.907',F:'4.731'},
  Ghost:{Z:'3.645',X:'4.569',C:'5.092'}, Magma:{Z:'17.517',X:'3.696',C:'4.818',V:'18.442',F:'4.104'}, Quake:{Z:'3.741',X:'3.041',C:'3.497',V:'6.146'},
  Buddha:{M1:'4 saltos: 4.240',Z:'3.746',X:'3.925',C:'7.577',V:'9.619',F:'3.298'}, Love:{M1:'clone: 4.660',Z:'3.177',X:'3.998',C:'3.814',V:'2.629'},
  Spider:{Z:'4.146',X:'3.925',C:'5.238',V:'9.941'}, Sound:{Z:'4.720',X:'3.593',C:'4.984',V:'7.234'},
  Phoenix:{M1:'4 ataques: 7.812',Z:'3.616',X:'10 s: 5.550',C:'3.750',V:'3.416',F:'2.766'},
  Portal:{Z:'3.269',X:'3.090',V:'NPC: 7.685 · jogador: 1.665',F:'12 s: 22.668'},
  Blizzard:{Z:'4.390',X:'4.462',C:'3.388',V:'10.655',F:'10 s: 12.390'},
  Mammoth:{M1:'4 ataques: 8.395',Z:'4.226',X:'4.032',C:'4.417',V:'2.059',F:'10 s: 10.180'},
  'T-Rex':{M1:'4 ataques: 6.425',Z:'3.746',X:'5.654',C:'3.477',V:'2.313',F:'3.746'},
  Dough:{M1:'4 ataques: 9.282',Z:'4.695',X:'4.641',C:'4.820',V:'7.327',F:'10 s: 7.020'},
  Shadow:{Z:'3.425',X:'4.391',C:'4.066',V:'9.917',F:'10 s: 5.710'},
  Venom:{Z:'6.264',X:'8.040',C:'7.682',F:'10 s: 23.130'},
  Spirit:{M1:'9 cogumelos tóxicos: 66.348',Z:'4.104',X:'7.148',C:'3.925',V:'9.475'},
  Kitsune:{M1:'5 ataques: 10.493',Z:'4.046',X:'3.766',C:'6.243',V:'2.851',F:'3.057'},
  Control:{X:'4.462',C:'6.095',V:'7.587'}
};
const fruitTransformationNotes = {
  Eagle:'Forma de águia: muda os ataques e libera voo; a duração e os golpes dependem da energia da forma.',
  Diamond:'Encrust: reveste o corpo com diamante, elevando a defesa e alterando a aparência durante o efeito.',
  Rubber:'Gear 4: transforma o corpo de borracha e modifica os ataques; consome energia enquanto está ativo.',
  Buddha:'Transformação Z. A forma aumenta o tamanho e o alcance dos golpes. A transformação despertada tem outra versão e efeitos próprios.',
  Phoenix:'Forma de fênix: altera os movimentos e libera voo. A forma despertada também tem ataques e recursos de cura próprios.',
  Mammoth:'Transformação V em mamute: altera M1 e os movimentos; a investida de voo depende da forma ativa.',
  'T-Rex':'Transformação V em T-Rex: altera M1 e ataques, e aplica o efeito de marca aos alvos atingidos.',
  Venom:'Forma de dragão venenoso: ativa voo e modifica os ataques enquanto a transformação estiver ativa.',
  Gas:'Transformação em gás: amplia o conjunto de ataques e altera mobilidade e área de efeito.',
  Tiger:'Transformação em tigre: muda os ataques e aumenta a mobilidade durante a forma.',
  Yeti:'Transformação em Yeti: altera os ataques e a movimentação durante a forma.',
  Magnet:'Forma mecânica: transforma o usuário e habilita movimentos magnéticos e ataques com sucata.',
  Kitsune:'Transformação V em raposa: muda M1 e as variantes de Z, X, C e F; a passiva usa o medidor de caudas.',
  Dragon:'Formas híbrida, East e West: cada forma altera M1, Z, X, C e F. A transformação usa o medidor de fúria.'
};
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

renderFruitShowcase = function(query = fruitSearch.value) {
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const selectedType = document.querySelector('#showcase-type-filter')?.value || 'all';
  const selectedRarity = document.querySelector('#showcase-rarity-filter')?.value || 'all';
  const visibleFruits = fruitCatalog.filter(([name, type, rarity]) => name.toLocaleLowerCase('pt-BR').includes(normalizedQuery) && (selectedType === 'all' || type === selectedType) && (selectedRarity === 'all' || rarity === selectedRarity));
  showcaseGrid.innerHTML = visibleFruits.map(([name, type, rarity]) => {
    const search = (move) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} ${move} ability showcase`)}`;
    const notes = abilityNotes[name] || [];
    const keys = ['Z', 'X', 'C', 'V', 'F'];
    const moves = keys.map((key, index) => notes[index] ? `<div class="ability-row"><strong>${key}</strong><span>${notes[index]}</span><a href="${search(`${key} move`)}" target="_blank" rel="noopener noreferrer">Vídeo ↗</a></div>` : '').join('');
    const guide = `https://www.gamersberg.com/blox-fruits/wiki/fruits/${encodeURIComponent(name.toLowerCase().replaceAll(' ', '-'))}`;
    const allMoves = `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} all moves showcase awakened`)}`;
    const imageName = name === 'Blade' ? 'Chop' : name;
    const image = featuredFruitMedia[name]?.image || `https://asset.gamersberg.com/Blox-Fruits/physical/${rarity.toLowerCase()}/${encodeURIComponent(imageName)}.webp`;
    return `<article class="showcase-card"><img class="showcase-fruit-image" src="${image}" alt="Imagem da fruta ${name}" loading="lazy"><div class="showcase-title"><span class="showcase-orb ${type.toLowerCase()}">✦</span><div><span class="fruit-type">${typeLabels[type]} · ${rarity.toUpperCase()}</span><h3>${name}</h3></div></div><p class="move-label">HABILIDADES POR TECLA · Z / X / C / V / F</p><div class="ability-list">${moves}</div><div class="showcase-links"><a href="${guide}" target="_blank" rel="noopener noreferrer">Abrir ficha e showcase ↗</a><a href="${allMoves}" target="_blank" rel="noopener noreferrer">Buscar demonstração de todos os movimentos ↗</a></div></article>`;
  }).join('');
  if (!visibleFruits.length) showcaseGrid.innerHTML = '<p class="no-results">Nenhuma fruta encontrada. Confira a grafia ou tente outro nome.</p>';
};

renderFruitShowcase = function(query = fruitSearch.value) {
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const selectedType = document.querySelector('#showcase-type-filter')?.value || 'all';
  const selectedRarity = document.querySelector('#showcase-rarity-filter')?.value || 'all';
  const visibleFruits = fruitCatalog.filter(([name, type, rarity]) => name.toLocaleLowerCase('pt-BR').includes(normalizedQuery) && (selectedType === 'all' || type === selectedType) && (selectedRarity === 'all' || rarity === selectedRarity));
  const rarityLabels = { Common: 'COMUM', Uncommon: 'INCOMUM', Rare: 'RARO', Legendary: 'LENDARIO', Mythical: 'MITICO' };
  showcaseGrid.innerHTML = visibleFruits.map(([name, type, rarity]) => {
    const search = (move) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} ${move} ability showcase`)}`;
    const keys = ['Z', 'X', 'C', 'V', 'F'];
    const notes = abilityNotes[name] || [];
    const moves = keys.map((key, index) => notes[index] ? `<div class="ability-row"><strong>${key}</strong><span>${notes[index]}</span><a href="${search(`${key} move`)}" target="_blank" rel="noopener noreferrer">Video ↗</a></div>` : '').join('');
    const guide = `https://www.gamersberg.com/blox-fruits/wiki/fruits/${encodeURIComponent(name.toLowerCase().replaceAll(' ', '-'))}`;
    const allMoves = `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} all moves showcase awakened`)}`;
    const imageName = name === 'Blade' ? 'Chop' : name;
    const image = featuredFruitMedia[name]?.image || `https://asset.gamersberg.com/Blox-Fruits/physical/${rarity.toLowerCase()}/${encodeURIComponent(imageName)}.webp`;
    const imageFallback = `https://blox-fruits.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(imageName.replaceAll(' ', '_'))}_Fruit.png`;
    return `<details class="fruit-tile rarity-${rarity.toLowerCase()}"><summary><span class="fruit-tile-art"><img src="${image}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback}';this.onerror=function(){this.onerror=null;this.src='noFilter.webp'}"><span class="fruit-tile-name">${name}</span></span></summary><div class="fruit-tile-details"><span class="fruit-tile-category">${typeLabels[type]} · ${rarityLabels[rarity]}</span><p class="move-label">HABILIDADES · Z / X / C / V / F</p><div class="ability-list">${moves}</div><div class="showcase-links"><a href="${guide}" target="_blank" rel="noopener noreferrer">Ficha e showcase ↗</a><a href="${allMoves}" target="_blank" rel="noopener noreferrer">Ver todos os movimentos ↗</a></div></div></details>`;
  }).join('');
  if (!visibleFruits.length) showcaseGrid.innerHTML = '<p class="no-results">Nenhuma fruta encontrada com esses filtros.</p>';
  const countLabel = document.querySelector('.catalog-count');
  if (countLabel) countLabel.innerHTML = `<strong>${visibleFruits.length}</strong> frutas encontradas`;
};

function attachFruitPriceDetails(tile) {
  if (!tile || tile.dataset.pricesAttached) return;
  const name = tile.querySelector('.fruit-tile-name')?.textContent;
  const values = fruitShopInfo[name];
  if (!values) return;
  const format = (value) => new Intl.NumberFormat('pt-BR').format(value);
  const [beli, robux, fragments] = values;
  const summary = tile.querySelector('summary');
  const tooltip = document.createElement('span');
  tooltip.className = 'fruit-tile-tooltip';
  tooltip.innerHTML = `<span><b>Vendedor NPC</b>${format(beli)} Beli</span><span><b>Compra permanente</b>${format(robux)} Robux</span>${fragments ? `<span><b>Despertar completo (V2)</b>${format(fragments)} Fragments</span>` : ''}`;
  summary.append(tooltip);
  const priceDetails = document.createElement('div');
  priceDetails.className = 'fruit-price-details';
  priceDetails.innerHTML = `<span><b>Vendedor NPC:</b> ${format(beli)} Beli</span><span><b>Compra permanente:</b> ${format(robux)} Robux</span>${fragments ? `<span><b>Despertar completo (V2):</b> ${format(fragments)} Fragments</span>` : ''}`;
  tile.querySelector('.fruit-tile-details')?.prepend(priceDetails);
  tile.dataset.pricesAttached = 'true';
}

if (showcaseGrid) {
  const addPricesFromEvent = (event) => attachFruitPriceDetails(event.target.closest('.fruit-tile'));
  showcaseGrid.addEventListener('pointerover', addPricesFromEvent);
  showcaseGrid.addEventListener('focusin', addPricesFromEvent);
  showcaseGrid.addEventListener('click', addPricesFromEvent);
}

if (showcaseGrid && fruitSearch) {
  renderFruitShowcase();
  fruitSearch.addEventListener('input', () => renderFruitShowcase(fruitSearch.value));
  document.querySelector('#showcase-type-filter')?.addEventListener('change', () => renderFruitShowcase());
  document.querySelector('#showcase-rarity-filter')?.addEventListener('change', () => renderFruitShowcase());
}

const fullFruitShowcase = document.querySelector('#full-fruit-showcase');
// As prévias da wiki são WebP animados: elas rodam dentro da ficha, sem abrir outra página.
// A página da fruta segue como alternativa quando não existe uma prévia para o movimento.
const fruitMoveNames = {
  Rocket:['Rocket','Rocket Barrage','Rocket Rush','Buckshot'], Spin:['Razor Wind','Tornado Assault','Gust Flight'], Blade:['Blade Storm','Shadow Strike','Tornado Cut'], Spring:['Knock','Spring Snipe','Spring Cannon','Spring Leap'], Bomb:['Targeted Bomb','Self Destruct','Explosive Wave','Ultimate Explosion'], Smoke:['Smoke Slam','Smoke Blast','Smoke Bomber','Smoke Liberation'], Spike:['Spike Summon','Whirlwind','Spiky Ball','Spike Barrage'],
  Flame:['Fire Bullets','Burning Blast','Fire Column','Flame Destroyer','Fire Flight'], Ice:['Ice Spears','Ice Surge','Ice Bird','Glacial Epoch','Ice Skating'], Sand:['Desert Sword','Desert Funeral','Sand Tornado','Sand Flight'], Dark:['Dark Rocks','Black Spiral','Black Hole','Dark Bomb'], Eagle:['Feathered Storm','Soaring Talon','Talon Lunge','Flight'], Diamond:['Beaming Tackle','Diamond Hail','Fossilized','Prism Blast'], Light:['Light Ray','Barrage of Light','Light Speed Destroyer','Sky Beam','Light Flight'], Rubber:['Pistol','Cannon','Smash','Snakeman'], Ghost:['Shivering Possession','Spectral Release','Crimson Damnation','Ghost Busters'], Magma:['Magma Clap','Magma Eruption','Magma Fist','Volcanic Assault','Beast Ride'],
  Quake:['Fatal Demolisher','Air Crusher','Spatial Shockwave','Seaquake'], Buddha:['Transform','Impact','Buddha Leap','Buddha Explosion'], Love:['Heart Shot','Cupid Zone','Barrage of Hearts','Lovely Shower','Besto Friendo'], Creation:['Dough Fist','Missile Jab','Warrior Passage','Scorching Donut'], Spider:['Spider Wraith','Overheated Sniper','Web Smasher','Ultimate Thread'], Sound:['Tempo','Ground Drum','Symphonic Radiance','Fortissimo'], Phoenix:['Cremation Cannon','Blazing Plumage','Flame Exodus','Blazing Storm','Swift Flight'], Portal:['Portal Jump','Parallel Escape','World Warp','Dimensional Rift','Quantum Leap'], Lightning:['Lightning Orb','Thunderstorm','Sky Judgement','Thunderball Destruction','Electric Flash'], Pain:['Heavy Pain','Pain Barrage','Pain Nuke','Pain Pressure'], Blizzard:['Snowflake Shuriken','White Out','Howling Wind','Blizzard Domain','Blizzard Flight'],
  Gravity:['Gravity Push','Meteor Pitch','Gravity Obeisance','Meteors Rain'], Mammoth:['Ancient Cutter','True Prehistoric Punk','Colossal Crusher','Transformation','Stampede'], 'T-Rex':['Tail Swipe','Predatory Screech','Hunter’s Rage','Transformation','Gigantic Leap'], Dough:['Fried Dough','Sticky Dough','Carved Dough','Restless Dough Barrage','Pastry River'], Shadow:['Somber Rebellion','Shade Nest','Nightmare Leech','Corvus Torment'], Venom:['Poison Daggers','Noxious Shot','Venomous Blast','Serpent’s Wrath','Transformation'], Gas:['Condensing Gas','Invisible Assault','Miasmic Ravager','Gas Transformation','Traveling Gas'], Spirit:['Frostfire Grasp','Sky Ruler','Demonic Wisp','End of Times'], Tiger:['Z Hunting Slash','X Electric Pounce','C Infernal Prowler','V Transformation','F Wild Assault'], Yeti:['Yeti Claws','Glacial Armor','Iceberg Hurl','Transformation','Yeti Leap'], Magnet:['Metallic Rain','Magnetic Field','Magnetic Forces','Iron Counter'], Kitsune:['Accursed Enchantment','Tails of Burning Agony','Fox Fire Disruption','Transformation','Wild Assault'], Control:['Room','Gamma Rush','Levitate','Teleport'], Dragon:['Heatwave Cannon','Dragonic Claw','Fire Shower','Transformation','Draconic Soar']
};
const fruitMoveModes = {
  Flame:{variants:'V2 substitui as cinco habilidades: Blue Fire Bullets (Z), Prominence Burst (X), Flaming Vortex (C), Hell’s Core (V) e Rocket Flight (F). Os movimentos despertados podem deixar áreas que queimam por alguns segundos.'},
  Lightning:{variants:'Z tem três versões conforme o tempo segurado: toque, carga curta e carga longa. X pode receber orbes com Z; V aumenta de tamanho e dano ao segurar, consumindo até quatro orbes. F muda entre toque e segurar e também usa orbe. A fruta não tem despertar V2.'},
  Kitsune:{variants:'Z muda se acertar ou errar. C é carregada. V transforma e altera M1, Z, X, C e F. Na forma transformada, Z, X e C ganham ataques e efeitos diferentes; V volta à forma humana. As habilidades gastam medidor de caudas.'},
  Buddha:{variants:'Z transforma. Na versão despertada, a forma ganha alcance maior, redução de dano e efeitos próprios; X, C e V também mudam de nome e comportamento. A transformação não aumenta o dano dos M1s por si só.'},
  Control:{variants:'Os ataques dependem da zona ROOM ativa e do modo escolhido. Algumas ações mudam entre golpe de espada e punho; V pode ser carregada e sua execução depende do espaço e dos alvos dentro da área.'},
  Phoenix:{variants:'V transforma em fênix e altera M1 e movimentos. A versão despertada muda novamente o conjunto e acrescenta recursos de cura; F é voo e pode ser usado enquanto transformado.'},
  Dough:{variants:'O conjunto despertado V2 troca os movimentos por versões despertadas; X e C têm diferenças de execução conforme o alvo está no chão ou no ar. A habilidade V pode ser mantida para carregar antes de soltar.'},
  Magma:{variants:'V transforma na forma de Magma; enquanto transformado, M1 e deslocamento sobre lava ficam disponíveis. O despertar modifica os movimentos e permite caminhar sobre a lava criada.'},
  Dragon:{variants:'A fruta tem formas híbrida, East e West. A forma escolhida muda M1 e versões de Z, X, C e F; V ativa ou alterna a transformação. Os ataques usam fúria e podem ter execução carregada.'}
};
// Observações específicas aparecem somente na linha da tecla a que se aplicam.
const fruitAbilityModes = {
  Flame:{Z:'V2: troca Fire Bullets por Blue Fire Bullets; os projéteis perseguem o cursor e atordoam ao acertar.',X:'V2: Prominence Burst deixa uma zona de fogo com dano contínuo.',C:'V2: Flaming Vortex puxa alvos no ar; no chão deixa fogo na área.',V:'V2: Hell’s Core causa uma explosão maior e deixa fogo persistente.',F:'V2: Rocket Flight voa mais rápido e deixa um rastro de fogo.'},
  Lightning:{M1:'Os golpes acertam em sequência e recarregam os orbes elétricos.',Z:'Três versões conforme o tempo segurado: toque dispara um orbe; carga curta cria esfera que atrai; carga longa invoca um dragão elétrico. Cada uso consome um orbe.',X:'Usar Z na nuvem gasta orbes para estender a tempestade ou lançar um dragão.',V:'Segurar carrega até quatro estágios, gastando orbes; cada estágio amplia a explosão e o dano.',F:'Toque teleporta e atinge no caminho; segurar encadeia ataques entre inimigos. Consome um orbe.'},
  Kitsune:{M1:'Na forma normal, o quinto golpe muda conforme o ataque é feito no chão ou no ar; com três caudas, aplica queimadura. Transformada, os golpes têm área maior.',Z:'Normal: acertar envolve o alvo em chamas; errar causa dano leve ao redor. Transformada: acertar dispara chamas contra até três alvos; errar solta uma salva em área.',X:'Normal: investida em zigue-zague com atordoamento. Transformada: termina agarrando e arremessando o alvo; no ar, o golpe finaliza imediatamente.',C:'Carregue a bola de fogo antes de lançar. Transformada, deixa chamas no chão e causa dano contínuo maior.',V:'Alterna entre forma humana e Kitsune completa; a transformação altera M1, Z, X, C e F.',F:'Normal: avança e corta o alvo atingido. Transformada: ataca com a cauda. Ambas gastam medidor de caudas.'},
  Buddha:{Z:'Base: transforma sem causar dano. Despertada: a transformação causa impacto ao redor e aumenta alcance e defesa.',X:'Base: Impact carrega antes de atingir o chão. Despertada: Heavenly Impact cria uma erupção de luz no ponto escolhido.',C:'Base: salto longo com onda no pouso. Despertada: Buddha Leap muda o deslocamento e o impacto da aterrissagem.',V:'A explosão muda na versão despertada: área, efeito e execução são diferentes da habilidade base.'},
  Control:{Z:'Cria a ROOM; as outras habilidades dependem de a zona estar ativa.',X:'Dentro da ROOM, o ataque muda conforme o modo selecionado: corte com espada ou golpe com punho.',C:'Dentro da ROOM, levanta e arremessa objetos; depende dos objetos e alvos disponíveis na área.',V:'Pode ser carregada; a zona ativa e a posição do alvo alteram a execução.'},
  Phoenix:{V:'Ativa a forma de fênix; o despertar tem transformação e conjunto de movimentos próprios.',F:'É voo; na forma transformada também pode apoiar a cura da versão despertada.',Z:'A versão despertada substitui o disparo por uma chama azul com efeito diferente.',X:'A investida muda conforme a forma; a versão despertada tem trajetória e alcance próprios.',C:'A explosão muda entre formas; a versão despertada também pode recuperar aliados.'},
  Dough:{Z:'V2 substitui o golpe de massa pela variante despertada, com efeito e trajetória diferentes.',X:'V2 muda o disparo; mirar no chão ou no ar altera o ponto de impacto.',C:'V2 troca a onda pela variante despertada; altura e ponto de mira mudam sua execução.',V:'Pode ser segurada para carregar; V2 usa a versão despertada do ataque.',F:'V2 troca esta habilidade pela variante despertada.'},
  Magma:{Z:'V2 altera o projétil e pode criar magma no ponto atingido.',X:'V2 muda a erupção e a distribuição das rochas.',C:'V2 altera a onda de magma e deixa lava no percurso.',V:'V2 modifica a chuva de meteoros; a transformação também habilita M1 de magma.',F:'V2 muda o deslocamento; transformado, o usuário pode mover-se sobre a lava criada.'},
  Dragon:{Z:'Trajetória e área mudam entre as formas híbrida, East e West; consome fúria.',X:'A investida tem uma variante para cada forma e consome fúria.',C:'O ataque de fogo e sua área mudam conforme a forma ativa.',V:'Ativa ou alterna a transformação; a forma e o medidor de fúria definem as variantes.',F:'Voo e deslocamento têm versões diferentes em East e West.'}
};
Object.keys(fruitMoveModes).forEach((fruitName) => { fruitMoveModes[fruitName] = {}; });

const inlinePreviewSlugs = {
  Flame:{Z:'firebullets',X:'burningblast',C:'firecolumn',V:'flamedestroyer',F:'fireflight'},
  Buddha:{Z:'buddhav1transform',X:'impact',C:'buddhaleap',V:'buddhaexplosion'},
  Lightning:{Z:'lightningorb',X:'thunderstorm',C:'skyjudgement',V:'thunderballdestruction'},
  Kitsune:{Z:'kitsuneza',X:'kitsunexa',C:'kitsuneca',V:'kitsunetransformation',F:'kitsunefa'}
};
function renderFullFruitShowcase() {
  if (!fullFruitShowcase) return;
  const keys = ['M1', 'Z', 'X', 'C', 'V', 'F'];
  const rarityLabels = { Common: 'Comum', Uncommon: 'Incomum', Rare: 'Rara', Legendary: 'Lendária', Mythical: 'Mítica' };
  const formatMoney = (value) => new Intl.NumberFormat('pt-BR').format(value);
  fullFruitShowcase.innerHTML = fruitCatalog.map(([name, type, rarity]) => {
    const notes = abilityNotes[name] || [];
    const damages = fruitDamageReference[name] || {};
    const [beli, robux, fragments] = fruitShopInfo[name] || [];
    const imageName = name === 'Blade' ? 'Chop' : name;
    const image = featuredFruitMedia[name]?.image || `https://asset.gamersberg.com/Blox-Fruits/physical/${rarity.toLowerCase()}/${encodeURIComponent(imageName)}.webp`;
    const fallback = `https://blox-fruits.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(imageName.replaceAll(' ', '_'))}_Fruit.png`;
    const moves = keys.map((key, index) => {
      const description = key === 'M1' ? (name === 'Buddha' && damages.M1 ? 'Referência da medição: quatro saltos na forma transformada; não é um ataque M1.' : damages.M1 ? 'Ataque básico da fruta ou da forma listada.' : '') : notes[index - 1];
      if (!description) return '';
      const moveTitle = name === 'Buddha' && key === 'M1' ? 'Salto transformado (4 impactos)' : key === 'M1' ? 'Ataque básico' : fruitMoveNames[name]?.[index - 1] || `Habilidade ${key}`;
      const damage = damages[key] ? `${damages[key]} de dano total na medição de referência (2024); não equivale necessariamente a um único acerto.${fragments ? ' A fonte não separa o resultado entre a habilidade base e a V2.' : ''}` : 'A fonte de comparação não publicou um total verificável para este movimento. O dano varia com carga, acertos, alvo e versão.';
      const fruitSlug = name.toLowerCase().replaceAll('-', '').replaceAll(' ', '');
      const videoSlug = inlinePreviewSlugs[name]?.[key] || (key === 'M1' ? '' : moveTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(/[’']/g, '').replaceAll(/[^a-z0-9]+/g, ''));
      const preview = videoSlug ? `<img class="move-preview" src="https://bffr.fr/wiki/assets/img/${fruitSlug}/mv-${videoSlug}.webp" data-fallback="https://bffr.fr/wiki/assets/img/${fruitSlug}/mv-${fruitSlug}${key.toLowerCase()}.webp" alt="Prévia animada: ${name}, ${moveTitle}" loading="lazy" onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.dataset.fallback=''}else{this.hidden=true}">` : '';
      const videoSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`Blox Fruits ${name} ${moveTitle} ability showcase`)}`;
      const moveMode = fruitAbilityModes[name]?.[key] || (fragments && key !== 'M1' ? `V2: esta tecla tem uma versão despertada; veja o efeito descrito acima.` : '');
      const moveModes = moveMode ? `<p class="move-variant"><strong>${moveMode.startsWith('V2:') ? 'Mudança na V2' : 'Carga ou variação'}:</strong> ${moveMode.replace(/^V2:\s*/, '')}</p>` : '';
      return `<article class="full-move"><div class="full-move-key">${key}</div><div class="full-move-copy"><h4>${moveTitle}</h4><p>${description}</p>${moveModes}<p class="full-move-damage"><strong>Dano:</strong> ${damage}</p></div><div class="move-media">${preview}<a href="${videoSearch}" target="_blank" rel="noopener noreferrer">Abrir demonstração em vídeo ↗</a></div></article>`;
    }).join('');
    const transformation = fruitTransformationNotes[name] ? `<div class="fruit-form-note"><strong>Transformação e mudanças de forma</strong><p>${fruitTransformationNotes[name]}</p>${fruitMoveModes[name]?.variants ? `<p>${fruitMoveModes[name].variants}</p>` : ''}<small>Os danos da medição antiga não devem ser interpretados como dano atual ou garantido da transformação.</small></div>` : '';
    const awakening = fragments ? `<p><strong>Despertar V2 completo:</strong> ${formatMoney(fragments)} Fragments.</p>` : '';
    const shop = beli ? `<p><strong>Vendedor NPC:</strong> ${formatMoney(beli)} Beli · <strong>Fruta permanente:</strong> ${formatMoney(robux)} Robux.</p>` : '';
    const guide = `https://www.gamersberg.com/blox-fruits/wiki/fruits/${encodeURIComponent(name.toLowerCase().replaceAll(' ', '-'))}`;
    const sourceUrl = `https://bffr.fr/wiki/en/fruits/${name.toLowerCase().replaceAll(' ', '-')}/`;
    return `<details class="full-fruit-card"><summary><img src="${image}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'"><span><small>${typeLabels[type]} · ${rarityLabels[rarity]}</small><strong>${name}</strong><em>${Object.keys(damages).length ? 'Danos publicados para parte dos movimentos; veja os detalhes' : 'Dano varia; sem valor numérico verificável nesta referência'}</em></span><b class="full-fruit-chevron">＋</b></summary><div class="full-fruit-content"><div class="full-fruit-meta">${shop}${awakening}<p><strong>Teclas e maestria:</strong> M1 é o ataque básico; Z, X, C, V e F liberam conforme a maestria indicada no jogo. Nem toda fruta usa todas as teclas. Os requisitos podem mudar em atualizações.</p></div>${transformation}<div class="full-move-list">${moves}</div><p class="full-fruit-source"><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Ficha atual de movimentos e prévias ↗</a> · <a href="${guide}" target="_blank" rel="noopener noreferrer">Ficha de referência da comunidade ↗</a></p></div></details>`;
  }).join('');
  fullFruitShowcase.querySelectorAll('.move-preview').forEach((image) => {
    const row = image.closest('.full-move');
    const fruitName = image.closest('.full-fruit-card')?.querySelector('summary strong')?.textContent || '';
    const key = row?.querySelector('.full-move-key')?.textContent.trim().toLowerCase() || '';
    const title = row?.querySelector('h4')?.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '') || '';
    const fruitSlug = fruitName.toLowerCase().replaceAll('-', '').replaceAll(' ', '');
    const candidates = [...new Set([
      image.src,
      `https://bffr.fr/wiki/assets/img/${fruitSlug}/mv-${title}.webp`,
      `https://bffr.fr/wiki/assets/img/${fruitSlug}/mv-${fruitSlug}${key}.webp`,
      `https://bffr.fr/wiki/assets/img/${fruitSlug}/mv-${key}.webp`
    ])];
    let candidateIndex = 0;
    image.referrerPolicy = 'no-referrer';
    image.onerror = () => {
      candidateIndex += 1;
      if (candidateIndex < candidates.length) {
        image.src = candidates[candidateIndex];
        return;
      }
      const message = document.createElement('span');
      message.className = 'preview-unavailable';
      message.textContent = 'Prévia indisponível para este movimento';
      image.replaceWith(message);
    };
  });
}
renderFullFruitShowcase();

// Links de vídeo levam à prévia correspondente dentro do guia, sem abrir outra página.
if (fullFruitShowcase) {
  fullFruitShowcase.querySelectorAll('.full-fruit-card').forEach((card) => {
    const fruitName = card.querySelector('summary strong')?.textContent || '';
    const slug = fruitName.toLowerCase().replaceAll(' ', '-').replaceAll(/[^a-z0-9-]/g, '');
    card.id = `full-fruit-${slug}`;
    card.querySelectorAll('.full-move').forEach((move) => {
      const key = move.querySelector('.full-move-key')?.textContent.trim().toLowerCase();
      if (key) move.id = `full-fruit-${slug}-${key}`;
    });
  });
}

document.querySelectorAll('a[href*="youtube.com/results"]').forEach((link) => {
  link.textContent = 'Ver demonstração nesta página ↓';
  link.removeAttribute('target');
});
document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be/"]').forEach((link) => {
  const videoId = new URL(link.href, window.location.href).searchParams.get('v');
  if (videoId && [...document.querySelectorAll('iframe')].some((frame) => frame.src.includes(videoId))) {
    link.textContent = 'Ir para o vídeo incorporado ↓';
    link.removeAttribute('target');
  }
});

document.addEventListener('click', (event) => {
  const videoLink = event.target.closest('a[href*="youtube.com"], a[href*="youtu.be"]');
  if (!videoLink) return;
  const url = new URL(videoLink.href, window.location.href);

  if (url.pathname.includes('/results')) {
    const query = (url.searchParams.get('search_query') || '').toLocaleLowerCase('pt-BR');
    const fruit = fruitCatalog.find(([name]) => query.includes(name.toLocaleLowerCase('pt-BR')));
    if (!fruit || !fullFruitShowcase) return;
    event.preventDefault();
    videoLink.textContent = 'Ver demonstração nesta página ↓';
    const slug = fruit[0].toLowerCase().replaceAll(' ', '-').replaceAll(/[^a-z0-9-]/g, '');
    const card = document.querySelector(`#full-fruit-${CSS.escape(slug)}`);
    const key = ['m1', 'z', 'x', 'c', 'v', 'f'].find((value) => new RegExp(`\\b${value}\\b`, 'i').test(query));
    const moveByKey = key ? document.querySelector(`#full-fruit-${CSS.escape(slug)}-${key}`) : null;
    const moveByName = card && [...card.querySelectorAll('.full-move')].find((row) => {
      const title = row.querySelector('h4')?.textContent.toLocaleLowerCase('pt-BR');
      return title && query.includes(title);
    });
    const move = moveByName || moveByKey;
    if (card) card.open = true;
    const destination = move || card;
    if (destination) {
      history.replaceState(null, '', `#${destination.id}`);
      destination.scrollIntoView({ behavior: 'smooth', block: 'center' });
      destination.classList.add('in-page-video-target');
      window.setTimeout(() => destination.classList.remove('in-page-video-target'), 1600);
    }
    return;
  }

  const videoId = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
  const inlineFrame = [...document.querySelectorAll('iframe')].find((frame) => frame.src.includes(videoId));
  if (inlineFrame) {
    event.preventDefault();
    videoLink.textContent = 'Ver vídeo incorporado nesta página ↓';
    inlineFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, true);

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
