// como o chrome vai se comportar dentro desse projeto.
import chrome from 'chrome-aws-lambda';

// aqui estão os caminhos dos 3 sistemas operacionais onde o chrome esta instalado.
// se o seu estiver em um caminho diferente, então, coloque o caminho que o chrome esta instalado na sua maquina.
const chromeExecPaths = {
  win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  linux: '/usr/bin/google-chrome',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
};

// caminho de execução.
// process.platform vai retorna qual sistema operacional esta rodando esta aplicação.
const exePath = chromeExecPaths[process.platform];

interface Options {
  args: string[];
  executablePath: string; // qual o caminho do chrome, para fazer a execução.
  headless: boolean; // se o chrome vai aparecer fazendo as ações ou não.
}

export async function getOptions(isDev: boolean): Promise<Options> {
  let options: Options;

  if (isDev) {
    // se eu estiver em ambiente de desenvolvimento eu vou rodar essa opções de acordo com minha maquina.
    options = {
      args: [],
      executablePath: exePath,
      headless: true 
    }
  } else {
    // se eu não estiver em ambiente de desenvolvimento, eu vou rodar as opções do chrome-aws-lambda.
      options = {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
      } 
  }

  return options;
}