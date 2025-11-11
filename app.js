document.addEventListener('DOMContentLoaded', () => {

    // --- DOM-Elemente ---
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const headerRows2Checkbox = document.getElementById('header-rows-2');
    const headerRowHeightInput = document.getElementById('header-row-height');
    const rowHeightInput = document.getElementById('row-height');
    const marginTopInput = document.getElementById('margin-top');
    const marginBottomInput = document.getElementById('margin-bottom');
    const marginLeftInput = document.getElementById('margin-left');
    const marginRightInput = document.getElementById('margin-right');
    const btnGenerate = document.getElementById('btn-generate');
    const dynamicControls = document.getElementById('dynamic-controls');


    const tablePreview = document.getElementById('table-preview');
    const tablePreviewWrapper = document.getElementById('table-preview-wrapper');
    // <-- HINZUFÜGEN
    const layoutSelect = document.getElementById('layout-select');
    const layoutNameInput = document.getElementById('layout-name');
    const btnLoad = document.getElementById('btn-load');
    const btnSave = document.getElementById('btn-save');
    const btnDelete = document.getElementById('btn-delete');
    const printSizeSelect = document.getElementById('print-size');
    const printOrientationSelect = document.getElementById('print-orientation');
    const btnCalcMaxRows = document.getElementById('btn-calc-max-rows');
    const btnPrint = document.getElementById('btn-print');
    const btnMergeCells = document.getElementById('btn-merge-cells');
    const btnUnmergeCell = document.getElementById('btn-unmerge-cell');
    const btnClearMerges = document.getElementById('btn-clear-merges');
    const printStyleSheet = document.getElementById('print-style-sheet');
    const topTableEnableCheckbox = document.getElementById('top-table-enable');
    const topTableControls = document.getElementById('top-table-controls');
    const topRowsInput = document.getElementById('top-rows');
    const topColsInput = document.getElementById('top-cols');
    const topRowHeightInput = document.getElementById('top-row-height');
    const topTablePreview = document.getElementById('top-table-preview');
    const topTablePositionSelect = document.getElementById('top-table-position');
    const bottomTablePreview = document.getElementById('bottom-table-preview');
    const topBgColorInput = document.getElementById('top-bg-color');
    const topFontFamilyInput = document.getElementById('top-font-family');
    const topFontSizeInput = document.getElementById('top-font-size');
    const topFontColorInput = document.getElementById('top-font-color');
    const borderControls = document.getElementById('border-controls');
    const borderTopCheckbox = document.getElementById('border-top');
    const borderRightCheckbox = document.getElementById('border-right');
    const borderBottomCheckbox = document.getElementById('border-bottom');
    const borderLeftCheckbox = document.getElementById('border-left');
    const alignLeftButton = document.getElementById('align-left');
    const alignCenterButton = document.getElementById('align-center');
    const alignRightButton = document.getElementById('align-right');
    // (Design DOM-Elemente)
    const logoSelect = document.getElementById('logo-select');
    const logoHeightInput = document.getElementById('logo-height');
    const logoAlignSelect = document.getElementById('logo-align');
    const logoPreview = document.getElementById('logo-preview'); // Not directly used but defined in prompt
    const printHeaderWrapper = document.getElementById('print-header-wrapper');
    const bgColorPageInput = document.getElementById('bg-color-page');
    const bgColorHeaderInput = document.getElementById('bg-color-header');
    const bgColorDataInput = document.getElementById('bg-color-data');
    const borderWidthInput = document.getElementById('border-width');
    const borderColorInput = document.getElementById('border-color');
    const headerFontFamilyInput = document.getElementById('header-font-family');
    const headerFontSizeInput = document.getElementById('header-font-size');
    const headerFontColorInput = document.getElementById('header-font-color');
    // --- NEU: Import / Export DOM-Elemente ---
    const btnDownload = document.getElementById('btn-download');
    const btnUploadTrigger = document.getElementById('btn-upload-trigger');
    const fileUploadInput = document.getElementById('file-upload');

    // --- API & Konstanten ---
    const API_URL = 'api.php';
    const PAGE_DIMENSIONS_MM = {
        A4: { portrait: { w: 210, h: 297 }, landscape: { w: 297, h: 210 } },
        A5: { portrait: { w: 148, h: 210 }, landscape: { w: 210, h: 148 } },
        A3: { portrait: { w: 297, h: 420 }, landscape: { w: 420, h: 297 } }
    };
    // --- Globaler State ---
    let currentConfig = {};
    let selectionStart = null;
    let selectionEnd = null;
    let selectedTopTableCell = null;
    // --- Helper-Funktion für Live-Updates ---
    function updateConfigAndRender() {
        updateConfigFromDOM();
        renderTable();
    }

    // --- Event Listener ---
    rowsInput.addEventListener('change', updateConfigAndRender);
    colsInput.addEventListener('change', () => {
        updateConfigFromDOM();
        generateDynamicControls(false); // false = Werte beibehalten
        renderTable();
    });
    headerRowHeightInput.addEventListener('change', updateConfigAndRender);
    rowHeightInput.addEventListener('change', updateConfigAndRender);

    headerRows2Checkbox.addEventListener('change', () => {
        updateConfigFromDOM();
        generateDynamicControls(false);
        renderTable();
    });
    printSizeSelect.addEventListener('change', updateConfigAndRender);
    printOrientationSelect.addEventListener('change', updateConfigAndRender);

    marginTopInput.addEventListener('change', updateConfigAndRender);
    marginBottomInput.addEventListener('change', updateConfigAndRender);
    marginLeftInput.addEventListener('change', updateConfigAndRender);
    marginRightInput.addEventListener('change', updateConfigAndRender);

    dynamicControls.addEventListener('input', updateConfigAndRender);
    btnGenerate.addEventListener('click', () => {
        updateConfigFromDOM();
        generateDynamicControls(true); // true = Werte löschen
        renderTable();
    });
    btnCalcMaxRows.addEventListener('click', calculateMaxRows);
    tablePreview.addEventListener('click', handleCellClick);
    btnMergeCells.addEventListener('click', mergeCells);
    btnUnmergeCell.addEventListener('click', unmergeCell);
    btnClearMerges.addEventListener('click', clearMerges);
    btnSave.addEventListener('click', saveLayout);
    btnLoad.addEventListener('click', loadLayout);
    btnDelete.addEventListener('click', deleteLayout);
    btnPrint.addEventListener('click', handlePrint);
    // --- Design-Listener ---
    logoSelect.addEventListener('change', () => { updateConfigAndRender(); updateLogoPreview(); });
    logoHeightInput.addEventListener('change', () => { updateConfigAndRender(); updateLogoPreview(); }); // updateLogoPreview hinzugefügt
    logoAlignSelect.addEventListener('change', () => { updateConfigAndRender(); updateLogoPreview(); });
    // updateLogoPreview hinzugefügt
    bgColorPageInput.addEventListener('input', updateConfigAndRender);
    bgColorHeaderInput.addEventListener('input', updateConfigAndRender);
    bgColorDataInput.addEventListener('input', updateConfigAndRender);
    borderWidthInput.addEventListener('change', updateConfigAndRender);
    borderColorInput.addEventListener('input', updateConfigAndRender);
    headerFontFamilyInput.addEventListener('change', updateConfigAndRender);
    headerFontSizeInput.addEventListener('change', updateConfigAndRender);
    headerFontColorInput.addEventListener('input', updateConfigAndRender);
    // --- NEU: Listener für Import / Export ---
    btnDownload.addEventListener('click', downloadLayout);
    btnUploadTrigger.addEventListener('click', () => fileUploadInput.click());
    // Löst verstecktes Input aus
    fileUploadInput.addEventListener('change', loadLocalFile);
    // Ruft Funktion nach Dateiauswahl auf

    // --- NEU: Helper für einklappbare Fieldsets ---
    function initializeCollapsibleFieldsets() {
        // Event Delegation für alle Klicks auf dem body
        document.body.addEventListener('click', (e) => {
            // Prüfen, ob das geklickte Element (oder ein Elternelement) eine Legende in einem .collapsible Fieldset ist
            const legend = e.target.closest('fieldset.collapsible > legend');
            if (!legend) return; // Klick war woanders

            const fieldset = legend.parentElement;
            if (!fieldset) return;

            // Toggle des data-Attributs
            const isCollapsed = fieldset.dataset.collapsed === 'true';
            fieldset.dataset.collapsed = isCollapsed ? 'false' : 'true';
        });
    }

    // --- Initialisierung ---
    function initialize() {
        const defaultConfig = {
            rows: 10, cols: 4, headerRows: 1, headerRowHeight: '8mm', rowHeight: '10mm',
            headers: ['Überschrift 1', 'Überschrift 2', 'Überschrift 3', 'Überschrift 4'],
            headers2: [], colWidths: ['50mm', '50mm', '50mm', '25mm'], merges: [],



            printSize: 'A4', printOrientation: 'portrait',
            marginTop: '15mm', marginBottom: '15mm', marginLeft: '15mm', marginRight: '15mm',
            // --- NEU: Design Defaults ---
            logoFile: '', logoHeight: '20mm', logoAlign: 'left',
            bgColorPage: '#FFFFFF', bgColorHeader: '#EEEEEE', bgColorData: '#FFFFFF',

            borderWidth: '1px', borderColor:
            '#000000',

            headerFontFamily: 'Arial', headerFontSize: '12pt', headerFontColor: '#000000',
            headerAligns: ['left', 'left', 'left', 'left'],
            topTable: {
                enabled: false,
                rows: 3,
                cols: 3,
                rowHeight: '8mm',
                position: 'top',
                bgColor: '#FFFFFF',
                fontFamily: 'Arial',
                fontSize: '12pt',
                fontColor: '#000000',
                cellData: [],
                borders: {},
                aligns: {}
            }
        };
        applyConfig(defaultConfig);
        loadLayoutList(); // Layouts aus DB laden
        loadLogoList(); // Logos aus Ordner laden
        initializeCollapsibleFieldsets(); // NEU: Klapp-Funktion aktivieren

        topTableEnableCheckbox.addEventListener('change', () => {
            topTableControls.style.display = topTableEnableCheckbox.checked ? 'block' : 'none';
            updateConfigAndRender();
        });
        topRowsInput.addEventListener('change', updateConfigAndRender);
        topColsInput.addEventListener('change', updateConfigAndRender);
        topRowHeightInput.addEventListener('change', updateConfigAndRender);
        topTablePositionSelect.addEventListener('change', updateConfigAndRender);
        topBgColorInput.addEventListener('input', updateConfigAndRender);
        topFontFamilyInput.addEventListener('change', updateConfigAndRender);
        topFontSizeInput.addEventListener('change', updateConfigAndRender);
        topFontColorInput.addEventListener('input', updateConfigAndRender);
        const handleTopTableInput = (e) => {
            if (e.target.isContentEditable) {
                updateConfigFromDOM();
            }
        };
        topTablePreview.addEventListener('input', handleTopTableInput);
        bottomTablePreview.addEventListener('input', handleTopTableInput);
        topTablePreview.addEventListener('click', handleTopTableCellClick);
        bottomTablePreview.addEventListener('click', handleTopTableCellClick);
        borderTopCheckbox.addEventListener('change', updateBorders);
        borderRightCheckbox.addEventListener('change', updateBorders);
        borderBottomCheckbox.addEventListener('change', updateBorders);
        borderLeftCheckbox.addEventListener('change', updateBorders);
        alignLeftButton.addEventListener('click', () => updateAlignment('left'));
        alignCenterButton.addEventListener('click', () => updateAlignment('center'));
        alignRightButton.addEventListener('click', () => updateAlignment('right'));
    }

    // --- Logo-Funktionen ---
    async function loadLogoList() {
        try {
            const response = await fetch(`${API_URL}?action=list-logos`);
            // Korrigiert: Nutzt 'list-logos' Aktion
            if (!response.ok) throw new Error('Netzwerkfehler beim Laden der Logos.');
            const logoFiles = await response.json(); // Erwartet: ["logo1.png", "logo2.jpg"]
            logoSelect.innerHTML = '<option value="">-- Kein Logo --</option>';
            logoFiles.forEach(fileName => {
                const option = new Option(fileName, fileName);
                logoSelect.add(option);
            });
            logoSelect.value = currentConfig.logoFile || ''; // Aktuelles Logo auswählen
        } catch (error) {
            console.error('Fehler beim Laden der Logo-Liste:', error);
        }
    }

    /**
     * Aktualisiert die Live-Logo-Vorschau über der Tabelle (#print-header-wrapper).
     * Diese Funktion wird jetzt konsistent mit der Druck-Logik (handlePrint) implementiert.
     */
    function updateLogoPreview() {
        const logoFile = logoSelect.value;
        const logoHeight = logoHeightInput.value;
        const logoAlign = logoAlignSelect.value;

        printHeaderWrapper.innerHTML = '';
        // Vorhandenes Logo leeren

        if (logoFile) {
            const img = document.createElement('img');
            img.src = `logos/${logoFile}`; // Annahme: Logos liegen im 'logos'-Ordner
            img.alt = 'Logo Preview';
            // --- STYLING KORRIGIERT & VEREINHEITLICHT ---

            // 1. Stile auf das Bild selbst anwenden
            img.style.height = logoHeight;
            img.style.maxWidth = '100%'; // Vermeide Überlauf
            img.style.display = 'inline-block';
            // WICHTIG: Damit text-align auf dem Wrapper funktioniert

            // 2. Margin-Logik (die 'display: block' erforderte) wird entfernt.
            /*
            if (logoAlign === 'center') {
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
                img.style.display = 'block';
            } else if (logoAlign === 'right') {
                img.style.marginLeft = 'auto';
                img.style.marginRight = '0';
                img.style.display = 'block';
            } else { // left
                img.style.marginLeft = '0';
                img.style.marginRight = 'auto';
                img.style.display = 'block';
            }
            */
            // --- ENDE KORREKTUR ---

            printHeaderWrapper.appendChild(img);
        }

        // 3. Wende 'text-align' auf den Wrapper an.
        //    Dies funktioniert jetzt, da das Bild 'inline-block' ist.
        printHeaderWrapper.style.textAlign = logoAlign;
    }

    // --- State & DOM Management ---
    function updateConfigFromDOM() {
        const numCols = parseInt(colsInput.value, 10);
        const headers = [];
        const headers2 = [];
        const colWidths = [];
        const headerAligns = [];
        for (let i = 0; i < numCols; i++) {
            headers.push(document.getElementById(`header-${i}`)?.value || '');
            colWidths.push(document.getElementById(`width-${i}`)?.value || 'auto');
            headerAligns.push(document.getElementById(`align-${i}`)?.value || 'left');

            if (headerRows2Checkbox.checked) {
                headers2.push(document.getElementById(`header2-${i}`)?.value || '');
            }
        }

        currentConfig = {
            rows: parseInt(rowsInput.value, 10),
            cols: numCols,
            headerRows: headerRows2Checkbox.checked ?
            2 : 1,
            headerRowHeight: headerRowHeightInput.value,
            rowHeight: rowHeightInput.value,
            headers: headers,
            headers2: headers2,
            colWidths: colWidths,
            merges: currentConfig.merges ||
            [],
            printSize: printSizeSelect.value,
            printOrientation: printOrientationSelect.value,
            marginTop: marginTopInput.value,
            marginBottom: marginBottomInput.value,
            marginLeft: marginLeftInput.value,
            marginRight: marginRightInput.value,
            // --- NEU: Design Werte ---


            logoFile: logoSelect.value,
            logoHeight: logoHeightInput.value,
            logoAlign: logoAlignSelect.value,
            bgColorPage: bgColorPageInput.value,
            bgColorHeader: bgColorHeaderInput.value,
            bgColorData: bgColorDataInput.value,

            borderWidth: borderWidthInput.value,

           borderColor:
            borderColorInput.value,
            headerFontFamily: headerFontFamilyInput.value,
            headerFontSize: headerFontSizeInput.value,
            headerFontColor: headerFontColorInput.value,
            headerAligns: headerAligns,
            topTable: {
                enabled: topTableEnableCheckbox.checked,
                rows: parseInt(topRowsInput.value, 10),
                cols: parseInt(topColsInput.value, 10),
                rowHeight: topRowHeightInput.value,
                position: topTablePositionSelect.value,
                bgColor: topBgColorInput.value,
                fontFamily: topFontFamilyInput.value,
                fontSize: topFontSizeInput.value,
                fontColor: topFontColorInput.value,
                cellData: getTopTableCellData(),
                borders: currentConfig.topTable.borders || {},
                aligns: currentConfig.topTable.aligns || {}
            }
        };
    }

    function getTopTableCellData() {
        if (!currentConfig.topTable || !currentConfig.topTable.enabled) return [];
        const rows = parseInt(topRowsInput.value, 10);
        const cols = parseInt(topColsInput.value, 10);
        const cellData = [];
        const container = currentConfig.topTable.position === 'top' ? topTablePreview : bottomTablePreview;
        for (let r = 0; r < rows; r++) {
            const rowData = [];
            for (let c = 0; c < cols; c++) {
                const div = container.querySelector(`div[contenteditable="true"][data-row="${r}"][data-col="${c}"]`);
                rowData.push(div ? div.innerText : '');
            }
            cellData.push(rowData);
        }
        return cellData;
    }

    function applyConfig(config) {
        currentConfig = config;

        rowsInput.value = config.rows;
        colsInput.value = config.cols;
        headerRows2Checkbox.checked = (config.headerRows === 2);
        headerRowHeightInput.value = config.headerRowHeight || '8mm';
        rowHeightInput.value = config.rowHeight;
        printSizeSelect.value = config.printSize;
        printOrientationSelect.value = config.printOrientation;

        marginTopInput.value = config.marginTop || '15mm';
        marginBottomInput.value = config.marginBottom || '15mm';
        marginLeftInput.value = config.marginLeft || '15mm';
        marginRightInput.value = config.marginRight || '15mm';

        // --- NEU: Design Werte anwenden ---
        logoSelect.value = config.logoFile ||
        '';
        logoHeightInput.value = config.logoHeight || '20mm';
        logoAlignSelect.value = config.logoAlign || 'left';
        bgColorPageInput.value = config.bgColorPage || '#FFFFFF';
        bgColorHeaderInput.value = config.bgColorHeader ||
        '#EEEEEE';
        bgColorDataInput.value = config.bgColorData || '#FFFFFF';
        borderWidthInput.value = config.borderWidth || '1px';
        borderColorInput.value = config.borderColor || '#000000';
        headerFontFamilyInput.value = config.headerFontFamily ||
        'Arial';
        headerFontSizeInput.value = config.headerFontSize || '12pt';
        headerFontColorInput.value = config.headerFontColor || '#000000';
        // headerAligns werden über generateDynamicControls gesetzt

        if (config.topTable) {
            topTableEnableCheckbox.checked = config.topTable.enabled;
            topRowsInput.value = config.topTable.rows;
            topColsInput.value = config.topTable.cols;
            topRowHeightInput.value = config.topTable.rowHeight;
            topTablePositionSelect.value = config.topTable.position || 'top';
            topBgColorInput.value = config.topTable.bgColor || '#FFFFFF';
            topFontFamilyInput.value = config.topTable.fontFamily || 'Arial';
            topFontSizeInput.value = config.topTable.fontSize || '12pt';
            topFontColorInput.value = config.topTable.fontColor || '#000000';
        }
        topTableControls.style.display = topTableEnableCheckbox.checked ? 'block' : 'none';

        generateDynamicControls(false);
        updateLogoPreview();
        // Logo-Vorschau aktualisieren, wenn Konfiguration angewendet wird
        renderTable();
    }

    function generateDynamicControls(resetValues) {
        const numCols = parseInt(colsInput.value, 10);
        const numHeaderRows = headerRows2Checkbox.checked ? 2 : 1;

        dynamicControls.innerHTML = '';

        const group1 = document.createElement('div');
        group1.innerHTML = '<h4>1. Header-Zeile (Überschriften, Breiten & Ausrichtung):</h4>';
        for (let i = 0; i < numCols; i++) {
            const header = (resetValues || !currentConfig.headers) ?
            '' : (currentConfig.headers[i] || '');
            const width = (resetValues || !currentConfig.colWidths) ? 'auto' : (currentConfig.colWidths[i] || 'auto');
            const align = (resetValues || !currentConfig.headerAligns) ? 'left' : (currentConfig.headerAligns[i] || 'left');
            group1.innerHTML += `
                <div class="col-control-group">
                    <label>#${i + 1}</label>
                    <input type="text" id="header-${i}" placeholder="Überschrift ${i + 1}" value="${header}">
                    <input type="text" id="width-${i}" placeholder="Breite (z.B. 50mm)" value="${width}">



                    <select id="align-${i}">
                        <option value="left" ${align === 'left' ?
                        'selected' : ''}>Links</option>
                        <option value="center" ${align === 'center' ?
                        'selected' : ''}>Mitte</option>
                        <option value="right" ${align === 'right' ?
                        'selected' : ''}>Rechts</option>
                    </select>
                </div>`;
        }
        dynamicControls.appendChild(group1);

        if (numHeaderRows === 2) {
            const group2 = document.createElement('div');
            group2.innerHTML = '<hr><h4>2. Header-Zeile (Beschriftungen):</h4>';
            for (let i = 0; i < numCols; i++) {
                const header2 = (resetValues || !currentConfig.headers2) ?
                '' : (currentConfig.headers2[i] || '');

                group2.innerHTML += `
                <div class="col-control-group" style="grid-template-columns: 30px 3fr 2fr;">
                    <label>#${i + 1}</label>
                    <input type="text" id="header2-${i}" placeholder="Beschriftung ${i + 1}" value="${header2}">
                    <span style="font-size: 9px;">(Breite & Ausrichtung von oben)</span>



                 </div>`;
            }
            dynamicControls.appendChild(group2);
        }
    }

    // --- Render-Funktion ---
    function buildMergeMatrix() {
        const totalHeaderRows = currentConfig.headerRows ||
        1;
        const totalRows = (currentConfig.rows || 0) + totalHeaderRows;
        const cols = currentConfig.cols || 0;
        const merges = currentConfig.merges ||
        [];
        const matrix = Array(totalRows).fill(null).map(() => Array(cols).fill(null));
        merges.forEach(merge => {
            const { row, col, rowspan, colspan } = merge;
            if (row >= totalRows || col >= cols) return;
            if (matrix[row][col] !== null) { console.warn('Merge-Kollision', row, col); return; }
            matrix[row][col] = merge;
            for (let

            r = 0; r < rowspan; r++) {
                for (let c = 0; c < colspan; c++) {
                    if (r === 0 && c === 0) continue;

                     if (row + r < totalRows &&
                    col + c < cols) {

                         matrix[row + r][col + c] = 'merged-cell';
                    }

                 }
            }
        });
        return matrix;
    }

    function renderTopTable() {
        if (!currentConfig.topTable || !currentConfig.topTable.enabled) {
            topTablePreview.innerHTML = '';
            bottomTablePreview.innerHTML = '';
            topTablePreview.style.marginBottom = '0';
            bottomTablePreview.style.marginTop = '0';
            return;
        }

        const {
            rows,
            cols,
            rowHeight,
            cellData,
            position,
            bgColor,
            fontFamily,
            fontSize,
            fontColor,
            borders,
            aligns
        } = currentConfig.topTable;
        const {
            borderWidth,
            borderColor
        } = currentConfig;

        let tableHTML = `<table style="border-collapse: collapse; table-layout: fixed; width: 100%;">`;
        tableHTML += '<colgroup>';
        for (let i = 0; i < cols; i++) {
            tableHTML += `<col style="width: ${100 / cols}%;">`;
        }
        tableHTML += '</colgroup>';

        tableHTML += '<tbody>';
        for (let r = 0; r < rows; r++) {
            // Die Höhe wird auf die TR gesetzt, damit table-layout:fixed sie erzwingen kann.
            tableHTML += `<tr style="height: ${rowHeight};">`;
            for (let c = 0; c < cols; c++) {
                const cellId = `${r}-${c}`;
                const cellValue = cellData && cellData[r] && cellData[r][c] ? cellData[r][c] : '';
                const cellBorders = borders && borders[cellId] ? borders[cellId] : { top: true, right: true, bottom: true, left: true };
                const cellAlign = aligns && aligns[cellId] ? aligns[cellId] : 'left';

                // TD hat keine Höhe mehr, nur noch padding: 0.
                let cellStyle = `
                    background-color: ${bgColor};
                    font-family: ${fontFamily};
                    font-size: ${fontSize};
                    color: ${fontColor};
                    padding: 0;
                    border-top: ${cellBorders.top ? `${borderWidth} solid ${borderColor}` : 'none'};
                    border-right: ${cellBorders.right ? `${borderWidth} solid ${borderColor}` : 'none'};
                    border-bottom: ${cellBorders.bottom ? `${borderWidth} solid ${borderColor}` : 'none'};
                    border-left: ${cellBorders.left ? `${borderWidth} solid ${borderColor}` : 'none'};
                `;
                 // Der DIV wird zum Clipping-Container.
                let divStyle = `
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: ${cellAlign};
                    overflow: hidden; /* Wichtig: Dieser DIV schneidet den Inhalt ab. */
                    padding: 0 3mm;
                `;
                // Der contenteditable DIV füllt den äußeren DIV.
                let editableDivStyle = `
                    width: 100%;
                    border: none;
                    background-color: transparent;
                    font-family: inherit;
                    font-size: inherit;
                    color: inherit;
                    text-align: ${cellAlign};
                    padding: 0;
                    margin: 0;
                    line-height: 1.2;
                    overflow: hidden;
                    white-space: nowrap; /* Verhindert Zeilenumbrüche, die die Höhe beeinflussen könnten */
                `;
                tableHTML += `<td style="${cellStyle}" data-row="${r}" data-col="${c}"><div style="${divStyle}"><div contenteditable="true" data-row="${r}" data-col="${c}" style="${editableDivStyle}">${cellValue}</div></div></td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table>';

        const targetPreview = position === 'top' ? topTablePreview : bottomTablePreview;
        const otherPreview = position === 'top' ? bottomTablePreview : topTablePreview;

        targetPreview.innerHTML = tableHTML;
        otherPreview.innerHTML = '';
        targetPreview.style.margin = position === 'top' ? '0 0 5mm 0' : '5mm 0 0 0';
        otherPreview.style.margin = '0';

        updateTopTableCellSelectionVisuals();
    }

    function renderTable() {
        renderTopTable();
        if (!currentConfig.cols) updateConfigFromDOM();
        const {
            rows, cols, rowHeight, headerRowHeight, headers, headers2, colWidths,
            bgColorHeader, bgColorData, borderWidth, borderColor,
            headerFontFamily, headerFontSize, headerFontColor, headerAligns
        } = currentConfig;
        const totalHeaderRows = currentConfig.headerRows || 1;
        const totalRows = rows + totalHeaderRows;
        const matrix = buildMergeMatrix();
        // tablePreview ist der Container für die Tabelle und bekommt ggf.
        // den Hintergrund der Seite
        tablePreviewWrapper.style.backgroundColor = currentConfig.bgColorPage;
        let tableHTML = `<table style="
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            border: ${borderWidth} solid ${borderColor};
        ">`;
        // Table-wide border only once

        tableHTML += '<colgroup>';
        for (const width of colWidths) {
            tableHTML += `<col style="width: ${width};">`;
        }
        tableHTML += '</colgroup>';

        tableHTML += '<thead>';
        for (let r = 0; r < totalHeaderRows; r++) {
            tableHTML += `<tr style="height: ${headerRowHeight};">`;
            for (let c = 0; c < cols; c++) {
                if (matrix[r][c] === 'merged-cell') continue;
                let attrs = `data-row="${r}" data-col="${c}"`;
                if (matrix[r][c]) {
                    attrs += ` rowspan="${matrix[r][c].rowspan}" colspan="${matrix[r][c].colspan}"`;
                }

                let content = '&nbsp;';
                let alignStyle = headerAligns && headerAligns[c] ? `text-align: ${headerAligns[c]};` : '';
                let cellStyle = `
                    border: ${borderWidth} solid ${borderColor};
                    background-color: ${bgColorHeader};
                    font-family: ${headerFontFamily};
                    font-size: ${headerFontSize};
                    color: ${headerFontColor};
                    ${alignStyle}
                `;
                if (r === 0) {
                    content = (headers && headers[c]) ?
                    headers[c] : '&nbsp;';
                } else if (r === 1) {
                    content = (headers2 && headers2[c]) ?
                    headers2[c] : '&nbsp;';
                }

                tableHTML += `<th style="${cellStyle}" ${attrs}>${content}</th>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</thead>';

        tableHTML += '<tbody>';
        for (let r = totalHeaderRows; r < totalRows; r++) {
            tableHTML += `<tr style="height: ${rowHeight};">`;
            for (let c = 0; c < cols; c++) {
                if (matrix[r][c] === 'merged-cell') continue;
                let attrs = `data-row="${r}" data-col="${c}"`;
                if (matrix[r][c]) {
                    attrs += ` rowspan="${matrix[r][c].rowspan}" colspan="${matrix[r][c].colspan}"`;
                }
                let cellStyle = `
                    border: ${borderWidth} solid ${borderColor};
                    background-color: ${bgColorData};
                    font-family: ${headerFontFamily};
                    font-size: ${headerFontSize};
                    color: ${headerFontColor};
                `;
                tableHTML += `<td style="${cellStyle}" ${attrs}>&nbsp;</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table>';

        tablePreview.innerHTML = tableHTML;
        updateSelectionVisuals();
    }

    // --- Zell-Auswahl & Merge-Logik ---
    function handleCellClick(e) {
        const cell = e.target.closest('td, th');
        if (!cell) return;
        const selection = {
            row: parseInt(cell.dataset.row, 10),
            col: parseInt(cell.dataset.col, 10)
        };
        if (e.shiftKey) { selectionEnd = selection; }
        else { selectionStart = selection;
            selectionEnd = null; }

        // Hide top table border controls if main table is clicked
        borderControls.style.display = 'none';
        selectedTopTableCell = null;
        updateTopTableCellSelectionVisuals(); // Clear selection visuals from top table
        updateSelectionVisuals();
    }
    function updateSelectionVisuals() {
        tablePreview.querySelectorAll('.selection-start, .selection-end').forEach(el => {
            el.classList.remove('selection-start', 'selection-end');
        });
        if (selectionStart) {
            const startCell = tablePreview.querySelector(`[data-row="${selectionStart.row}"][data-col="${selectionStart.col}"]`);
            if (startCell) startCell.classList.add('selection-start');
        }
        if (selectionEnd) {
            const endCell = tablePreview.querySelector(`[data-row="${selectionEnd.row}"][data-col="${selectionEnd.col}"]`);
            if (endCell) endCell.classList.add('selection-end');
        }
    }
    function mergeCells() {
        if (!selectionStart || !selectionEnd) {
            alert('Bitte zwei Zellen für den Merge auswählen (Start-Zelle, dann SHIFT + End-Zelle).');
            return;
        }
        const r1 = Math.min(selectionStart.row, selectionEnd.row);
        const c1 = Math.min(selectionStart.col, selectionEnd.col);
        const r2 = Math.max(selectionStart.row, selectionEnd.row);
        const c2 = Math.max(selectionStart.col, selectionEnd.col);
        const newMerge = {
            row: r1, col: c1,
            rowspan: r2 - r1 + 1,
            colspan: c2 - c1 + 1
        };
        currentConfig.merges.push(newMerge);
        selectionStart = null;
        selectionEnd = null;
        renderTable();
    }
    function unmergeCell() {
        if (!selectionStart) {
            alert('Bitte zuerst die verbundene Zelle (links oben im Verbund) anklicken.');
            return;
        }
        const { row, col } = selectionStart;
        const mergeIndex = currentConfig.merges.findIndex(m => m.row === row && m.col === col);
        if (mergeIndex > -1) {
            currentConfig.merges.splice(mergeIndex, 1);
            selectionStart = null;
            renderTable();
        } else {
            alert('Die ausgewählte Zelle ist nicht der Startpunkt einer Verbindung.');
        }
    }
    function clearMerges() {
        if (confirm('Sollen wirklich alle verbundenen Zellen getrennt werden?')) {
            currentConfig.merges = [];
            selectionStart = null;
            selectionEnd = null;
            renderTable();
        }
    }

    function handleTopTableCellClick(e) {
        const cell = e.target.closest('td');
        if (!cell) {
            // If click is outside a cell, hide controls and clear selection
            borderControls.style.display = 'none';
            selectedTopTableCell = null;
            updateTopTableCellSelectionVisuals();
            return;
        }
        e.stopPropagation(); // Prevent main table handler from firing

        selectedTopTableCell = {
            row: parseInt(cell.dataset.row, 10),
            col: parseInt(cell.dataset.col, 10)
        };

        // Clear main table selection
        selectionStart = null;
        selectionEnd = null;
        updateSelectionVisuals();

        updateTopTableCellSelectionVisuals();
        showBorderControls(cell);
    }

    function updateTopTableCellSelectionVisuals() {
        const allCells = document.querySelectorAll('#top-table-preview td, #bottom-table-preview td');
        allCells.forEach(c => c.classList.remove('selection-start'));

        if (selectedTopTableCell) {
            const { row, col } = selectedTopTableCell;
            const container = currentConfig.topTable.position === 'top' ? topTablePreview : bottomTablePreview;
            const selectedCell = container.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
            if (selectedCell) {
                selectedCell.classList.add('selection-start');
            }
        }
    }

    function showBorderControls(cell) {
        const rect = cell.getBoundingClientRect();
        borderControls.style.display = 'block';
        borderControls.dataset.collapsed = 'false';
        borderControls.style.top = `${window.scrollY + rect.bottom + 5}px`;
        borderControls.style.left = `${window.scrollX + rect.left}px`;

        const cellId = `${selectedTopTableCell.row}-${selectedTopTableCell.col}`;
        const borders = currentConfig.topTable.borders[cellId] || { top: true, right: true, bottom: true, left: true };
        const align = currentConfig.topTable.aligns[cellId] || 'left';

        borderTopCheckbox.checked = borders.top;
        borderRightCheckbox.checked = borders.right;
        borderBottomCheckbox.checked = borders.bottom;
        borderLeftCheckbox.checked = borders.left;

        [alignLeftButton, alignCenterButton, alignRightButton].forEach(btn => btn.classList.remove('primary'));
        if (align === 'left') alignLeftButton.classList.add('primary');
        if (align === 'center') alignCenterButton.classList.add('primary');
        if (align === 'right') alignRightButton.classList.add('primary');
    }

    function updateBorders() {
        if (!selectedTopTableCell) return;

        const cellId = `${selectedTopTableCell.row}-${selectedTopTableCell.col}`;

        if (!currentConfig.topTable.borders) {
            currentConfig.topTable.borders = {};
        }
        if (!currentConfig.topTable.borders[cellId]) {
            currentConfig.topTable.borders[cellId] = { top: true, right: true, bottom: true, left: true };
        }

        currentConfig.topTable.borders[cellId] = {
            top: borderTopCheckbox.checked,
            right: borderRightCheckbox.checked,
            bottom: borderBottomCheckbox.checked,
            left: borderLeftCheckbox.checked
        };

        renderTopTable();
    }

    function updateAlignment(align) {
        if (!selectedTopTableCell) return;

        const cellId = `${selectedTopTableCell.row}-${selectedTopTableCell.col}`;
        if (!currentConfig.topTable.aligns) {
            currentConfig.topTable.aligns = {};
        }
        currentConfig.topTable.aligns[cellId] = align;

        renderTopTable();
        // Re-show controls to update button highlighting
        const container = currentConfig.topTable.position === 'top' ? topTablePreview : bottomTablePreview;
        const selectedCell = container.querySelector(`td[data-row="${selectedTopTableCell.row}"][data-col="${selectedTopTableCell.col}"]`);
        if (selectedCell) showBorderControls(selectedCell);
    }

    // --- Druck- & Berechnungs-Logik ---
    function calculateMaxRows() {
        updateConfigFromDOM();
        const config = currentConfig; // Frische Konfiguration holen
        const size = config.printSize;
        const orientation = config.printOrientation;

        if (!PAGE_DIMENSIONS_MM[size] || !PAGE_DIMENSIONS_MM[size][orientation]) {
            console.error('Druckformat unbekannt:', size, orientation);
            return;
        }

        const pageHeight = PAGE_DIMENSIONS_MM[size][orientation].h;

        const marginTop = parseFloat(config.marginTop) || 0;
        const marginBottom = parseFloat(config.marginBottom) || 0;
        const usableHeight = pageHeight - (marginTop + marginBottom);

        const dataRowHeight = parseFloat(config.rowHeight);
        const headerRowHeight = parseFloat(config.headerRowHeight);
        const totalHeaderRows = config.headerRows || 1;
        if (isNaN(dataRowHeight) || dataRowHeight <= 0 || isNaN(headerRowHeight) || headerRowHeight <= 0) {
             alert('Bitte eine gültige Zeilenhöhe für Header UND Daten in mm angeben.');
             return;
        }

        // --- KORREKTUR: Logo-Platz berücksichtigen ---
        let logoSpace = 0;
        const logoHeightMM = parseFloat(config.logoHeight);

        if (config.logoFile && !isNaN(logoHeightMM)) {
            // Logo-Höhe + 5mm Puffer (konsistent mit Druck-CSS 'calc(${config.logoHeight} + 5mm)')
            logoSpace = logoHeightMM + 5.0;
        }
        // --- ENDE KORREKTUR ---

        let topTableSpace = 0;
        if (config.topTable.enabled) {
            const topTableRows = config.topTable.rows;
            const topTableRowHeight = parseFloat(config.topTable.rowHeight);
            if (!isNaN(topTableRowHeight) && topTableRowHeight > 0) {
                topTableSpace = topTableRows * topTableRowHeight + 5; // 5mm margin
            }
        }

        const headerSpace = totalHeaderRows * headerRowHeight;
        // Verfügbare Höhe für Datenzeilen ist die nutzbare Höhe minus Header UND Logo-Platz
        const heightForData = usableHeight - headerSpace - logoSpace - topTableSpace;
        const EPSILON = 0.1; // Toleranz für Fließkomma-Ungenauigkeiten
        const maxDataRows = Math.floor((heightForData - EPSILON) / dataRowHeight);
        // Sicherstellen, dass der Wert nicht negativ ist
        rowsInput.value = maxDataRows >= 0 ?
        maxDataRows : 0;

        // Konfiguration aktualisieren (wird beim nächsten updateConfigFromDOM() sowieso überschrieben,
        // aber gut für renderTable())
        currentConfig.rows = maxDataRows >= 0 ?
        maxDataRows : 0;
        renderTable();
    }

    function handlePrint() {
        updateConfigFromDOM();
        const config = currentConfig;

        let dynamicHeaderAlignsCss = '';
        for (let i = 0; i < config.cols; i++) {
            // --- KORREKTUR: Syntaxfehler behoben ---
            // Die Zeilen und wurden hier zu einer Zeile zusammengefasst.
            dynamicHeaderAlignsCss += `
                #table-preview th[data-col="${i}"] { text-align: ${config.headerAligns?.[i] || 'left'}; }
            `;
            // --- ENDE KORREKTUR ---
        }

        const css = `
            @media print{
            @page {
                size: ${config.printSize} ${config.printOrientation};
                margin: 0;
            }

            body {
                background-color: ${config.bgColorPage};
                -webkit-print-color-adjust: exact;
                /* Sicherstellen, dass Hintergrundfarben gedruckt werden */
                print-color-adjust: exact;
                margin: 0; /* body margin entfernen */
            }

            #table-preview-wrapper { /* Dieser Wrapper enthält die Tabelle und erhält die Seitenränder */
                background-color: ${config.bgColorPage};
                padding-top: ${config.marginTop};
                padding-bottom: ${config.marginBottom};
                padding-left: ${config.marginLeft};
                padding-right: ${config.marginRight};
                box-sizing: border-box;
                display: block;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            #print-header-wrapper {
                /* NEU: Absolut positioniert, um den Tabellen-Fluss nicht zu stören */
                position: absolute;
                /* NEU: Positionierung an den Seitenrändern ausrichten */

                left: ${config.marginLeft};
                right: ${config.marginRight};

                /* Höhe wird durch Bild bestimmt, Ausrichtung ist hier */
                height: ${config.logoHeight};
                text-align: ${config.logoAlign};

                ${!config.logoFile ? 'display: none;' : ''}
            }
            #print-header-wrapper img {
                height: ${config.logoHeight};
                max-width: 100%;
                display: inline-block; /* Für text-align zum Funktionieren */
            }

            #table-preview table {
                border-collapse: collapse;
                table-layout: fixed;
                width: 100%;
                border: ${config.borderWidth} solid ${config.borderColor};
                font-family: ${config.headerFontFamily};
                font-size: ${config.headerFontSize};
                color: ${config.headerFontColor};
                /* NEU: Die Tabelle (innerhalb des Wrappers) braucht einen Abstand von oben,
                   um Platz für das (jetzt absolute) Logo zu schaffen.
                5mm Puffer zwischen Logo und Tabelle. */
                margin-top: ${config.logoFile ?
                `calc(${config.logoHeight} + 5mm)` : '0'};
            }

            #table-preview thead tr {
                height: ${config.headerRowHeight};
                background-color: ${config.bgColorHeader};
            }

            #table-preview th,
            #table-preview td {
                border: ${config.borderWidth} solid ${config.borderColor};
                padding: 2mm 3mm; /* Standard-Padding für alle Zellen */
            }

            #table-preview th {
                background-color: ${config.bgColorHeader};
            }

            #table-preview tbody tr {
                height: ${config.rowHeight};
            }
            #table-preview td {
                background-color: ${config.bgColorData};
            }
            }

            ${dynamicHeaderAlignsCss}
        `;
        printStyleSheet.innerHTML = css;
        // --- HINZUGEFÜGT: Cleanup nach dem Druck ---
        const cleanupPrint = () => {
            printStyleSheet.innerHTML = '';
            // Leert die temporären Stile
            window.removeEventListener('afterprint', cleanupPrint);
            // Entfernt den Listener selbst
        };
        // Fügt den Event Listener hinzu, der auf das Schließen des Dialogs wartet.
        window.addEventListener('afterprint', cleanupPrint);
        alert("WICHTIGER HINWEIS:\n\n" +
              "Im Chrome-Druckdialog, der sich jetzt öffnet, stellen Sie bitte sicher, dass unter 'Weitere Einstellungen' -> 'Ränder' die Option 'KEINE' (oder 'None') ausgewählt ist.\n\n" +
              "Ihre Ränder werden von der Anwendung selbst als Innenabstand (Padding) hinzugefügt.");
        setTimeout(() => {
            window.print();
        }, 100);
    }

    // --- API-Funktionen (SPEICHERN, LADEN, LÖSCHEN - FÜR DATEI-BASIERTES API) ---

    // KORREKTUR: Listet jetzt Dateinamen (Strings) statt Objekten auf
    // Diese Funktion war im Original korrekt für ein file-basiertes System!
    async function loadLayoutList() {
        try {
            const response = await fetch(`${API_URL}?action=list`);
            if (!response.ok) throw new Error('Netzwerkfehler');

            const layoutNames = await response.json();
            // Erwartet: ["Layout A", "Layout B"] (was die neue api.php jetzt sendet)
            layoutSelect.innerHTML = '<option value="">-- Layout wählen --</option>';
            layoutNames.forEach(name => {
                // Wert und Text sind jetzt identisch (der Dateiname)
                const option = new Option(name, name);
                layoutSelect.add(option);
            });
        } catch (error) { console.error('Fehler beim Laden der Liste:', error); alert('Fehler: Layout-Liste konnte nicht geladen werden.');
        }
    }

    // KORREKTUR: Lädt per 'name' und parst .text() statt .json()
    async function loadLayout() {
        const name = layoutSelect.value;
        // 'value' ist jetzt der Dateiname
        if (!name) return;
        try {
            // Sendet 'name'
            const response = await fetch(`${API_URL}?action=load&name=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error('Layout nicht gefunden');

            // KORREKTUR: Die API (file-based) sendet reinen Text (den Inhalt der JSON-Datei)
            const configString = await response.text();
            // Wir müssen den Text manuell in ein JSON-Objekt umwandeln
            const config = JSON.parse(configString);
            applyConfig(config);
            layoutNameInput.value = name;
            // Setzt den Namen in das Speicherfeld

        } catch (error) {
            console.error('Ladefehler:', error);
            if (error instanceof SyntaxError) {
                // Dieser Fehler passiert, wenn die geladene JSON-Datei kaputt ist
                alert('Fehler: Die geladene Layout-Datei (JSON) ist fehlerhaft oder leer.');
            } else {
                alert('Fehler: Layout konnte nicht geladen werden.');
            }
        }
    }

    // Speichern (Diese Funktion war im Original korrekt)
    async function saveLayout() {
        const name = layoutNameInput.value;
        if (!name) { alert('Bitte einen Dateinamen für das Layout eingeben.'); return;
        }
        // Verhindern, dass Benutzer .json selbst eingibt (wird von api.php gehandhabt)
        if (name.endsWith('.json')) {
            alert('Bitte geben Sie den Namen ohne die ".json" Endung ein.');
            return;
        }

        updateConfigFromDOM();
        const formData = new FormData();
        formData.append('action', 'save');
        formData.append('name', name);
        // api.php macht 'name.json' daraus
        formData.append('config_json', JSON.stringify(currentConfig, null, 2));
        // Schön formatiert speichern
        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Fehler beim Speichern');

            // Die neue api.php sendet {success: true, name: "..."}
            await response.json();
            alert(`Layout "${name}" gespeichert!`);
            layoutNameInput.value = name;
            await loadLayoutList();
            // Das gespeicherte Layout auswählen
            layoutSelect.value = name;
        } catch (error) { console.error('Speicherfehler:', error); alert('Fehler: Layout konnte nicht gespeichert werden.');
        }
    }

    // KORREKTUR: Löscht per 'name' (Diese Funktion war im Original korrekt)
    async function deleteLayout() {
        const name = layoutSelect.value;
        if (!name) return;
        if (!confirm(`Wollen Sie das Server-Layout "${name}" wirklich löschen?`)) return;

        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('name', name); // 'name' senden

        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Fehler beim Löschen');

            await response.json();
            alert(`Layout "${name}" gelöscht.`);
            layoutNameInput.value = '';
            loadLayoutList();
        } catch (error) { console.error('Löschfehler:', error); alert('Fehler: Layout konnte nicht gelöscht werden.');
        }
    }

    // --- NEU: Import / Export Funktionen ---

    /**
     * Löst den Download der aktuellen Konfiguration als JSON-Datei aus.
     */
    function downloadLayout() {
        updateConfigFromDOM();
        // Sicherstellen, dass die Konfiguration aktuell ist

        const jsonString = JSON.stringify(currentConfig, null, 2);
        // (null, 2) für "pretty print"
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        // Dateiname aus dem Input-Feld oder Standard
        let fileName = layoutNameInput.value || 'layout';
        if (!fileName.endsWith('.json')) {
            fileName += '.json';
        }

        a.download = fileName;
        document.body.appendChild(a);
        // Nötig für Firefox
        a.click();
        // Aufräumen
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Wird vom 'change'-Event des fileUploadInput aufgerufen.
     * Liest eine lokale JSON-Datei und wendet sie als Konfiguration an.
     */
    function loadLocalFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const config = JSON.parse(content);
                // Konfiguration anwenden
                applyConfig(config);
                // Namen der geladenen Datei in das Speicherfeld eintragen
                const fileName = file.name.replace(/\.json$/i, '');
                // .json Endung entfernen
                layoutNameInput.value = fileName;
                alert(`Layout "${file.name}" geladen.\nEs ist noch nicht auf dem Server gespeichert.`);
            } catch (err) {
                alert('Fehler: Die ausgewählte Datei ist keine gültige JSON-Konfigurationsdatei.');
                console.error("JSON Parse Error:", err);
            }
        };
        reader.onerror = () => {
            alert('Fehler beim Lesen der Datei.');
            console.error("FileReader Error:", reader.error);
        };

        reader.readAsText(file);

        // Wichtig: Input-Wert zurücksetzen, damit dieselbe Datei erneut geladen werden kann
        fileUploadInput.value = null;
    }

    // --- Start ---
    initialize();
});
