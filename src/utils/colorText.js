import randomColor from 'randomcolor';

export function colorText(text, regexes) {
  let finalText = text;

  for (const regexp of regexes) {
    const wordReg = new RegExp(regexp, 'gi');
    if (finalText.match(wordReg)) {
      const color = randomColor({
        luminosity: 'dark',
      });
      finalText = finalText.replace(
        wordReg,
        `<span style="text-shadow: ${color} 0 0 1px;color:${color}">${regexp}</span>`
      );
    }
  }
  return finalText;
}
