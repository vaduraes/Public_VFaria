// Enhance the static year sections; all talks remain readable without JavaScript.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#presentations');
  if (!root) return;
  const controls = root.querySelector('[data-presentation-controls]');
  if (!controls) return;
  const groups = [...root.querySelectorAll(':scope > section')].map((section) => {
    const heading = section.querySelector(':scope > h2');
    const year = heading?.textContent.match(/^\d{4}/)?.[0];
    return { section, year, cards: [...section.querySelectorAll('.presentation-entry')] };
  }).filter((group) => group.year && group.cards.length);
  if (!groups.length) return;

  const tabs = controls.querySelector('[data-year-filters]');
  const search = controls.querySelector('input[type="search"]');
  const reset = controls.querySelector('[data-reset]');
  const status = root.querySelector('[data-presentation-count]');
  const empty = root.querySelector('[data-presentation-empty]');
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = new Map(groups.flatMap(({ cards }) => cards.map((card) => [card, normalize(card.textContent)])));
  let selectedYear = '';

  const update = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    groups.forEach(({ section, year, cards }) => {
      let visible = 0;
      cards.forEach((card) => {
        card.hidden = Boolean((selectedYear && year !== selectedYear) || !terms.every((term) => searchable.get(card).includes(term)));
        if (!card.hidden) visible += 1;
      });
      section.hidden = visible === 0;
      count += visible;
    });
    tabs.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.year === selectedYear));
    });
    status.textContent = `${count} ${count === 1 ? 'presentation' : 'presentations'}${selectedYear ? ` in ${selectedYear}` : ''}`;
    empty.hidden = count !== 0;
    reset.disabled = !selectedYear && !search.value;
  };

  ['', ...groups.map(({ year }) => year)].forEach((year) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.year = year;
    button.textContent = year || 'All years';
    button.addEventListener('click', () => { selectedYear = year; update(); });
    tabs.append(button);
  });
  search.addEventListener('input', update);
  reset.addEventListener('click', () => { selectedYear = ''; search.value = ''; update(); search.focus(); });
  // Preserve inbound links from grants and old year navigation, including filtered views.
  const revealHash = () => {
    const match = location.hash.match(/^#year-(\d{4})$/);
    const group = match && groups.find(({ year }) => year === match[1]);
    if (!group) return;
    selectedYear = group.year;
    search.value = '';
    update();
    group.section.scrollIntoView({ block: 'start' });
  };
  window.addEventListener('hashchange', revealHash);
  root.querySelector('.presentation-year-links').hidden = true;
  controls.hidden = false;
  status.hidden = false;
  update();
  revealHash();
});
