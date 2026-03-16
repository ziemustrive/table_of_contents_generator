// Utility functions for TOC generation

export const calculateTitleFontSize = (partCount) => {
  if (partCount <= 10) return 80;
  if (partCount <= 20) return 70;
  if (partCount <= 30) return 60;
  if (partCount <= 50) return 50;
  if (partCount <= 100) return 45;
  return 40;
};

export const calculateContentFontSize = (partCount) => {
  if (partCount <= 10) return 16;
  if (partCount <= 30) return 15;
  if (partCount <= 40) return 14;
  if (partCount <= 50) return 13;
  if (partCount <= 60) return 12;
  if (partCount <= 100) return 11;
  return 10;
};

export const calculateDynamicPadding = (partCount) => {
  if (partCount <= 10) return "1in";
  if (partCount <= 20) return "0.75in";
  if (partCount <= 30) return "0.5in";
  if (partCount <= 50) return "0.4in";
  if (partCount <= 100) return "0.3in";
  return "0.25in";
};

export const generateLetter = (index) => {
  if (index < 26) {
    // A to Z
    return String.fromCharCode(65 + index);
  } else if (index < 52) {
    // AA, BB, CC, etc. up to ZZ
    const letterIndex = index - 26;
    const letter = String.fromCharCode(65 + letterIndex);
    return letter + letter;
  } else {
    // AAA, BBB, CCC, etc. up to ZZZ
    const letterIndex = index - 52;
    const letter = String.fromCharCode(65 + letterIndex);
    return letter + letter + letter;
  }
};

export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const getPaperDimensions = (paperSize) => {
  const dimensions = {
    "8.5x13": { width: "8.5in", height: "13in" },
    "8.5x11": { width: "8.5in", height: "11in" },
    "8.5x14": { width: "8.5in", height: "14in" },
    "11x17": { width: "11in", height: "17in" },
    a4: { width: "210mm", height: "297mm" },
  };

  return dimensions[paperSize] || dimensions["8.5x13"];
};
