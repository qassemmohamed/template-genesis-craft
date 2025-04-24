import { createGlobalStyle } from "styled-components";

const LightMode = createGlobalStyle` 

  :root {
    --background: #f9f9f9;
    --headline: #323449;
    --paragraph: #323449;
    --border: #2b2d42;
    --button: #2b2d42;
    --scroll: #323449;
    --button-border: #2b2d42;
    --button-hover: #2b2d42;
    --button-text: #fff;
    --button-text-hover: #fff;
    --card-background: #edf0f1;
    --card-headline : #000000;
    --card-paragraph : #333333;
    --link-color: #000000;
    --link-hover:#fff;
    --Logo-text-color: #000000;
    --input-background:#fff;
    --input-border-color: red;
    --badge-background: #2b2d42;
    --badge-text:#eee;
    --skeleton-color: #353f4e;
    --tertiary-color: #000000;
    --footer-border-color: #000000;
    --footer-background : #16161a;
    --footer-text: #c1c2c2;
    --menu-color:#000;
    --input-text: #000;
    --input-border:"#ef4565";
    --selectBox-border : #000;
    --outline-button-text :#000 ;
    --mark: #7f5af0;
    
    }
`;

export default LightMode;
