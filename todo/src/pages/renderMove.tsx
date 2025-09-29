
//
export default function Compo(props: any) {
  //console.log("path=", props.path)
  const html = `<!DOCTYPE html><html lang="en">
  <body>
    <script>
    //console.log("#move");
    location.href = '${props.path}';
    </script>
  </body></html>
  `
  return html;
}
