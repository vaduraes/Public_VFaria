document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.content-collection').forEach((collection) => {
    const controls = collection.querySelector('.collection-controls');
    const grid = collection.querySelector('.collection-grid');
    const cards = [...grid.querySelectorAll('.collection-card')];
    const year = controls.querySelector('[data-filter="year"]');
    const topic = controls.querySelector('[data-filter="topic"]');
    const order = controls.querySelector('[data-sort]');
    controls.hidden = false;
    const update = () => {
      let count = 0;
      cards.sort((a, b) => {
        const comparison = a.dataset.date.localeCompare(b.dataset.date);
        return order.value === 'oldest' ? comparison : -comparison;
      }).forEach((card) => {
        card.hidden = Boolean((year.value && card.dataset.year !== year.value) || (topic.value && card.dataset.topic !== topic.value));
        if (!card.hidden) count += 1;
        grid.append(card);
      });
      collection.querySelector('.collection-count').textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
      collection.querySelector('.collection-no-results').hidden = count !== 0;
    };
    controls.addEventListener('change', update);
    update();
  });
});
