import { mount } from "svelte";
import App from "./App.svelte";
import "./app.css";

const target = document.getElementById("app");

if (target === null) {
  throw new Error("Options root element was not found.");
}

const app = mount(App, {
  target,
});

export default app;
