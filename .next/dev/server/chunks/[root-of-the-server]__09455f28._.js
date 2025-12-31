module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/charts/overview.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { metric, range, region } = req.query;
    if (!metric || !range || !region) {
        return res.status(400).json({
            error: "Missing query parameters"
        });
    }
    // Mock data generator (replace with DB later)
    const labels = range === "monthly" ? [
        "Jan",
        "Feb",
        "Mar",
        "Apr"
    ] : range === "weekly" ? [
        "Week 1",
        "Week 2",
        "Week 3"
    ] : [
        "2022",
        "2023",
        "2024"
    ];
    const data = labels.map(()=>Math.floor(Math.random() * 3000) + 500);
    const response = {
        metric: metric,
        range: range,
        labels,
        data
    };
    return res.status(200).json(response);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09455f28._.js.map