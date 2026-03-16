import { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, BorderStyle, convertInchesToTwip, LeaderType, VerticalAlign } from 'docx';
import { saveAs } from 'file-saver';
import { generateLetter, calculateTitleFontSize, calculateContentFontSize } from './tocUtils';

export const generateDOCX = async (parts, paperSize = '8.5x13', borderOption = '3px') => {
    console.log('Starting DOCX generation with:', { parts, paperSize, borderOption });
    
    // Filter out parts with empty titles
    const validParts = parts.filter(p => p && p.title?.trim());
    console.log('Valid parts:', validParts);
    
    if (validParts.length === 0) {
        alert('Please enter at least one part title.');
        return;
    }

    // Get border size in Word units (eighth-points)
    const getBorderSize = (borderOption) => {
        switch(borderOption) {
            case '3px': return 12; // 3px ≈ 12 eighth-points for visible border
            case '2px': return 8;  // 2px ≈ 8 eighth-points
            case '1px': return 4;  // 1px ≈ 4 eighth-points
            default: return 0;
        }
    };
    
    // Get paper dimensions
    const getPaperDimensions = (paperSize) => {
        switch(paperSize) {
            case '8.5x13': return { width: 8.5, height: 13 };
            case '8.5x11': return { width: 8.5, height: 11 };
            case '8.5x14': return { width: 8.5, height: 14 };
            case '11x17': return { width: 11, height: 17 };
            case 'a4': return { width: 8.27, height: 11.69 };
            default: return { width: 8.5, height: 13 };
        }
    };

    // Get border size
    const borderSize = getBorderSize(borderOption);
    
    // Use fixed margins to match HTML preview (0.75in margins)
    const marginInInches = 0.75;
    const marginTwips = convertInchesToTwip(marginInInches);

    // Create sections array - one section per page
    const sections = [];

    try {
        // TOC Section - create separate section
        const tocChildren = [];
        
        // TOC Title - reduced font size
        tocChildren.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'TABLE OF CONTENTS',
                        bold: true,
                        size: calculateTitleFontSize(validParts.length) * 1.5, // Reduced from *2
                        allCaps: true,
                        font: 'Arial',
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 } // Reduced from 800
            })
        );

        // TOC Items with dot leaders
        validParts.forEach((part, index) => {
            const letter = generateLetter(index);
            
            // Limit title length to prevent tab stop issues (updated to 95 characters)
            const maxLength = 95;
            const title = part.title.length > maxLength
                ? part.title.substring(0, maxLength) + "..."
                : part.title;
            
            // Handle multi-line titles by splitting on newlines
            const titleLines = title.split('\n');
            
            tocChildren.push(
                new Paragraph({
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: convertInchesToTwip(7),
                            leader: LeaderType.DOT
                        }
                    ],
                    indent: {
                        right: 200
                    },
                    spacing: { after: 100 }, // Reduced from 120
                    children: [
                        ...titleLines.map((line, index) => 
                            new TextRun({
                                text: index === 0 ? line : " " + line,
                                bold: true,
                                size: calculateContentFontSize(validParts.length) * 1.5, // Reduced from *2
                                font: "Arial",
                                break: index > 0 ? 1 : 0
                            })
                        ),
                        new TextRun({
                            text: "\t"
                        }),
                        new TextRun({
                            text: letter,
                            bold: true,
                            size: calculateContentFontSize(validParts.length) * 1.5, // Reduced from *2
                            font: "Arial"
                        })
                    ]
                })
            );
        });

        // Add TOC section with borders
        sections.push({
            properties: {
                page: {
                    size: {
                        width: convertInchesToTwip(getPaperDimensions(paperSize).width),
                        height: convertInchesToTwip(getPaperDimensions(paperSize).height),
                        orientation: 'portrait',
                    },
                    margin: {
                        top: marginTwips,
                        bottom: marginTwips,
                        left: marginTwips,
                        right: marginTwips,
                    },
                },
                pageBorders: borderOption !== 'none' ? {
                    display: 'allPages',
                    offsetFrom: 'page',
                    top: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                    bottom: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                    left: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                    right: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                } : undefined,
                verticalAlign: 'center',
            },
            children: tocChildren
        });

        // Part Pages - create separate section for each part
        validParts.forEach((part, index) => {
            const letter = generateLetter(index);
            
            const partChildren = [];
            
            // Part title with multi-line support - smaller font
            const titleLines = part.title.split('\n');
            partChildren.push(
                new Paragraph({
                    children: titleLines.map((line, index) => 
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 80, // 40px = 80 half-points (reduced from 60px)
                            allCaps: true,
                            font: 'Arial',
                            break: index > 0 ? 1 : 0
                        })
                    ),
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 } // Reduced spacing
                })
            );

            // Filter out blank annexes
            if (part.annexes && part.annexes.length > 0) {
                const validAnnexes = part.annexes.filter(annex => 
                    annex && (annex.description && annex.description.trim() || annex.number && annex.number.trim())
                );
                
                if (validAnnexes.length > 0) {
                    // Annexes header - smaller font
                    partChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    bold: true,
                                    size: 24, // 12px = 24 half-points (reduced from 16px)
                                    allCaps: true,
                                    font: 'Arial',
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 600, after: 200 } // Reduced spacing
                        })
                    );

                    // Annexes items with multi-line support - smaller font and bold titles
                    validAnnexes.forEach(annex => {
                        const annexText = annex.number 
                            ? `${annex.type} ${annex.number} – ${annex.description}`
                            : `${annex.type} – ${annex.description}`;
                        
                        // Split description for multi-line support
                        const descriptionLines = annex.description.split('\n');
                        const prefix = annex.number ? `${annex.type} ${annex.number} – ` : `${annex.type} – `;
                        
                        partChildren.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: prefix,
                                        bold: true,
                                        size: 20, // 10px = 20 half-points (reduced from 14px)
                                        font: 'Arial',
                                    }),
                                    ...descriptionLines.map((line, index) => 
                                        new TextRun({
                                            text: index === 0 ? line : " " + line,
                                            bold: false, // Description should be normal weight
                                            size: 20, // 10px = 20 half-points (reduced from 14px)
                                            font: 'Arial',
                                            break: index > 0 ? 1 : 0
                                        })
                                    )
                                ],
                                spacing: { after: 150 } // Reduced spacing
                            })
                        );
                    });
                }
            }

            // Add part section with borders
            sections.push({
                properties: {
                    page: {
                        size: {
                            width: convertInchesToTwip(getPaperDimensions(paperSize).width),
                            height: convertInchesToTwip(getPaperDimensions(paperSize).height),
                            orientation: 'portrait',
                        },
                        margin: {
                            top: marginTwips,
                            bottom: marginTwips,
                            left: marginTwips,
                            right: marginTwips,
                        },
                    },
                    pageBorders: borderOption !== 'none' ? {
                        display: 'allPages',
                        offsetFrom: 'page',
                        zOrder: 'front',
                        top: { style: BorderStyle.SINGLE, size: 24, color: '000000' },
                        bottom: { style: BorderStyle.SINGLE, size: 24, color: '000000' },
                        left: { style: BorderStyle.SINGLE, size: 24, color: '000000' },
                        right: { style: BorderStyle.SINGLE, size: 24, color: '000000' },
                    } : undefined,
                    verticalAlign: 'center',
                },
                children: partChildren
            });
        });

        // Create document
        console.log('Creating document with sections count:', sections.length);
        const doc = new Document({
            sections: sections
        });

        // Generate and save document
        console.log('Starting document packing...');
        const blob = await Packer.toBlob(doc);
        console.log('Document packed as blob, size:', blob.size);
        saveAs(blob, 'Table_of_Contents.docx');
        console.log('Document saved successfully');
    } catch (error) {
        console.error('Error building document content:', error);
        alert('Error building document content: ' + error.message);
        console.error('Error generating DOCX:', error);
        alert('Error generating DOCX file: ' + error.message);
    }
};
