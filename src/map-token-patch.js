const SPRITE_BACK_SUFFIX = '_costas.png';

function toBackSprite(src) {
  if (!src || !src.includes('/sprites/')) return src;
  if (src.endsWith(SPRITE_BACK_SUFFIX)) return src;
  return src.replace(/\.png(\?.*)?$/i, `${SPRITE_BACK_SUFFIX}$1`);
}

function patchMapTokens() {
  document.querySelectorAll('.unit-token img').forEach((img) => {
    const front = img.dataset.frontSrc || img.getAttribute('src') || '';
    const back = toBackSprite(front);
    img.dataset.frontSrc = front;
    if (back && img.getAttribute('src') !== back) {
      img.onerror = () => {
        img.onerror = null;
        img.src = front;
      };
      img.src = back;
    }
  });
}

function installTokenScaleStyle() {
  if (document.getElementById('map-token-patch-style')) return;
  const style = document.createElement('style');
  style.id = 'map-token-patch-style';
  style.textContent = `
    .unit-token {
      width: 94px !important;
      height: 122px !important;
      transform: translate(-50%, -89%) !important;
      z-index: 8 !important;
    }

    .unit-token img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      object-position: center bottom !important;
      image-rendering: auto !important;
    }

    .unit-label {
      transform: translate(-50%, 10px) !important;
      z-index: 9 !important;
    }

    @media (max-width: 620px) {
      .unit-token {
        width: 84px !important;
        height: 110px !important;
        transform: translate(-50%, -89%) !important;
      }
    }
  `;
  document.head.appendChild(style);
}

installTokenScaleStyle();
patchMapTokens();

const observer = new MutationObserver(() => patchMapTokens());
observer.observe(document.documentElement, { childList: true, subtree: true });
