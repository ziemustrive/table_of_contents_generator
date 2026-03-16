import {
  calculateTitleFontSize,
  calculateContentFontSize,
  calculateDynamicPadding,
  generateLetter,
  escapeHtml,
  getPaperDimensions,
} from "./tocUtils";

const formatTitleWithBreaks = (title) => {
  return escapeHtml(title).replace(/\n/g, "<br>");
};

export const generateCompleteDocument = (
  parts,
  paperSize = "letter",
  borderOption = "3px",
  marginOption = "0.75in",
) => {
  let html = "";

  // Get paper dimensions
  const paperDimensions = getPaperDimensions(paperSize);

  // Calculate dynamic font sizes and padding based on number of parts
  const titleFontSize = calculateTitleFontSize(parts.length);
  const contentFontSize = calculateContentFontSize(parts.length);
  const dynamicPadding = calculateDynamicPadding(parts.length);

  // Determine if TOC should split into two pages
  const shouldSplitTOC = parts.length > 38; // Split for 39+ parts (NN to ZZZ range)
  const firstPageEndIndex = shouldSplitTOC ? 37 : parts.length - 1; // A-MM (index 0-37) on first page

  // Generate TOC page(s)
  for (let page = 0; page < (shouldSplitTOC ? 2 : 1); page++) {
    const startIndex = page === 0 ? 0 : 38; // Page 1: start at 0, Page 2: start at 38
    const endIndex = page === 0 ? firstPageEndIndex + 1 : parts.length; // Page 1: end at 37, Page 2: end at end

    html += `<div class="toc-page">`;
    html += '<div class="toc-content-wrapper">';

    // Only show title on first TOC page
    if (page === 0) {
      html += `<div class="toc-title" style="font-size: ${titleFontSize}px;">TABLE OF CONTENTS</div>`;
    } else {
      html += `<div class="toc-title" style="font-size: ${titleFontSize - 30}px;">TABLE OF CONTENTS (Continuation)</div>`;
    }

    html += `<div class="toc-content" style="font-size: ${contentFontSize}px !important; font-weight: 500 !important;">`;

    // Add parts for this page
    for (let i = startIndex; i < endIndex; i++) {
      const part = parts[i];
      const letter = generateLetter(i);
      html += `
                <div class="toc-item">
                    <span class="toc-item-text">${formatTitleWithBreaks(part.title)}</span>
                    <span class="dot-leaders"></span>
                    <span class="toc-item-letter">${letter}</span>
                </div>
            `;
    }

    html += "</div></div></div>";
  }

  // Generate individual Part pages
  parts.forEach((part, index) => {
    const letter = generateLetter(index);

    html += `<div class="part-page">`;
    html += `<div class="part-title">${formatTitleWithBreaks(part.title)}</div>`;

    // Add annexes if any and if they have content
    if (part.annexes && part.annexes.length > 0) {
      // Filter out blank annexes (no description or number)
      const validAnnexes = part.annexes.filter(
        (annex) =>
          annex &&
          ((annex.description && annex.description.trim()) ||
            (annex.number && annex.number.trim())),
      );

      if (validAnnexes.length > 0) {
        html += '<div class="annexes-section">';

        validAnnexes.forEach((annex, annexIndex) => {
          if (annex.number) {
            html += `<div class="annex-item"><strong>${annex.type} ${annex.number}</strong> – ${formatTitleWithBreaks(annex.description)}</div>`;
          } else {
            html += `<div class="annex-item"><strong>${annex.type}</strong> – ${formatTitleWithBreaks(annex.description)}</div>`;
          }
        });

        html += "</div>";
      }
    }

    html += "</div>";
  });

  return html;
};
