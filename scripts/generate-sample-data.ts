import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// Sample data for testing the contact enrichment agent
const sampleData = [
  {
    Name: "John Smith",
    University: "Massachusetts Institute of Technology",
  },
  {
    Name: "Jane Doe",
    University: "Stanford University",
  },
  {
    Name: "Robert Johnson",
    University: "Harvard University",
  },
  {
    Name: "Emily Chen",
    University: "University of California Berkeley",
  },
  {
    Name: "Michael Brown",
    University: "Princeton University",
  },
  {
    Name: "Sarah Williams",
    University: "Yale University",
  },
  {
    Name: "David Lee",
    University: "California Institute of Technology",
  },
  {
    Name: "Lisa Garcia",
    University: "Columbia University",
  },
  {
    Name: "James Wilson",
    University: "University of Cambridge",
  },
  {
    Name: "Maria Rodriguez",
    University: "Oxford University",
  },
];

function generateSampleExcel() {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 20 }, // Name column width
    { wch: 35 }, // University column width
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Data");

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write file
  const filePath = path.join(publicDir, "sample-data.xlsx");
  XLSX.writeFile(workbook, filePath);

  console.log("✅ Sample Excel file generated successfully!");
  console.log(`📄 Location: ${filePath}`);
  console.log(`📊 Records: ${sampleData.length}`);
  console.log("\nYou can use this file to test the contact enrichment agent.");
  console.log(
    "Download it from: http://localhost:3000/sample-data.xlsx (when server is running)"
  );
}

// Run the generator
generateSampleExcel();
