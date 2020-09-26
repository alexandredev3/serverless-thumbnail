import puppeteer, { Page } from 'puppeteer-core';
import { getOptions } from './chromiumOptions';

/*
  Estou criando essa variavel, porque se for feito varias execuções dessas
  funções a pagina vai ser armazenda nessa variavel, vai ser aproveitado pagina 
  em branco da execução anterior, porque e muito pesado ficar abrindo o chrome.
  funciona como se fosse um cache. 
*/
let _page: Page | null;

// vai abrir o browser com uma pagina em branco;
async function getPage(isDev: boolean) {
  if (_page) {
    // se tiver uma pagina em cache, vou usar essa pagina.
    return _page;
  }

  // se não tiver uma pagina em cache, vou criar uma nova.

  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);

  // abrindo uma pagina e guardando dentro da variavel _page;
  _page = await browser.newPage();

  return _page
}

// vai pegar o html, colocar nessa pagina, e tirar uma foto.
export async function getScreenshot(
  html: string,
  isDev: boolean
) {
  const page = await getPage(isDev);

  // setando uma largura e uma altura da "screenshot"... na verdade do site
  await page.setViewport({ width: 1200, height: 630 });
  // abrindo aquele html, nessa pagina em branco.
  await page.setContent(html);

  // tirando a screenshot no formato png, posso tirar em varios outros formatos, ou mais de um.
  const file = await page.screenshot({ type: 'png' });

  return file;
}