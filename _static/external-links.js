// Keep the website open when a visitor follows a link to another site.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach((link) => {
    let destination;
    try {
      destination = new URL(link.getAttribute('href'), document.baseURI);
    } catch {
      return;
    }
    if (!['http:', 'https:'].includes(destination.protocol) || destination.origin === location.origin) return;

    link.setAttribute('target', '_blank');
    const relationship = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    relationship.add('noopener');
    relationship.add('noreferrer');
    link.setAttribute('rel', [...relationship].join(' '));
    if (!link.hasAttribute('title')) link.setAttribute('title', 'Opens in a new tab');
  });
});
