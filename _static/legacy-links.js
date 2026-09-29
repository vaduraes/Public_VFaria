// Preserve links to sections of the original single page website.
(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  if (location.pathname !== siteRoot.pathname && location.pathname !== `${siteRoot.pathname}index.html`) return;
  const pages = {
    research: 'research/index.html',
    publications: 'publications/index.html',
    presentations: 'presentations/index.html',
    teaching: 'teaching/index.html',
  };
  const target = pages[location.hash.slice(1)];
  if (target) location.replace(new URL(target, siteRoot));
})();
