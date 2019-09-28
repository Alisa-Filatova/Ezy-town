(function() {

  var IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var BODY = IS_SAFARI ? document.body : document.documentElement;

  var STOP = 0;
  var INCREMENT = 16;
  var SHIFT_CORRECTION = 50;
  var BORDER = 0;
  var IS_WIDE_SCREEN = false;

  var resizeTimeout;

  var bg = document.getElementById('header-background');
  var logo = document.getElementById('logo');
  var hk = document.getElementById('hk');
  var hm = document.getElementById('hm');

  var heroes = document.getElementById('heroes');
  var hero = document.getElementById('hero');
  var stop = document.getElementById('stop');

  var advantages = document.querySelectorAll('.advantage');
  var modal = document.getElementById('modal');

  function getInitPositions() {
    STOP = stop.getBoundingClientRect().bottom - (hero.getBoundingClientRect().bottom - SHIFT_CORRECTION);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  function scrollTo(to, duration) {
    var start = BODY.scrollTop;
    var currentTime = 0;

    var animateScroll = function () {
      currentTime += INCREMENT;
      BODY.scrollTop = easeInOutQuad(currentTime, start, to - start, duration);
      if (currentTime < duration) setTimeout(animateScroll, INCREMENT);
    };

    animateScroll();
  }

  function getHeroView(pos) {
    if (pos < 2) return 1;
    if (pos >=2 && pos < 20) return 2;
    if (pos >= 20 && pos <= 80) return 3;
    if (pos > 80 && pos <= 98) return 4;
    return 5;
  }

  function onScroll() {
    var scroll = BODY.scrollTop;

    if (IS_WIDE_SCREEN) {
      var view = getHeroView(scroll * 100 / STOP);

      if (scroll > STOP) {
        heroes.style.position = 'absolute';
        heroes.style.top = STOP + 'px';
      } else {
        heroes.style.position = 'fixed';
        heroes.style.top = '0px';
      }

      logo.style.transform = 'translate3d(-50%, ' + (scroll / 2) + 'px, 0) rotate(0.02deg)';
      bg.style.transform = 'translate3d(0, ' + (scroll / 1.6) + 'px, 0) rotate(0.02deg)';

      heroes.className = 'heroes__view' + view;
    }

    advantages.forEach(function (advantage) {
      var top = advantage.getBoundingClientRect().top;
      if (top < BORDER) advantage.classList.add('show');
    })
  }

  function onDeviceOrientation(e) {
    if (IS_WIDE_SCREEN) return;

    var landscape = window.orientation === 90 || window.orientation === -90;
    var x = Math.floor(40 * (landscape ? e.beta : e.gamma) / 100);
    var y = Math.floor(40 * (landscape ? e.gamma : e.beta) / 100);

    var transform = 'translate3d(' + (x / 1.5) + 'px, ' + (y / 1.5) + 'px, 0)';

    hk.style.transform = transform;
    hm.style.transform = transform;

    bg.style.transform = 'translate3d(' + (x / 4) + 'px, ' + (y / 4) + 'px, 0) scale(1.1)';
  }

  function onDocumentClick(e) {
    if (e.isTrusted !== true) return;
    if (e.target.classList.contains('link')) modal.classList.toggle('show');
    if (e.target.classList.contains('arrow-down-btn')) scrollTo(window.innerHeight, 1600);
  }

  function onModalClick(e) {
    if (e.isTrusted !== true) return;
    var cls = e.target.classList;

    if (cls.contains('overlay') || cls.contains('button')) {
      modal.classList.toggle('show');
    }
  }

  function init() {
    IS_WIDE_SCREEN = window.innerWidth >= 1024;
    BORDER = window.innerHeight - (window.innerHeight / 3);
    if (IS_WIDE_SCREEN) getInitPositions();
    if (BODY.scrollTop > 0) onScroll();
  }

  function onResize() {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(function() {
      init();
    }, 300);
  }

  setTimeout(function() { init() }, 16);

  window.addEventListener('resize', onResize);
  window.addEventListener('deviceorientation', onDeviceOrientation);
  document.addEventListener('scroll', onScroll);
  document.addEventListener('click', onDocumentClick);
  modal.addEventListener('click', onModalClick);

})();
