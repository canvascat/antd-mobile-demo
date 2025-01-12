import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import React from "react";
import { demos } from "./config.ts";
import Gallery from "./gallery.tsx";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="~demos">
          {demos.map(([path, Component]) => {
            return (
              <Route
                key={path}
                path={path}
                element={React.createElement(Component)}
              />
            );
          })}
        </Route>
        <Route path="/" element={<Gallery />} />
        <Route path="/:component/:key" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
