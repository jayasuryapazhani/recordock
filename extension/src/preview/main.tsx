import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PreviewPage from "./PreviewPage";
import "./preview.css";

const previewRoot =
  document.getElementById("preview-root");

if (!previewRoot) {
  throw new Error(
    "Recordock preview root element was not found.",
  );
}

createRoot(previewRoot).render(
  <StrictMode>
    <PreviewPage />
  </StrictMode>,
);