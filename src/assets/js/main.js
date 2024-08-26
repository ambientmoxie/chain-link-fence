import "../scss/style.scss";
import sketch from "./sketch";
import p5 from "p5";

window.onload = () => {
  new p5(sketch);
};