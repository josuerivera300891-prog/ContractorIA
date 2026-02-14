"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Element not found for PDF generation:", elementId);
        return;
    }

    try {
        // Optimize for premium aesthetics (higher scale for crispness)
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        if (filename) {
            pdf.save(`${filename}.pdf`);
        }

        // Return base64 if needed for upload, otherwise save
        return pdf.output("datauristring").split(",")[1];
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return null;
    }
}
