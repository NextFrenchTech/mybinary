const frame = () => new Promise(ok => requestAnimationFrame(ok));

const bcd = n => n/10<<4 | n%10;

const braille = n =>
  (n&0x01)<<7 | (n&0x02)<<4 | (n&0x04)<<2 | (n&0x08) |
  (n&0x10)<<2 | (n&0x20)>>3 | (n&0x40)>>5 | (n&0x80)>>7 | 0x2800;

const uint8 = (...uint32) =>
  [].concat(...uint32.map(n => [n>>>24, n>>>16, n>>>8, n]));

const render = (...uint32) =>
  String.fromCharCode(...uint8(...uint32).map(braille));

const main = async () => {
  const clock = document.querySelector('#clock');
  const timestamp = document.querySelector('#timestamp');
  clock.dataset.before = render(0x3f07f07f);
  timestamp.dataset.before = render(0xffffffff, 0xffffffff);

  for (;; await frame()) {
    const date = new Date;
    const h = bcd(date.getHours());
    const m = bcd(date.getMinutes());
    const s = bcd(date.getSeconds());
    const dots = date.getMilliseconds() < 500 && 0x600600;
    clock.dataset.after = render(h<<24 | m<<12 | s | dots);
    timestamp.dataset.after = render(2**-32 * date, date);
  };
};

main();