import { jsPDF } from 'jspdf';

export function exportOrderToPDF(ord: any) {
  // Create instance of jsPDF (A4, portrait, mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page width is 210mm, height is 297mm
  const pageWidth = 210;
  
  // Color palette definitions
  const primaryColor = [20, 20, 20]; // Sleek Dark Charcoal
  const accentColor = [212, 175, 55]; // Gold (#D4AF37)
  const lightGrey = [245, 245, 245];
  const borderGrey = [220, 220, 220];
  const textDark = [40, 40, 40];
  const textMuted = [100, 100, 100];

  // Helper to draw horizontal line
  const drawLine = (y: number, color = borderGrey, thickness = 0.2) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(thickness);
    doc.line(15, y, pageWidth - 15, y);
  };

  // --- HEADER SECTION ---
  // Background accent banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 15, pageWidth - 30, 22, 'F');

  // Brand Name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('MILIANA SERVICE INFORMATIQUE', 20, 24);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(230, 230, 230);
  doc.text('Matériel Informatique Haut de Gamme & Accessoires Gaming', 20, 29);

  // Right Aligned Header Box Info
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('FACTURE / BON', pageWidth - 65, 24);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(ord.order_number || `#${ord.id?.substring(0, 8).toUpperCase() || 'CMD'}`, pageWidth - 65, 29);

  // --- METADATA SECTION ---
  let currentY = 46;

  // Invoice date & payment
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Miliana, le :', 15, currentY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const orderDate = ord.created_at ? new Date(ord.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
  doc.text(orderDate, 34, currentY);

  // Payment method
  doc.setFont('Helvetica', 'bold');
  doc.text('Moyen de Paiement :', 95, currentY);
  doc.setFont('Helvetica', 'normal');
  doc.text('Paiement à la livraison / Virement', 130, currentY);

  currentY += 8;
  drawLine(currentY - 3, [235, 235, 235]);

  // --- PARTNERS DECORATION ---
  // Left: Issuer Info
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('FOURNISSEUR :', 15, currentY);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Miliana Service Informatique', 15, currentY + 5);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Miliana, Aïn Defla, Algérie', 15, currentY + 9);
  doc.text('Tél : +213 (0) 550 00 00 00', 15, currentY + 13);
  doc.text('Email : contact@miliana-service.com', 15, currentY + 17);

  // Right: Client Info
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('FACTURÉ À :', 115, currentY);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(ord.customer_name || 'Client Individuel', 115, currentY + 5);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Tél : ${ord.customer_phone || 'Non renseigné'}`, 115, currentY + 9);
  doc.text(`Email : ${ord.customer_email || 'Non fourni'}`, 115, currentY + 13);
  
  // Multi-line address wrapping block
  const rawAddress = `${ord.shipping_address || ''} (${ord.wilaya || ''})`;
  const splitAddress = doc.splitTextToSize(rawAddress, 80);
  doc.text('Livraison : ', 115, currentY + 17);
  let addrY = currentY + 17;
  splitAddress.forEach((line: string, index: number) => {
    doc.text(line, 131, addrY + (index * 4));
  });

  currentY += 28 + (splitAddress.length * 4);
  drawLine(currentY - 3, [210, 210, 210], 0.4);

  // --- TABLE OF ITEMS ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DÉTAIL DE LA COMMANDE', 15, currentY);

  currentY += 5;

  // Header banner for Table
  doc.setFillColor(240, 240, 240);
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('N°', 18, currentY + 5.5);
  doc.text('Désignation de l\'article', 28, currentY + 5.5);
  doc.text('Marque', 105, currentY + 5.5);
  doc.text('Qté', 130, currentY + 5.5);
  doc.text('Prix Unit. (DZD)', 142, currentY + 5.5);
  doc.text('Total (DZD)', 175, currentY + 5.5);

  currentY += 8;

  // Draw Items rows
  const items = ord.items || [];
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);

  items.forEach((item: any, idx: number) => {
    // Zebra background
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
    }
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text((idx + 1).toString(), 18, currentY + 5.5);
    
    // Wrap product name if too long
    const prodName = item.products?.name || "Article sans titre";
    const wrappedName = doc.splitTextToSize(prodName, 72);
    doc.text(wrappedName[0] || '', 28, currentY + 5.5);

    doc.text(item.products?.brand || 'MSI', 105, currentY + 5.5);
    doc.text(item.quantity?.toString() || '1', 132, currentY + 5.5);
    
    const unitPrice = item.price_dzd || 0;
    doc.text(unitPrice.toLocaleString('fr-FR'), 142, currentY + 5.5);
    
    const rowTotal = unitPrice * (item.quantity || 1);
    doc.text(rowTotal.toLocaleString('fr-FR'), 175, currentY + 5.5);

    // If product name wrapped, adjust row height slightly or just keep clean spacing
    currentY += 8;
  });

  drawLine(currentY, [210, 210, 210], 0.4);
  currentY += 6;

  // --- TOTALS AREA ---
  const boxX = pageWidth - 90;
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setFillColor(252, 252, 252);
  doc.rect(boxX, currentY, 75, 26, 'FD');

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Sous-total :', boxX + 4, currentY + 6);
  doc.text('Frais de livraison :', boxX + 4, currentY + 12);
  
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('TOTAL NET (DZD) :', boxX + 4, currentY + 20);

  // Values
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${(ord.total_dzd || 0).toLocaleString('fr-FR')} DZD`, boxX + 42, currentY + 6);
  doc.text('Inclus (Alger Express)', boxX + 42, currentY + 12);
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${(ord.total_dzd || 0).toLocaleString('fr-FR')} DZD`, boxX + 42, currentY + 20);

  // --- STATUTES BADGESS ---
  // Payments / Shipments
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Statut du paiement :', 15, currentY + 6);
  
  if (ord.payment_status === 'paid') {
    doc.setFillColor(224, 245, 233); // green bg
    doc.rect(53, currentY + 2.5, 18, 5, 'F');
    doc.setTextColor(30, 115, 60); // green txt
    doc.setFontSize(7.5);
    doc.text('PAYÉ', 57, currentY + 6.2);
  } else {
    doc.setFillColor(254, 243, 199); // amber bg
    doc.rect(53, currentY + 2.5, 24, 5, 'F');
    doc.setTextColor(180, 85, 10); // amber txt
    doc.setFontSize(7.5);
    doc.text('EN ATTENTE', 55, currentY + 6.2);
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Statut d\'expédition :', 15, currentY + 15);

  const statusStr = (ord.order_status || 'pending').toLowerCase();
  if (statusStr === 'delivered' || statusStr === 'completed') {
    doc.setFillColor(224, 245, 233); // green bg
    doc.rect(53, currentY + 11.5, 18, 5, 'F');
    doc.setTextColor(30, 115, 60);
    doc.setFontSize(7.5);
    doc.text('LIVRÉ', 57, currentY + 15.2);
  } else if (statusStr === 'cancelled') {
    doc.setFillColor(254, 226, 226); // red bg
    doc.rect(53, currentY + 11.5, 18, 5, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(7.5);
    doc.text('ANNULÉ', 55, currentY + 15.2);
  } else {
    doc.setFillColor(239, 246, 255); // blue bg
    doc.rect(53, currentY + 11.5, 18, 5, 'F');
    doc.setTextColor(29, 78, 216);
    doc.setFontSize(7.5);
    doc.text('EN COURS', 54.5, currentY + 15.2);
  }

  currentY += 32;

  // Signatures spaces
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Cachet de l\'entreprise & Signature :', 15, currentY);
  
  doc.setDrawColor(230, 230, 230);
  doc.rect(15, currentY + 3, 50, 18);

  // Footer text
  const footerY = 285;
  drawLine(footerY - 4, [235, 235, 235], 0.2);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('Miliana Service Informatique - Vous servir est notre devoir !', 15, footerY);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Document généré électroniquement - Valable pour facturation et livraison.', pageWidth - 105, footerY);

  // Save PDF
  const filename = `MSI_Facture_${ord.order_number || ord.id?.substring(0,8) || 'CMD'}.pdf`;
  doc.save(filename);
}
