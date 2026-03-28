import React, { useState, useEffect } from "react";
import PartInput from "./components/PartInput";
import { generateCompleteDocument } from "./utils/documentGenerator";
import {
  getPaperDimensions,
  calculateDynamicPadding,
  calculateTitleFontSize,
  calculateContentFontSize,
} from "./utils/tocUtils";
import { generateDOCX } from "./utils/docxGenerator";

function App() {
  const [parts, setParts] = useState([
    {
      title: "",
      annexes: [],
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");
  const [paperSize, setPaperSize] = useState("8.5x13");

  useEffect(() => {
    // Add initial part on mount
    if (parts.length === 0) {
      addPart();
    }
  }, []);

  const addPart = (afterIndex = null) => {
    const newPart = {
      title: "",
      annexes: [],
    };

    if (afterIndex !== null) {
      const newParts = [...parts];
      newParts.splice(afterIndex + 1, 0, newPart);
      setParts(newParts);
    } else {
      setParts([...parts, newPart]);
    }
  };

  const removePart = (index) => {
    if (parts.length > 1) {
      const newParts = parts.filter((_, i) => i !== index);
      setParts(newParts);
    }
  };

  const updatePart = (index, updatedPart) => {
    setParts((prevParts) => {
      const newParts = [...prevParts];
      newParts[index] = updatedPart;
      return newParts;
    });
  };

  const addAnnexToPart = (partIndex) => {
    const newAnnex = {
      type: "Annex",
      number: "",
      description: "",
    };

    setParts((prevParts) => {
      const newParts = [...prevParts];
      const updatedPart = {
        ...newParts[partIndex],
        annexes: [...newParts[partIndex].annexes, newAnnex],
      };
      newParts[partIndex] = updatedPart;
      return newParts;
    });
  };

  const generateTOC = () => {
    // Filter out parts with empty titles
    const validParts = parts.filter(
      (part) => part && part.title && part.title.trim(),
    );

    if (validParts.length === 0) {
      alert("Please enter at least one part title.");
      return;
    }

    // Filter out empty annexes
    const filteredParts = validParts.map((part) => ({
      ...part,
      annexes: (part.annexes || [])
        .filter((annex) => annex && typeof annex === "object" && annex !== null)
        .filter(
          (annex) =>
            annex.description &&
            typeof annex.description === "string" &&
            annex.description.trim(),
        ),
    }));

    const documentHTML = generateCompleteDocument(
      filteredParts,
      paperSize,
      "3px",
      "0.75in",
    );
    setPreviewHTML(documentHTML);
    setShowPreview(true);

    // Scroll to preview
    setTimeout(() => {
      const previewSection = document.getElementById("preview-section");
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const saveDOCX = async () => {
    try {
      await generateDOCX(parts, paperSize, "3px");
    } catch (error) {
      console.error("Error generating DOCX:", error);
      alert("There was an error generating the DOCX file. Please try again.");
    }
  };

  const printTOC = () => {
    // Filter out parts with empty titles
    const validParts = parts.filter(
      (part) => part && part.title && part.title.trim(),
    );

    if (validParts.length === 0) {
      alert("Please enter at least one part title.");
      return;
    }

    // Generate complete document HTML
    const documentHTML = generateCompleteDocument(
      validParts,
      paperSize,
      "3px",
      "0.75in",
    );

    // Create print window with proper print styles
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow popups for this website to use the print feature.");
      return;
    }

    // Write the document with print-specific CSS
    printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Table of Contents</title>
                <style>
                    @page {
                        size: ${getPaperDimensions(paperSize).width} ${getPaperDimensions(paperSize).height};
                        margin: 0.25in !important;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        background: white;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    .toc-page {
                        width: ${getPaperDimensions(paperSize).width};
                        height: ${getPaperDimensions(paperSize).height};
                        border: 3px solid black;
                        padding: 10px;
                        margin: 0 auto 20px auto;
                        background: white;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        page-break-after: always;
                    }
                    .toc-content-wrapper {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .toc-title {
                        text-align: center;
                        font-family: Arial, sans-serif;
                        font-size: ${calculateTitleFontSize(validParts.length)}px !important;
                        font-weight: bold;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                    }
                    .toc-content {
                        font-family: Arial, sans-serif;
                        font-size: ${calculateContentFontSize(validParts.length)}px !important;
                        font-weight: 500 !important;
                    }
                    .toc-item {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin-bottom: 6px;
                        page-break-inside: avoid;
                    }
                    .toc-item-text {
                        white-space: nowrap;
                        max-width: none;
                        align-self: center;
                        flex-grow: 0;
                    }
                    .toc-item-letter {
                        margin-left: 10px;
                        font-weight: 900 !important;
                        flex-shrink: 0;
                        align-self: center;
                    }

                    .dot-leaders {
                        flex-grow: 1;
                        position: relative;
                        margin: 0 6px;
                        align-self: center;
                        min-width: 50px;
                        height: 1em;
                    }

                    .dot-leaders::before {
                        content: "................................................................................................................................................................................................................................................................................................................................................................................................................................";
                        position: absolute;
                        left: 0;
                        right: 0;
                        overflow: hidden;
                        white-space: nowrap;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 1;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                        color: #000 !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    .part-page {
                        width: ${getPaperDimensions(paperSize).width};
                        height: ${getPaperDimensions(paperSize).height};
                        border: 3px solid black;
                        padding: 10px;
                        margin: 0 auto 20px auto;
                        background: white;
                        box-sizing: border-box;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .part-title {
                        text-align: center;
                        font-family: Arial, sans-serif;
                        font-size: 60px !important;
                        font-weight: bold;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                    }
                    .annexes-section {
                        margin-top: 60px;
                    }
                    .annex-item {
                        font-family: Arial, sans-serif;
                        font-size: 14px !important;
                        margin-bottom: 10px;
                        line-height: 1.2;
                        word-wrap: break-word;
                        white-space: normal;
                    }
                    .annex-item strong {
                        font-weight: 900;
                    }
                    @media print {
                        .toc-page, .part-page {
                            page-break-after: always;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${documentHTML}
            </body>
            </html>
        `);

    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            style={{
              height: "80px",
              width: "75px",
              objectFit: "contain",
            }}
            onError={(e) => {
              // Fallback if logo fails to load
              e.target.style.display = "none";
            }}
          />
          <h1 style={{ margin: 0 }}>Table of Contents Generator</h1>
        </div>
        <div style={{ textAlign: "right", fontSize: "14px", color: "#666" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>Developed by:</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "#E75480" }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span style={{ color: "#E75480" }}>ziemustrive</span>
          </div>
          <div>Version: 1.2</div>
        </div>
      </div>
      <div className="input-section">
        <h2>Document Parts</h2>
        <div id="parts-container">
          {parts.map((part, index) => (
            <PartInput
              key={index}
              part={part}
              index={index}
              onChange={updatePart}
              onRemove={removePart}
              onAddAnnex={addAnnexToPart}
              onAddPartAfter={addPart}
            />
          ))}
        </div>
        <div className="button-container">
          <button id="generate-btn" onClick={generateTOC}>
            Generate
          </button>
          <button id="save-docx-btn" onClick={saveDOCX}>
            Save as DOCX
          </button>
          <button id="print-btn" onClick={printTOC}>
            Print
          </button>
        </div>
        <div
          className="print-options"
          style={{
            display: showPreview ? "flex" : "none",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Paper Size:
            </label>
            <select
              id="paper-size"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              style={{
                padding: "5px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <option value="8.5x13">Legal (8.5" x 13")</option>
              <option value="8.5x14">Legal (8.5" x 14")</option>
              <option value="11x17">Tabloid (11" x 17")</option>
              <option value="a4">A4 (210mm x 297mm)</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="preview-section"
        id="preview-section"
        style={{
          display: showPreview ? "block" : "none",
        }}
      >
        <h2>Preview</h2>
        <style>
          {`
                        #toc-preview .toc-page, #toc-preview .part-page {
                            width: ${getPaperDimensions(paperSize).width};
                            height: ${getPaperDimensions(paperSize).height};
                        }
                    `}
        </style>
        <div
          id="toc-preview"
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />
      </div>
    </div>
  );
}

export default App;
