import renderLayout from './renderLayout';
//
export default function Page(props: any) { 
  
  const htm = `
  <div>
    <div id="app"></div>
    <script type="module" src="/static/home.js" ></script>
  </div>
  `;
  return renderLayout({children: htm, title: "Home"});
}
/*
*/
