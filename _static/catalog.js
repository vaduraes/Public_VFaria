document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.content-collection').forEach((collection) => {
    const controls = collection.querySelector('.collection-controls');
    const grid = collection.querySelector('.collection-grid');
    const cards = [...grid.querySelectorAll('.collection-card')];
    const cardTopics = new Map(cards.map(card => [card, JSON.parse(card.dataset.topics)]));
    const year = controls.querySelector('[data-filter="year"]');
    const topic = controls.querySelector('[data-filter="topic"]');
    const order = controls.querySelector('[data-sort]');
    const projectMenu = collection.dataset.collection === 'projects'
      ? document.querySelector('.wy-menu-vertical li.toctree-l1.current > ul')
      : null;
    const projectLinks = projectMenu
      ? new Map([...projectMenu.querySelectorAll('li.toctree-l2')].map(item => [item.querySelector('a')?.getAttribute('href'), item]))
      : null;
    controls.hidden = false;
    const update = () => {
      let count = 0;
      cards.sort((a, b) => {
        const comparison = a.dataset.date.localeCompare(b.dataset.date);
        return order.value === 'oldest' ? comparison : -comparison;
      }).forEach((card) => {
        card.hidden = Boolean((year.value && card.dataset.year !== year.value) || (topic.value && !cardTopics.get(card).includes(topic.value)));
        if (!card.hidden) count += 1;
        grid.append(card);
        const projectLink = card.querySelector('.project-card-link');
        const menuItem = projectLink && projectLinks?.get(projectLink.getAttribute('href'));
        if (menuItem) {
          menuItem.hidden = card.hidden;
          projectMenu.append(menuItem);
        }
      });
      collection.querySelector('.collection-count').textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
      collection.querySelector('.collection-no-results').hidden = count !== 0;
    };
    controls.addEventListener('change', update);
    update();
  });
});
