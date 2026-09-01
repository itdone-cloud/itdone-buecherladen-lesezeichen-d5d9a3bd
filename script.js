(function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Shared footer
  var footerEl = document.getElementById('footer');
  if (footerEl) {
    footerEl.innerHTML = [
      '<div class="container">',
      '  <div class="footer-grid">',
      '    <div>',
      '      <h4>Lesezeichen</h4>',
      '      <p>Inhabergeführte Buchhandlung im Freiburger Stühlinger. Kuratiertes Sortiment, persönliche Beratung, Bestellservice.</p>',
      '    </div>',
      '    <div>',
      '      <h4>Entdecken</h4>',
      '      <ul>',
      '        <li><a href="/sortiment.html">Sortiment</a></li>',
      '        <li><a href="/veranstaltungen.html">Veranstaltungen</a></li>',
      '        <li><a href="/ueber-uns.html">Über uns</a></li>',
      '      </ul>',
      '    </div>',
      '    <div>',
      '      <h4>Besuchen</h4>',
      '      <ul>',
      '        <li>Gerberau 12, 79098 Freiburg</li>',
      '        <li>Mo&ndash;Fr 9:30&ndash;18:30</li>',
      '        <li>Sa 9:30&ndash;16:00</li>',
      '      </ul>',
      '    </div>',
      '    <div>',
      '      <h4>Kontakt</h4>',
      '      <ul>',
      '        <li><a href="mailto:hallo@lesezeichen-freiburg.de">hallo@lesezeichen-freiburg.de</a></li>',
      '        <li><a href="tel:+497611234567">0761 123 45 67</a></li>',
      '        <li><a href="/kontakt.html">Kontaktformular</a></li>',
      '      </ul>',
      '    </div>',
      '  </div>',
      '  <div class="footer-bottom">',
      '    <span>© ' + new Date().getFullYear() + ' Lesezeichen Buchhandlung, Freiburg</span>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  // Highlight active nav link based on current path
  var path = window.location.pathname.replace(/\/$/, '');
  if (path === '' || path === '/') path = '/index.html';
  document.querySelectorAll('nav.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '/index.html' && href === '/index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // PWA: register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
