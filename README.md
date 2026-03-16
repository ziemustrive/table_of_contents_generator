# Table of Contents Generator

A professional Table of Contents generator for legal documents with dynamic font sizing, multiple paper sizes, and comprehensive export options.

## Features

- **Multiple Paper Sizes**: Support for Legal (8.5" x 13"), Legal (8.5" x 14"), Tabloid (11" x 17"), and A4 (210mm x 297mm)
- **Dynamic Font Sizing**: Automatically adjusts font sizes based on number of parts for optimal layout
- **Automatic Part Lettering**: Parts are automatically lettered (A, B, C, AA, BB, etc.)
- **Dot Leaders**: Reliable dot leaders between part titles and letters that never disappear
- **Multi-Paragraph Support**: Support for multi-paragraph part titles and annex descriptions
- **Annex/Exhibit Management**: Add and manage annexes for each part with automatic numbering
- **Professional Formatting**: Clean, aligned layout suitable for legal documents
- **Multiple Export Options**: Print-ready TOC and DOCX file generation
- **Auto-Resizing Textareas**: Textareas that automatically adjust height based on content
- **TOC Page Splitting**: Automatic splitting of TOC across multiple pages (A-NN / OO-ZZZ)
- **Consistent Preview**: Print preview matches main preview exactly

## Usage

1. Open the application in a web browser
2. Select paper size from the dropdown menu
3. Enter part titles in the input fields (use Shift+Enter for multiple paragraphs)
4. Click "+" to add more parts or "×" to remove parts
5. Click "Add Annex/Exhibit" to add annexes for each part
6. Click "Generate" to create the TOC
7. Preview the generated TOC in real-time
8. Click "Print" to print the document or "Save as DOCX" to download

## Technical Specifications

### Page Layout
- **Paper Sizes**: Legal (8.5" x 13"), Legal (8.5" x 14"), Tabloid (11" x 17"), A4 (210mm x 297mm)
- **Full black border**: 3px solid black
- **Dynamic margins**: Adjust based on paper size and part count
- **Font family**: Arial throughout

### Dynamic Font Sizing
- **TOC Title**: Scales from 80px to 40px based on part count
- **TOC Content**: Scales from 20px to 8px based on part count
- **Part Titles**: Scales from 20px to 8px based on part count
- **Annex Items**: Scales from 20px to 8px based on part count

### TOC Formatting
- **Title**: "TABLE OF CONTENTS", centered, dynamic sizing, Arial, bold
- **Part entries**: Automatic dot leaders using CSS pseudo-elements
- **Part letters**: Right-aligned, bold (A, B, C, AA, BB, etc.)
- **Multi-line support**: Handles long titles with proper alignment
- **Page splitting**: A-NN on first page, OO-ZZZ on second page for 39+ parts

### Annex/Exhibit Features
- **Automatic numbering**: Annex 1, Annex 2, etc.
- **Multi-paragraph descriptions**: Support for detailed annex descriptions
- **Flexible types**: Support for different annex types (Annex, Exhibit, etc.)
- **Auto-hiding sections**: Annex sections only appear when content exists

### Export Options
- **Print**: Print-optimized CSS with exact preview matching
- **DOCX**: Professional Word document with proper formatting
- **Consistent output**: Both formats use identical styling and layout

## File Structure

```
generatortoc/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── App.js               # Main React component
│   ├── components/
│   │   ├── PartInput.js     # Part input component
│   │   └── AnnexInput.js    # Annex input component
│   ├── utils/
│   │   ├── documentGenerator.js  # HTML generation
│   │   ├── docxGenerator.js      # DOCX generation
│   │   └── tocUtils.js           # Utility functions
│   ├── styles.css           # CSS styling including print styles
│   └── index.js             # React app entry point
└── README.md                # This documentation
```

## Browser Compatibility

Works in all modern browsers that support:
- React functional components and hooks
- CSS Flexbox and Grid
- CSS Print Media Queries
- JavaScript ES6+
- File download APIs

## Printing Tips

1. Select appropriate paper size from dropdown
2. Set printer to "Actual size" or "100% scale"
3. Ensure margins are set to "None" in printer settings
4. Check print preview before printing
5. Use high-quality print settings for professional documents

## Advanced Features

### Dynamic Font Size Calculation
- **1-10 parts**: Large fonts for maximum readability
- **11-20 parts**: Medium fonts for balanced layout
- **21-30 parts**: Smaller fonts for content fitting
- **31+ parts**: Compact fonts for maximum content

### Multi-Paragraph Support
- **Part titles**: Use Shift+Enter to create multiple paragraphs
- **Annex descriptions**: Support for detailed multi-paragraph content
- **Auto-resizing**: Textareas automatically adjust to content height

### Professional TOC Layout
- **Hanging indentation**: Professional legal document formatting
- **Reliable dot leaders**: Never disappear regardless of title length
- **Consistent alignment**: Letters always align properly
- **Page optimization**: Content fits perfectly on selected paper size

## Example Output

The generated TOC will appear as:

```
              TABLE OF CONTENTS

Complaint with detailed description................................................A
Answer with multiple paragraphs....................................................B
Evidence and exhibits..............................................................C
```

Each line features automatic dot leaders that adjust based on title length, with letters always aligned to the right margin. The system automatically handles multi-line titles and maintains perfect alignment across all content.
