import fetch from "node-fetch";

export class NsCovidData {
  private static _instance: NsCovidData;

  protected url = "https://novascotia.ca/coronavirus/data/ns-covid19-data.csv";

  static get instance() {
    if (!this._instance) {
      this._instance = new NsCovidData();
    }
    return this._instance;
  }

  private constructor() {}

  async getData() {
    const res = await fetch(this.url);
    const data = await res.text();

    const json = this.csvToJson(data);
    return json;
  }

  private csvToJson(data: string): DataLine[] {
    const lines = data.split("\n").map((line) => line.split(","));
    const headers = lines[1];

    // Headers sanity check
    const isExpectedFormat =
      headers[CsvHeader.Date] === "Date" &&
      headers[CsvHeader.NewCases] === "New" &&
      headers[CsvHeader.NewDeaths] === "Deaths";

    if (!isExpectedFormat) {
      throw new Error("Unexpected CSV format found");
    }

    // First 2 lines are just headers
    const dataLines = lines.slice(2);

    return dataLines.map((line) => ({
      id: Number(new Date(line[CsvHeader.Date])) / 1000,
      date: line[CsvHeader.Date],
      cases: Number(line[CsvHeader.NewCases]),
      deaths: Number(line[CsvHeader.NewDeaths]),
    }));
  }
}

enum CsvHeader {
  Date,
  NewCases,
  ResolvedCases,
  HospitalizedNonIcu,
  HospitalizedIcu,
  NewDeaths,
  NewTests,
  NewNegativeTests,
  CasesWestern,
  CasesNorthern,
  CasesEastern,
  CasesCentral,
}

export interface DataLine {
  id: number;
  date: string;
  cases: number;
  deaths: number;
}
