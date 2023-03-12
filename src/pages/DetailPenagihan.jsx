import pdfMake, { fonts } from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

import { useState } from "react";
import * as XLSX from "xlsx";
import { font } from "../assets/js/RobotoMedium";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.pdfMake.vfs["Roboto-Medium.ttf"] = font;
console.log("pdfMake", pdfMake);

export const DetailPenagihan = () => {
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);

  pdfMake.fonts = {
    Roboto: {
      normal: "Roboto-Medium.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Medium.ttf",
      bolditalics: "Roboto-Medium.ttf",
    },
  };

  const data = {
    title: "My PDF Document",
    tableHeader: [
      "No",
      "TID",
      "Zona",
      "Kanwil",
      "Kanca Supervisi",
      "Unit Kerja",
      "Reliability BRI",
      "Tiering",
      "Biaya FMS/BLN",
      "Nilai Pembayaran",
    ],
    tableData: [
      tableData.slice(0, -5).map((item, index) => {
        return [
          item[0],
          item[1],
          item[2],
          item[3],
          item[4],
          // add style to cell
          // { text: item[5], bold: true },
          item[5],
          parseFloat(item[6] * 100).toFixed(2) + "%",
          item[7] * 100 + "%",
          parseInt(item[8]).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
          parseInt(item[9]).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
        ];
      }),
    ],
  };

  const table = {
    content: [
      {
        text: data.title,
        style: "title",
      },
      {
        style: "table",
        table: {
          headerRows: 1,
          body: [data.tableHeader, ...data.tableData[0]],
        },
      },
    ],
    pageOrientation: "landscape",
    pageSize: "A4",
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
        color: "red",
      },
      table: {
        margin: [0, 5, 0, 15],
      },
    },
    headerStyles: {
      fillColor: "#eeeeee",
      color: "red",
      fontSize: 200,
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  const handleUpload = (e) => {
    const reader = new FileReader();

    if (
      e.target.files[0].type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      console.log("File harus excel");
    }

    if (e.target.files[0].name !== "Example Pembayaran.xlsx") {
      console.log("File harus bernama Example Pembayaran.xlsx");
      e.target.value = "";
    }

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetLength = workbook.SheetNames.length;

      for (let i = 0; i < sheetLength; i++) {
        const sheetName = workbook.SheetNames[i];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log("original data", data);

        setOriginalData(data);

        const tableData = data.map((item, index) => {
          const value = Object.values(item);
          return value;
        });
        setTableData(tableData);

        const test = tableData.slice(-5);
        console.log("test", test);
      }
    };

    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const footer = (currentPage, pageCount) => {
    return {
      text: `${currentPage.toString()} of ${pageCount}`,
      alignment: "center",
      margin: [0, 20],
      font: "Roboto",
    };
  };

  const downloadPdf = () => {
    const pdfGenerator = pdfMake.createPdf(table, null, fonts, footer);
    pdfGenerator.getBlob((blob) => {
      console.log(blob);
      window.open(URL.createObjectURL(blob));
    });
  };

  return (
    <div>
      <h1>Detail Penagihan</h1>
      <button style={{ marginBottom: "10px" }} onClick={downloadPdf}>
        Download
      </button>

      <form>
        <input type="file" onChange={handleUpload} />
      </form>
      <h1 style={{ fontFamily: "Roboto" }}>Test</h1>
    </div>
  );
};
