const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputDir = path.join(__dirname, 'sample_statutory_docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ----------------------------------------------------------------------------
// 1. Structural Stability Certificate (IS 456:2000, IS 1893:2016)
// ----------------------------------------------------------------------------
function generateStructuralStabilityPDF() {
  const docPath = path.join(outputDir, 'Structural_Stability_Certificate_IS456_Chartered_Engineer.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(docPath);
  doc.pipe(stream);

  // Border & Header
  doc.rect(20, 20, 555, 802).lineWidth(1.5).strokeColor('#1a2a42').stroke();
  doc.rect(23, 23, 549, 796).lineWidth(0.5).strokeColor('#0d7a6b').stroke();

  // Header
  doc.fontSize(16).fillColor('#1a2a42').font('Helvetica-Bold').text('FORM 1-A / FORM OF CERTIFICATE OF STRUCTURAL STABILITY', 40, 45, { align: 'center' });
  doc.fontSize(9).fillColor('#64748b').font('Helvetica').text('(Prescribed under Rule 3-A of the Factories Rules / MIDC Development Control Regulations)', { align: 'center' });
  doc.moveDown(0.5);

  doc.fontSize(10).fillColor('#0d7a6b').font('Helvetica-Bold').text('OFFICE OF CHARTERED STRUCTURAL & CIVIL CONSULTING ENGINEERS', { align: 'center' });
  doc.fontSize(8.5).fillColor('#334155').font('Helvetica').text('IEI & PWD Reg. No.: CE/STR/41890/MH · Lic. Structural Engineer No. LSE-9014', { align: 'center' });
  doc.moveDown(0.8);

  // Divider
  doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.8);

  // Document Info Table
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0f172a');
  doc.text('Certificate Reference ID: ', 40, doc.y, { continued: true }).font('Helvetica').text('STR-MH-2024-88912');
  doc.font('Helvetica-Bold').text('Date of Inspection & Testing: ', 340, doc.y - 10, { continued: true }).font('Helvetica').text('14-Sep-2024');
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text('Industrial Premises / Unit: ', 40, doc.y, { continued: true }).font('Helvetica').text('Plot No. E-42/2, Chakan Industrial Area Phase-II, MIDC Pune 410501');
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('Applicant Company: ', 40, doc.y, { continued: true }).font('Helvetica').text('Apex Precision Engineering Pvt. Ltd.');
  doc.moveDown(1);

  // Technical Assessment Block
  doc.fontSize(10).fillColor('#1a2a42').font('Helvetica-Bold').text('I. TECHNICAL DESIGN SPECIFICATIONS & CODE COMPLIANCE:');
  doc.moveDown(0.4);

  const specs = [
    ['Building Structure Typology', 'Industrial RCC Framed Heavy Factory Shed with PEB Metal Roof'],
    ['Structural Concrete Design Code', 'IS 456:2000 (Plain & Reinforced Concrete Code of Practice)'],
    ['Earthquake & Seismic Design Code', 'IS 1893 (Part 1):2016 · Certified for Seismic Zone III (Z = 0.16)'],
    ['Design Live Load on Shopfloor', '750 kg/m² (7.5 kN/m²) for Heavy Machinery & Forklift Movement'],
    ['Design Wind Speed & Pressure', 'IS 875 (Part 3):2015 · Basic Wind Speed Vb = 39 m/s (p = 0.91 kN/m²)'],
    ['Geo-Technical Soil Investigation', 'Safe Bearing Capacity (SBC) = 280 kN/m² at 2.50m foundation depth'],
    ['RCC Foundation Footing Details', 'Isolated Trapezoidal RCC Footings on Hard Basalt Stratum (M30 Concrete)'],
    ['Maximum Deflection Observed', 'Under 1/500 of span, strictly within allowable limits of IS:456 Table 6']
  ];

  specs.forEach(([key, val]) => {
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0d7a6b').text(`• ${key}: `, 50, doc.y, { continued: true });
    doc.font('Helvetica').fillColor('#1e293b').text(val);
    doc.moveDown(0.25);
  });

  doc.moveDown(0.8);
  doc.fontSize(10).fillColor('#1a2a42').font('Helvetica-Bold').text('II. STATUTORY CERTIFICATION & SAFETY UNDERTAKING:');
  doc.moveDown(0.4);

  doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(
    'I hereby certify that I have thoroughly inspected the civil plans, foundation drawings, structural frame calculations, and material test certificates for the manufacturing unit situated at Plot E-42/2, Chakan Industrial Area Phase-II. ' +
    'The reinforced concrete structures, machinery plinths, gantry girders, and overhead steel trusses have been designed and constructed strictly in accordance with Bureau of Indian Standards (IS 456:2000, IS 1893:2016, IS 875 Parts 1-3). ' +
    'The building is structurally stable, safe for its designated industrial manufacturing operations, and capable of sustaining all imposed dead loads, dynamic machinery live loads, and seismic forces.',
    50, doc.y, { align: 'justify', lineGap: 2.5, width: 495 }
  );

  doc.moveDown(1.5);

  // Engineer Seal & Signature
  const sigY = doc.y + 10;
  doc.rect(40, sigY, 230, 85).lineWidth(0.8).strokeColor('#cbd5e1').stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a2a42').text('GOVT. CHARTERED STRUCTURAL ENGINEER', 48, sigY + 8);
  doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text('Er. Rajeshwar K. Deshmukh, M.Tech (Structures), FIE', 48, sigY + 22);
  doc.text('Chartered Engineer (India) — Registration No. CE/STR/41890/MH', 48, sigY + 34);
  doc.text('DISH Competent Person Authorization No. DISH/CP/PUN/2021/412', 48, sigY + 46);
  doc.fillColor('#0d7a6b').font('Helvetica-Bold').text('✓ Digitally Signed & Stamped · Valid for Statutory Filing', 48, sigY + 62);

  doc.rect(305, sigY, 230, 85).lineWidth(0.8).strokeColor('#cbd5e1').stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a2a42').text('OFFICIAL MUNICIPAL / MIDC SCRUTINY SEAL', 313, sigY + 8);
  doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text('Town Planning & Civil Engineering Wing', 313, sigY + 22);
  doc.text('MIDC Division-II, Pune · Government of Maharashtra', 313, sigY + 34);
  doc.text('AutoDCR Scrutiny Validation: PASSED (NBC 2016 Compliant)', 313, sigY + 46);
  doc.fillColor('#059669').font('Helvetica-Bold').text('✓ Verified for Building Plan Sanction (Commencement Cert)', 313, sigY + 62);

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

// ----------------------------------------------------------------------------
// 2. Architectural Site Elevation & Cross-Section Blueprint (AutoDCR & NBC 2016)
// ----------------------------------------------------------------------------
function generateArchitecturalBlueprintPDF() {
  const docPath = path.join(outputDir, 'Architectural_Site_Elevation_CrossSection_Blueprint.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  const stream = fs.createWriteStream(docPath);
  doc.pipe(stream);

  // Border & Header
  doc.rect(20, 20, 802, 555).lineWidth(1.5).strokeColor('#1a2a42').stroke();
  doc.rect(23, 23, 796, 549).lineWidth(0.5).strokeColor('#0d7a6b').stroke();

  // Title Titleblock
  doc.fontSize(15).fillColor('#1a2a42').font('Helvetica-Bold').text('ARCHITECTURAL SITE PLAN, ELEVATIONS & CROSS-SECTION SCHEDULE', 40, 38, { align: 'center' });
  doc.fontSize(9).fillColor('#0d7a6b').font('Helvetica-Bold').text('Prepared in accordance with National Building Code (NBC 2016 Part 3) & MIDC Industrial DCR Norms', { align: 'center' });
  doc.moveDown(0.5);

  // Divider
  doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(802, doc.y).stroke();
  doc.moveDown(0.6);

  // Left Column: Area Statement & FSI Calculations
  const leftX = 40;
  let curY = doc.y;
  doc.fontSize(10).fillColor('#1a2a42').font('Helvetica-Bold').text('I. STATUTORY FSI & AREA STATEMENT (1:100 SCALE):', leftX, curY);
  curY += 16;

  const areaTable = [
    ['Total Industrial Plot Area', '8,400.00 sq. m.', '100.00% (MIDC Allotted Area)'],
    ['Permissible Floor Space Index (FSI)', '1.00', '8,400.00 sq. m. Max Permissible'],
    ['Proposed Factory Ground Floor Built-up Area', '3,234.00 sq. m.', 'Machinery & Shopfloor Area'],
    ['Proposed Mezzanine / Admin Office Built-up Area', '966.00 sq. m.', 'Administrative & Quality Lab Area'],
    ['Total Proposed Built-up Area (Gross FSI)', '4,200.00 sq. m.', 'FSI Utilized = 0.50 (Within Limit)'],
    ['Ground Coverage Percentage', '3,234.00 sq. m.', '38.50% (Permissible Max: 50.00%)'],
    ['Paved Internal Driveways & Setbacks', '2,850.00 sq. m.', 'Heavy Fire Tender Heavy Duty Paver'],
    ['Green Landscape & Open Ecology Buffer', '2,316.00 sq. m.', '27.57% (Mandatory Min: 10.00%)']
  ];

  areaTable.forEach(([item, val, note]) => {
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#0f172a').text(item, leftX, curY, { width: 170 });
    doc.font('Helvetica-Bold').fillColor('#0d7a6b').text(val, leftX + 175, curY, { width: 95 });
    doc.font('Helvetica').fillColor('#475569').text(note, leftX + 275, curY, { width: 130 });
    curY += 13;
  });

  // Right Column: Setbacks, Heights & Egress Schedule
  const rightX = 460;
  let rightY = doc.y - 120;
  doc.fontSize(10).fillColor('#1a2a42').font('Helvetica-Bold').text('II. MARGINAL SETBACKS & EGRESS SCHEDULE:', rightX, rightY);
  rightY += 16;

  const setbackTable = [
    ['Front Marginal Road Setback', '9.00 meters', 'Required: Min 6.00m (Passed ✓)'],
    ['Rear Marginal Open Setback', '6.00 meters', 'Required: Min 4.50m (Passed ✓)'],
    ['Side-1 Marginal Open Setback (East)', '6.00 meters', 'Required: Min 4.50m (Passed ✓)'],
    ['Side-2 Marginal Open Setback (West)', '6.00 meters', 'Required: Min 4.50m (Passed ✓)'],
    ['Factory Clear Eaves Height', '8.50 meters', 'Peak Ridge Height = 10.80 meters'],
    ['Main Ingress / Egress Gate Width', '6.00 meters', 'Required: Min 5.00m (Passed ✓)'],
    ['Staircase Enclosure Clear Width', '1.80 meters', 'Required: Min 1.50m as per NBC'],
    ['Off-Street Parking Equivalent (ECS)', '35 ECS + 4 HGV', 'Heavy Goods Vehicle Bays Provided']
  ];

  setbackTable.forEach(([item, val, note]) => {
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#0f172a').text(item, rightX, rightY, { width: 165 });
    doc.font('Helvetica-Bold').fillColor('#0d7a6b').text(val, rightX + 170, rightY, { width: 75 });
    doc.font('Helvetica').fillColor('#475569').text(note, rightX + 250, rightY, { width: 120 });
    rightY += 13;
  });

  // Bottom Title Block
  const btmY = 445;
  doc.rect(40, btmY, 762, 95).lineWidth(1).strokeColor('#cbd5e1').stroke();
  
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#1a2a42').text('PROJECT: INDUSTRIAL MANUFACTURING FACILITY FOR APEX PRECISION ENGINEERING PVT LTD', 50, btmY + 8);
  doc.fontSize(8).font('Helvetica').fillColor('#334155').text('LOCATION: PLOT NO. E-42/2, CHAKAN INDUSTRIAL AREA PHASE-II, TALUKA KHED, DISTRICT PUNE 410501', 50, btmY + 20);

  doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(50, btmY + 34).lineTo(790, btmY + 34).stroke();

  doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#0f172a');
  doc.text('DRAWING NUMBER: APEX/MIDC/ARCH/2024/01-R2', 50, btmY + 42);
  doc.text('SCALE: 1:100 @ A1 (1:200 @ A4)', 50, btmY + 54);
  doc.text('DATE: 18-AUG-2024 · CAD FILE: AUTODCR_E42_2.DXF', 50, btmY + 66);
  doc.fillColor('#0d7a6b').text('STATUS: SANCTIONED / APPROVED COMMENCEMENT DRAWING', 50, btmY + 78);

  doc.fillColor('#0f172a');
  doc.text('REGISTERED ARCHITECT & TOWN PLANNER:', 460, btmY + 42);
  doc.font('Helvetica').fillColor('#334155').text('Ar. Sneha V. Kulkarni, B.Arch, AIIA · CoA Reg: CA/2012/58914', 460, btmY + 54);
  doc.text('Authorized AutoDCR Scrutiny Architect, MIDC Town Planning Cell', 460, btmY + 66);
  doc.font('Helvetica-Bold').fillColor('#059669').text('✓ Formally Approved for Building Plan Sanction & Occupancy', 460, btmY + 78);

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

// ----------------------------------------------------------------------------
// 3. Registered MIDC Lease Deed & Demarcation Certificate
// ----------------------------------------------------------------------------
function generateLandLeaseDeedPDF() {
  const docPath = path.join(outputDir, 'MIDC_Registered_Land_Lease_Deed_Demarcation_Order.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(docPath);
  doc.pipe(stream);

  // Border & Header
  doc.rect(20, 20, 555, 802).lineWidth(1.5).strokeColor('#1a2a42').stroke();
  doc.rect(23, 23, 549, 796).lineWidth(0.5).strokeColor('#0d7a6b').stroke();

  // Government Header
  doc.fontSize(13).fillColor('#1a2a42').font('Helvetica-Bold').text('MAHARASHTRA INDUSTRIAL DEVELOPMENT CORPORATION (MIDC)', 40, 45, { align: 'center' });
  doc.fontSize(9.5).fillColor('#0d7a6b').font('Helvetica-Bold').text('(A Government of Maharashtra Undertaking)', { align: 'center' });
  doc.fontSize(9).fillColor('#475569').font('Helvetica').text('Office of the Regional Officer, MIDC Pune Region, Udyog Bhavan, Pune 411005', { align: 'center' });
  doc.moveDown(0.6);

  doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.8);

  doc.fontSize(11).fillColor('#1a2a42').font('Helvetica-Bold').text('REGISTERED DEED OF LEASE & LAND ALLOTMENT POSSESSION ORDER', { align: 'center' });
  doc.fontSize(8.5).fillColor('#64748b').font('Helvetica').text('(Under Maharashtra Industrial Development Act 1961 & Transfer of Property Act 1882)', { align: 'center' });
  doc.moveDown(0.8);

  // Table of Allotment Particulars
  const tableData = [
    ['Official Allotment Order No.', 'MIDC/RO(P)/ALLOT/CHAKAN-II/E-42-2/2023/4910'],
    ['Sub-Registrar Registration No.', 'Registration Book No. PNE-IV-8921/2023, Pages 112 to 148'],
    ['Date of Execution & Possession', '24th Day of November, 2023 (Term: 95 Years Continuous Lease)'],
    ['Allottee / Lessee Enterprise', 'Apex Precision Engineering Private Limited (CIN: U28100MH2020PTC349102)'],
    ['Industrial Plot Number', 'Plot No. E-42/2 in Chakan Industrial Area Phase-II (Heavy Engineering Zone)'],
    ['Survey / Cadastral CTS Details', 'Gat No. 184/1A, CTS No. 902, Village Vasuli, Taluka Khed, District Pune'],
    ['Total Demarcated Land Area', '8,400.00 Square Meters (approx. 2.075 Acres)'],
    ['Permitted User Industry', 'Manufacturing of Precision Automotive Components & Industrial Spares'],
    ['Government Stamp Duty Paid', 'GRAS e-Challan No. MH008912401202324E · Stamp Duty ₹4,85,000/- Paid']
  ];

  tableData.forEach(([k, v]) => {
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0d7a6b').text(`• ${k}: `, 45, doc.y, { continued: true });
    doc.font('Helvetica').fillColor('#1e293b').text(v);
    doc.moveDown(0.3);
  });

  doc.moveDown(0.6);
  doc.fontSize(10).fillColor('#1a2a42').font('Helvetica-Bold').text('CADASTRAL LAND DEMARCATION & BOUNDARY DESCRIPTION:');
  doc.moveDown(0.3);

  const bounds = [
    ['North Boundary', 'Adjoining 30.00-meter-wide MIDC Main Spine Arterial Road with dedicated stormwater drains.'],
    ['South Boundary', 'Bordering Industrial Plot No. E-43 (Demarcated Boundary Pillar No. BP-12 to BP-14).'],
    ['East Boundary', 'Adjoining 18.00-meter-wide Internal Sector Access Road and 11kV Electric Power Substation corridor.'],
    ['West Boundary', 'Bordering Industrial Plot No. E-42/1 (Demarcated Boundary Pillar No. BP-08 to BP-11).']
  ];

  bounds.forEach(([dir, desc]) => {
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0f172a').text(`${dir}: `, 50, doc.y, { continued: true });
    doc.font('Helvetica').fillColor('#475569').text(desc);
    doc.moveDown(0.2);
  });

  doc.moveDown(0.6);
  doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(
    'The Lessee has paid the full premium consideration amount and execution charges. Actual physical possession of the demarcated plot has been handed over on 24-Nov-2023. ' +
    'The Lessee is fully authorized to construct industrial buildings and factory infrastructure subject to obtaining Building Plan Sanction and Commencement Certificate from the Executive Engineer (Town Planning), MIDC Pune.',
    45, doc.y, { align: 'justify', lineGap: 2, width: 505 }
  );

  doc.moveDown(1.2);

  // Signatures
  const sigY = doc.y + 10;
  doc.rect(40, sigY, 230, 80).lineWidth(0.8).strokeColor('#cbd5e1').stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a2a42').text('FOR MAHARASHTRA INDUSTRIAL DEV. CORP.', 48, sigY + 8);
  doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text('Regional Officer / Area Manager', 48, sigY + 22);
  doc.text('MIDC Pune Division · Government of Maharashtra', 48, sigY + 34);
  doc.fillColor('#0d7a6b').font('Helvetica-Bold').text('✓ Official Allotment Seal & Demarcation Attached', 48, sigY + 54);

  doc.rect(305, sigY, 230, 80).lineWidth(0.8).strokeColor('#cbd5e1').stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a2a42').text('FOR APEX PRECISION ENGINEERING PVT LTD', 313, sigY + 8);
  doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text('Authorised Signatory / Managing Director', 313, sigY + 22);
  doc.text('DIN: 08912401 · Board Resolution Dated 10-Nov-2023', 313, sigY + 34);
  doc.fillColor('#059669').font('Helvetica-Bold').text('✓ Registered Tenant & Demarcation Accepted', 313, sigY + 54);

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

// ----------------------------------------------------------------------------
// Run Generator
// ----------------------------------------------------------------------------
async function main() {
  console.log('[1/3] Generating Structural Stability Certificate PDF...');
  await generateStructuralStabilityPDF();

  console.log('[2/3] Generating Architectural Blueprint PDF...');
  await generateArchitecturalBlueprintPDF();

  console.log('[3/3] Generating MIDC Registered Lease Deed PDF...');
  await generateLandLeaseDeedPDF();

  console.log('✅ All 3 statutory PDFs generated successfully in:', outputDir);
}

main().catch(err => {
  console.error('Error generating statutory docs:', err);
  process.exit(1);
});
