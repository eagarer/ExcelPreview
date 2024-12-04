import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelPreview = () => {
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // İlk sayfayı al
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Sayfayı JSON formatına çevir
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // İlk satır başlıkları, sonraki satırlar veriler
        const [headers, ...rows] = jsonData;

        // İlk 10 satırı önizleme için ayır
        const preview = rows.slice(0, 10);

        setColumns(headers);
        setPreviewData(preview);
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Excel Yükleme ve Önizleme</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {/* Önizleme Tablosu */}
      {previewData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Önizleme (İlk 10 Satır):</h4>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} style={{ padding: "8px", textAlign: "left" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ padding: "8px" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelPreview;
