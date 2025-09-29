
let PATH__FAVICON = "/favicon.ico";
//
export default function Compo(props: any) {
  const html = `<!DOCTYPE html><html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${props.title}</title>
    <link rel="icon" href="${PATH__FAVICON}" type="image/x-icon"></link>
    <link href="/main.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js"></script>
  </head>
  <body>
    <!-- head_wrap -->
    ${props.children}
  </body></html>
  `
  return html;
}
/*
<script type="module" src="/static/entry-client.js" ></script>
*/
