// Bu uygulamada ürünler ve miktarları sadece Excel dosyasından alınır. Tüm tablo ve veri işlemleri Excel'e göre yapılır.

// Fark hesaplama
function calculateDifference(input) {
    const row = input.closest('tr');
    const yesterdayStock = parseInt(row.querySelector('.yesterday-stock').value) || 0;
    const remainingStock = parseInt(row.querySelector('.remaining-stock').value) || 0;
    const systemStock = parseInt(row.querySelector('.system-stock').value) || 0;
    
    // Fark: (dünkü stok - kalan stok) - sistem stok 
    const difference = (yesterdayStock - remainingStock) - systemStock;
    const differenceCell = row.querySelector('.difference');
    differenceCell.textContent = difference;
    const actionCell = row.querySelector('.action');

    // Eşitse 0'a
    if (
        yesterdayStock === 0 &&
        remainingStock === 0 &&
        systemStock === 0
    ) {
        actionCell.textContent = 'İşlem Yok';
        actionCell.className = 'action';
        differenceCell.className = 'difference';
        return;
    }
    if (difference < 0) {
        differenceCell.className = 'difference negative';
        actionCell.textContent = 'Ekside';
        actionCell.className = 'action negative';
    } else {
        differenceCell.className = 'difference positive';
        actionCell.textContent = 'Artıda';
        actionCell.className = 'action positive';
    }
}

// Verileri kaydet
function saveData() {
    const data = {
        items: []
    };
    document.querySelectorAll('#inventoryTable tbody tr').forEach(row => {
        data.items.push({
            beverage: row.cells[0].textContent,
            yesterdayStock: row.querySelector('.yesterday-stock').value,
            remainingStock: row.querySelector('.remaining-stock').value,
            systemStock: row.querySelector('.system-stock').value
        });
    });
    localStorage.setItem('inventory_global', JSON.stringify(data));
}

// Verileri yükle
function loadData() {
    const savedData = localStorage.getItem('inventory_global');
    if (savedData) {
        const data = JSON.parse(savedData);
        const rows = document.querySelectorAll('#inventoryTable tbody tr');
        data.items.forEach((item, index) => {
            if (index < rows.length) {
                const row = rows[index];
                row.querySelector('.yesterday-stock').value = item.yesterdayStock;
                row.querySelector('.remaining-stock').value = item.remainingStock;
                row.querySelector('.system-stock').value = item.systemStock;
                calculateDifference(row.querySelector('.remaining-stock'));
            }
        });
    }
}

// Excel'den ürünleri çıkaran yardımcı fonksiyon
function extractProductsFromExcelJson(json) {
    const products = [];
    json.forEach((row, i) => {
        // Yeni format: Ürün adı 1. indexte, miktar 11. indexte, veriler 6. indexten (7. satır) sonra başlıyor
        if (i < 6) return;
        const name = row[1];
        const amount = row[11];
        if (typeof name === 'string' && name.trim() && typeof amount !== 'undefined' && amount !== null && amount !== '' && !isNaN(amount)) {
            products.push({ name: name.trim(), amount: Number(amount) });
        }
    });
    return products;
}

// Excel dosyası yükleme ve okuma
function handleExcelUpload() {
    const input = document.getElementById('excelFileInput');
    if (!input.files || input.files.length === 0) {
        alert('Lütfen bir Excel dosyası seçin.');
        return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
                throw new Error('Excel dosyasında sayfa bulunamadı.');
            }
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            localStorage.setItem('last_excel_data', JSON.stringify(json));
            const products = extractProductsFromExcelJson(json);

            if (products.length === 0) {
                alert('Excel dosyasında beklenen formatta ürün bulunamadı. Lütfen dosya formatını kontrol edin (Ürün adı 2. sütun, Miktar 12. sütun, veriler 7. satırdan başlamalı).');
                return;
            }
            updateTableWithProducts(products);
            saveData();
            loadData();
        } catch (error) {
            console.error('Excel dosyası işlenirken bir hata oluştu:', error);
            alert('Excel dosyası okunurken bir hata oluştu. Lütfen dosyanın bozuk olmadığını ve doğru formatta olduğunu kontrol edin.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Tabloyu güncelleyen fonksiyon
function updateTableWithProducts(products) {
    const tbody = document.querySelector('#inventoryTable tbody');
    // Önce mevcut tabloyu oku ve eski input değerlerini ürün adına göre sakla
    const oldRows = Array.from(tbody.querySelectorAll('tr'));
    const oldDataMap = {};
    oldRows.forEach(row => {
        const name = row.cells[0].textContent.trim();
        oldDataMap[name] = {
            yesterdayStock: row.querySelector('.yesterday-stock').value,
            remainingStock: row.querySelector('.remaining-stock').value
        };
    });
    tbody.innerHTML = '';
    products.forEach(product => {
        const oldData = oldDataMap[product.name] || {};
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td><input type="number" min="0" class="yesterday-stock" value="${oldData.yesterdayStock || ''}"></td>
            <td><input type="number" min="0" class="remaining-stock" value="${oldData.remainingStock || ''}"></td>
            <td><input type="number" min="0" class="system-stock" value="${product.amount}"></td>
            <td class="difference"></td>
            <td class="action"></td>
        `;
        tbody.appendChild(row);
    });
    // Tüm inputlara olay dinleyicileri ekle
    const inputs = tbody.querySelectorAll('input[type="number"]');
    inputs.forEach((input, idx) => {
        input.addEventListener('change', function() {
            calculateDifference(this);
            saveData();
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (idx + 1 < inputs.length) {
                    inputs[idx + 1].focus();
                    inputs[idx + 1].select();
                }
            }
        });
    });
}

// Sıfırlama fonksiyonu
function resetInventoryData() {
    if (confirm('Tüm veriler temizlensin mi? Bu işlem geri alınamaz!')) {
        // Tüm verileri temizle
        localStorage.removeItem('inventory_global');
        localStorage.removeItem('last_excel_data');
        // Tabloyu tamamen boşalt
        const tbody = document.querySelector('#inventoryTable tbody');
        if (tbody) tbody.innerHTML = '';
    }
}

// Sayfa yüklendiğinde son excel verisi varsa tabloyu otomatik oluştur
window.addEventListener('DOMContentLoaded', () => {
    const dateDisplay = document.getElementById('dateDisplay');
    const today = new Date();
    const formatted = today.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    dateDisplay.textContent = formatted;
    dateDisplay.style.textAlign = 'right';
    dateDisplay.style.color = '#4a5568';
    dateDisplay.style.fontWeight = '500';
    dateDisplay.style.fontSize = '0.95rem';
    dateDisplay.style.marginBottom = '0';
    dateDisplay.style.marginRight = '32px';
    const lastExcel = localStorage.getItem('last_excel_data');
    if (lastExcel) {
        try {
            const json = JSON.parse(lastExcel);
            const products = extractProductsFromExcelJson(json);
            if (products.length > 0) {
                updateTableWithProducts(products);
                loadData();
            }
        } catch (error) {
            console.error('Kaydedilmiş Excel verisi işlenirken bir hata oluştu:', error);
            alert('Daha önce kaydedilmiş Excel verileri yüklenirken bir sorun oluştu. Veri bozulmuş olabilir.');
        }
    }

    const exportButton = document.getElementById('exportExcelButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportReportToExcel);
    }
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetInventoryData);
    }
});

async function exportReportToExcel() {
    console.log("Rapor ExcelJS ile dışa aktarılıyor...");

    const tableRows = document.querySelectorAll('#inventoryTable tbody tr');
    const lastExcelRaw = localStorage.getItem('last_excel_data');

    if (tableRows.length === 0) {
        alert("Raporda gösterilecek veri bulunmuyor.");
        return;
    }
    if (!lastExcelRaw) {
        alert("Rapor oluşturmak için gereken orijinal Excel verisi bulunamadı. Lütfen dosyayı tekrar yükleyin.");
        return;
    }

    try {
        const lastExcelData = JSON.parse(lastExcelRaw);
        const getPriceForProduct = (productName) => {
            const productRow = lastExcelData.slice(6).find(row => row && row[1] && row[1].trim() === productName.trim());
            return (productRow && productRow[13] !== undefined && !isNaN(productRow[13])) ? Number(productRow[13]) : 0;
        };

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Depo Sayım Raporu');
        worksheet.properties.defaultFont = { name: 'Tahoma', size: 10 };

        // Ana Başlıklar
        const now = new Date();
        const formattedDate = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedDateTime = formattedDate + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        const mainHeaderStyle1 = { font: { bold: true, size: 12, name: 'Tahoma' }, alignment: { horizontal: 'center' } };
        const mainHeaderStyle2 = { font: { bold: true, size: 11, name: 'Tahoma' }, alignment: { horizontal: 'center' } };
        worksheet.addRow(["JSGA BAŞKANLIĞI SOSYAL TESİS MÜDÜRLÜĞÜ"]).getCell(1).style = mainHeaderStyle1;
        worksheet.mergeCells('A1:G1');
        worksheet.addRow([`'${formattedDate}' TARİHLİ 153.001-TESİS LOKANTA İŞLETMESİNİN STOKLARI`]).getCell(1).style = mainHeaderStyle2;
        worksheet.mergeCells('A2:G2');
        worksheet.addRow([]);

        // Tarih ve Sayfa No Satırı (saniyesiz, sağ üstte birleşik ve kalın)
        const formattedDateTimeShort = formattedDate + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const datePageText = formattedDateTimeShort + '     1 / 1';
        const dateRow = worksheet.addRow([null, null, null, null, null, datePageText]);
        worksheet.mergeCells(`F4:G4`);
        const mergedDateCell = worksheet.getCell('F4');
        mergedDateCell.font = { bold: true, name: 'Tahoma', size: 10 };
        mergedDateCell.alignment = { horizontal: 'right' };
        // worksheet.addRow([]); // Altına bir satır boşluk

        // Tablo Başlıkları
        const headerRow = worksheet.addRow(["S.N.", "M A L Z E M E  A D I", "D E P O  S A Y I M I", "B İ R İ M", "M İ K T A R", "F İY A T", "T U T A R I"]);
        headerRow.height = 20;
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, name: 'Tahoma', size: 10 };
            cell.alignment = (colNumber === 4) ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'center', vertical: 'middle' };
            cell.border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thin' }, right: { style: 'thin' } };
        });
        // Set thick left and right borders for the header row using headerRow.getCell
        headerRow.getCell(1).border = { ...headerRow.getCell(1).border, left: { style: 'medium' } };
        headerRow.getCell(7).border = { ...headerRow.getCell(7).border, right: { style: 'medium' } };


        // Veri Satırları
        let grandTotal = 0;
        tableRows.forEach((row, index) => {

            const bugunkuDepoSayimi = row.querySelector('.yesterday-stock').value || '';
            const miktar = parseFloat(row.querySelector('.system-stock').value) || 0;

            const originalProductName = row.cells[0].textContent.trim();
            let productNameForReport = originalProductName;
            let productNameRichText = null;
            // const farkCell = row.querySelector('.difference');
            const farkCell = bugunkuDepoSayimi - miktar;
            console.log(farkCell);
            
            const farkValueText = farkCell ? farkCell : '';
             if (!originalProductName.toUpperCase().includes('EKMEK')) {
                const numericValue = parseFloat(farkValueText);
                let suffix = '';
                if (farkValueText === '' || isNaN(numericValue) || numericValue === 0) suffix = '✓';
                else if (numericValue > 0) suffix = `+${numericValue}`;
                
                if (suffix) {
                    // Dinamik boşluk hesaplama
                    const totalLength = 65; // Sütun genişliğine uygun toplam karakter sayısı
                    let padding = (totalLength - originalProductName.length) - suffix.length;
                    let paddedName = originalProductName.padEnd(padding, ' ');
                    if (suffix === '✓') {
                        paddedName = ' ' + paddedName;
                    }
                    productNameForReport = paddedName + `  ${suffix}`;
                    productNameRichText = [
                        { text: paddedName + '  ', font: { name: 'Arial', size: 10 } },
                        { text: suffix, font: { name: 'Arial', size: 11, bold: true } }
                    ];
                }
            }

            const price = getPriceForProduct(originalProductName);
            const total = miktar * price;
            grandTotal += total;

            const dataRow = worksheet.addRow([index + 1, productNameRichText ? '' : productNameForReport, bugunkuDepoSayimi, "ADET", miktar, price, total]);

            dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber === 2) {
                    if (productNameRichText) {
                        cell.value = { richText: productNameRichText };
                    }
                    cell.font = { name: 'Arial', size: 10 };
                    cell.alignment = { horizontal: 'left' };
                } else if (colNumber === 1) {
                    cell.font = { bold: true, name: 'Tahoma', size: 10 };
                    cell.alignment = { horizontal: 'right' };
                } else {
                    cell.font = { name: 'Tahoma', size: 10 };
                    if (colNumber === 3) cell.alignment = { horizontal: 'center' };
                    else if (colNumber === 4) cell.alignment = { horizontal: 'left' };
                    else cell.alignment = { horizontal: 'right' };
                }
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
                if (colNumber === 6 || colNumber === 7) cell.numFmt = '#,##0.00';
            });
            worksheet.getCell(`A${dataRow.number}`).border.left = { style: 'medium' };
            worksheet.getCell(`G${dataRow.number}`).border.right = { style: 'medium' };
        });

        // Toplam Satırı
        const footerRow = worksheet.addRow([null, null, null, null, null, 'TOPLAM  ', grandTotal]);
        worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
        
        const mergedCell = worksheet.getCell(`A${footerRow.number}`);
        mergedCell.font = { bold: true, name: 'Tahoma' };
        mergedCell.border = {
            top: { style: 'thick' },
            bottom: { style: 'thick' },
            left: { style: 'medium' }
        };

        const toplamCell = worksheet.getCell(`F${footerRow.number}`);
        toplamCell.style = {
            font: { bold: true, name: 'Tahoma' },
            alignment: { horizontal: 'right' },
            border: {
                top: { style: 'thick' },
                bottom: { style: 'thick' },
                right: { style: 'thin' }
            }
        };

        const grandTotalCell = worksheet.getCell(`G${footerRow.number}`);
        grandTotalCell.value = grandTotal;
        grandTotalCell.style = {
            font: { bold: true, name: 'Tahoma', size: 10 },
            alignment: { horizontal: 'right' },
            border: {
                top: { style: 'thick' },
                bottom: { style: 'thick' },
                left: { style: 'thin' },
                right: { style: 'medium' }
            },
            numFmt: '#,##0.00'
        };


        // Sütun Genişlikleri
        worksheet.columns = [
            { width: 5 }, { width: 45 }, { width: 20 }, { width: 10 },
            { width: 12 }, { width: 12 }, { width: 15 }
        ];

        // Sayfa çıktısı A4'e sığacak şekilde ayarlanıyor
        worksheet.pageSetup = {
            paperSize: 9, // A4
            orientation: 'portrait',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0
        };

        // Dosyayı oluştur ve indir
        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = `Depo_Sayim_Raporu_${formattedDate.replace(/\./g, '-')}.xlsx`;
        saveAs(new Blob([buffer]), fileName);

    } catch (error) {
        console.error('Rapor oluşturulurken bir hata oluştu:', error);
        alert('Rapor oluşturulurken beklenmedik bir hata oluştu. Lütfen konsolu kontrol edin.');
    }
} 

