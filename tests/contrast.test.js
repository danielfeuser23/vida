import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css = readFileSync(new URL('../style.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
// Resolve declarations from the actual stylesheet, including later overrides.
function declaration(selector, property) {
  let result;
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectors.trim().split(',').map(s => s.trim()).includes(selector)) continue;
    for (const item of body.split(';')) {
      const index = item.indexOf(':');
      if (item.slice(0, index).trim() === property) result = item.slice(index + 1).trim();
    }
  }
  assert.ok(result, `${selector} deve declarar ${property}`);
  return result.replace(/var\((--[\w-]+)\)/g, (_, name) => declaration(':root', name));
}
function rgb(color) {
  assert.match(color, /^#[\da-f]{6}$/i, `Cor opaca esperada: ${color}`);
  return color.slice(1).match(/../g).map(v => parseInt(v, 16) / 255);
}
function luminance(color) {
  const [r, g, b] = rgb(color).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b;
}
function ratio(front, back) {
  const a = luminance(front), b = luminance(back);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
function contrast(selector, property, background, minimum = 4.5) {
  const foreground = declaration(selector, property);
  const actual = ratio(foreground, background);
  assert.ok(actual >= minimum, `${selector}: ${foreground} sobre ${background} = ${actual.toFixed(2)}:1, mínimo ${minimum}:1`);
}
const paper = declaration(':root', '--paper'), page = declaration(':root', '--bg');

test('contraste de texto auxiliar atende 4,5:1 em página, cartões e missões feitas', () => {
  for (const background of [page, paper, declaration('.mission.done', 'background')]) {
    contrast(':root', '--muted', background);
  }
});

test('informações de período, rodapé, moedas e histórico têm contraste de texto normal', () => {
  contrast('.period-title', 'color', page);
  contrast('.footer', 'color', page);
  contrast('.gentle', 'color', page);
  contrast('.balance', 'color', page);
  contrast('.coin', 'color', declaration('.coin', 'background'));
  contrast('.amount.positive', 'color', paper);
  contrast('.mission-meta .reward', 'color', paper);
});

test('avisos, chips e próximo passo preservam contraste de texto normal', () => {
  for (const selector of ['.notice', '.notice.warning', '.chip', '.chip.gold']) {
    contrast(selector, 'color', declaration(selector, 'background'));
  }
  for (const selector of ['.next-panel .eyebrow', '.next-panel p']) {
    contrast(selector, 'color', declaration('.next-panel', 'background'));
  }
});

test('texto da área escura e botões principais continuam legíveis', () => {
  for (const selector of ['.hero-copy .eyebrow', '.hero p']) {
    contrast(selector, 'color', declaration('.hero', 'background'));
  }
  contrast('.nav button', 'color', declaration(':root', '--side'));
  assert.ok(ratio('#ffffff', declaration(':root', '--green')) >= 4.5);
});

test('ícones informativos e limite do controle de concluir distinguem-se do fundo', () => {
  for (const selector of ['.tile-icon', '.tile-icon.gold', '.tile-icon.blue']) {
    contrast(selector, 'color', declaration(selector, 'background'), 3);
  }
  const border = declaration('.complete-check', 'border').match(/#[\da-f]{6}/i)?.[0];
  assert.ok(border, 'Controle de concluir deve ter limite explícito');
  assert.ok(ratio(border, paper) >= 3, `Limite de concluir: ${ratio(border, paper).toFixed(2)}:1`);
});

test('foco visível contrasta em superfícies claras e escuras', () => {
  const focus = declaration('button:focus-visible', 'outline').match(/#[\da-f]{6}/i)?.[0];
  assert.ok(focus, 'Cor de foco explícita');
  for (const background of [paper, page]) assert.ok(ratio(focus, background) >= 3, `Foco no fundo ${background}: ${ratio(focus, background).toFixed(2)}:1`);
  const darkFocus = declaration('.sidebar button:focus-visible', 'outline-color');
  for (const background of [declaration(':root', '--side'), declaration('.timer', 'background')]) {
    assert.ok(ratio(darkFocus, background) >= 3, `Foco na superfície escura: ${ratio(darkFocus, background).toFixed(2)}:1`);
  }
});
