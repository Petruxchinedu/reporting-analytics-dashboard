module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/analytics.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
// Mock analytics data
const analyticsData = {
    stats: [
        {
            label: "Total Visits",
            value: "128,430",
            change: "+12.5%",
            icon: "LuUsers"
        },
        {
            label: "Avg. Session",
            value: "4m 32s",
            change: "+2.1%",
            icon: "LuActivity"
        },
        {
            label: "Conversion Rate",
            value: "3.42%",
            change: "+0.8%",
            icon: "LuTrendingUp"
        }
    ]
};
function handler(req, res) {
    res.status(200).json(analyticsData);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c87965ea._.js.map