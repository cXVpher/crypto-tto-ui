function escapeCsvValue(value: string | number | boolean | null | undefined) {
  const normalized = value == null ? "" : String(value);

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

export function toCsv(
  rows: Array<Record<string, string | number | boolean | null | undefined>>
) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
}

export function downloadCsvFile(
  filename: string,
  rows: Array<Record<string, string | number | boolean | null | undefined>>
) {
  if (typeof window === "undefined") {
    return;
  }

  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
