import{j as s}from"./index-yrBrVkuG.js";import{P as e,i as r}from"./GoUp-CETzLJLR.js";function t({buttonProps:i}){return s.jsxs("button",{className:`outline-button ${i.buttonSmall?"small":"large"}`,onClick:i.clickFunction,children:[i.startImage&&s.jsx("svg",{children:s.jsx("use",{href:`${r}#${i.startImageSrc}`})}),i.text,i.endImage&&s.jsx("svg",{children:s.jsx("use",{href:`${r}#${i.endImageSrc}`})})]})}t.propTypes={buttonProps:e.shape({buttonSmall:e.bool.isRequired,startImage:e.bool.isRequired,startImageSrc:e.string,text:e.string.isRequired,endImage:e.bool.isRequired,endImageSrc:e.string,clickFunction:e.func.isRequired}).isRequired};export{t as O};