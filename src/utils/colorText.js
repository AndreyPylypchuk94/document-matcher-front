import { randomColor } from 'randomcolor';

export function colorText(text, regexes) {
  let finalText = text;

  for (const regexp of regexes) {
    const wordReg = new RegExp(regexp, 'gi');
    if (finalText.match(wordReg)) {
      finalText = finalText.replace(
        wordReg,
        `<span style="font-weight: bold;color:${randomColor({
          luminosity: 'dark',
        })}">${regexp}</span>`
      );
    }
  }
  return finalText;
}
