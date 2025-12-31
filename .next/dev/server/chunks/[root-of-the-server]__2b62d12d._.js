module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/reports.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
// Mock report data
const reportsData = [
    {
        id: "#REP-001",
        name: "Monthly Revenue",
        date: "Oct 2023",
        status: "Generated"
    },
    {
        id: "#REP-002",
        name: "User Retention",
        date: "Oct 2023",
        status: "Generated"
    },
    {
        id: "#REP-003",
        name: "Q3 Tax Summary",
        date: "Sept 2024",
        status: "Generated"
    },
    {
        id: "#REP-004",
        name: "Q3 income",
        date: "Aug 2025",
        status: "Generated"
    },
    {
        id: "#REP-005",
        name: "Q3 Total Revenue",
        date: "Dec 2025",
        status: "Pending"
    },
    {
        id: "#REP-006",
        name: "Q3 Tax Summary",
        date: "Sept 2025",
        status: "Pending"
    }
];
function handler(req, res) {
    res.status(200).json(reportsData);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b62d12d._.js.map