import ReactDOM from 'react-dom/client'
import React from 'react'

const Page: React.FC = () => {
  return (
  <div className="text-3xl"><h1>About</h1> 
    <hr />
    <span><a href="/">[ home ]</a>
    </span>
  </div>
  );
};
ReactDOM.createRoot(document.getElementById('app')).render(
  <div>
    <Page />
  </div>
);
