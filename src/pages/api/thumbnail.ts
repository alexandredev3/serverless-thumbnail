import { NextApiRequest, NextApiResponse } from "next";
import getThumbnailTemplate from "./_lib/thumbTemplate";

import { getScreenshot } from "./_lib/chromium";

/**
 * Fluxo:
  * Gerar um html com a imagem.
  * Usar o puppeter para acessar esse html, e tirar uma foto, grava em um png, e retornar o png.
*/

/**
  quando rodar essa aplicação na aws lambda ou na vercel, algumas variaveis ambientes
  vão estar expostas para nós, se tiver essas variaveis ambientes, quer dizer que estamos
  em ambiente de produção, se não tiver, quer dizer que estamos em ambiente de desenvolvimento.
 */

// se essa variavel não estiver presente, quer dizer que estou em ambiente de desenvolvimento.
const isDev = !process.env.AWS_REGION;

export default async function (request: NextApiRequest, response: NextApiResponse) {
  try {
    // pegando o titulo dentro da url.
    const title = String(request.query.title);

    if (!title) {
      return new Error('Title is required');
    }

    const html = getThumbnailTemplate(title);

    const file = await getScreenshot(html, isDev);

    // falando para o cliente que isso e um html e não uma imagem;
    // response.setHeader('Content-Type', 'text/html');
    response.setHeader('Content-Type', 'image/png');
    // Controle de cache.
    // s-maxage, max-age e o timestamps de expiração desse cache.
    // precisamos passar esse header, para não precisar ficar gerando toda vez que for acessado.
    response.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');

    return response.end(file)
    // return response.end(html); // enviado o html;
  } catch(err) {
    console.error(err);

    return response.status(500).send('Internal server error');
  }
}