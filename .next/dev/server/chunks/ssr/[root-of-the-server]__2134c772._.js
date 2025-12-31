module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api/charts.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchChartOverview",
    ()=>fetchChartOverview
]);
async function fetchChartOverview(metric, range, region) {
    const res = await fetch(`/api/charts/overview?metric=${metric}&range=${range}&region=${region}`);
    if (!res.ok) {
        throw new Error("Failed to fetch chart data");
    }
    return res.json();
}
}),
"[project]/components/Charts/LineChart.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>LineChart
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__ = __turbopack_context__.i("[externals]/chart.js [external] (chart.js, esm_import, [project]/node_modules/.pnpm/chart.js@4.5.1/node_modules/chart.js)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$chartjs$2d$2$40$5$2e$3$2e$1_chart$2e$js$40$4$2e$5$2e$1_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$chartjs$2d$2$29$__ = __turbopack_context__.i("[externals]/react-chartjs-2 [external] (react-chartjs-2, esm_import, [project]/node_modules/.pnpm/react-chartjs-2@5.3.1_chart.js@4.5.1_react@19.2.3/node_modules/react-chartjs-2)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/.pnpm/react-redux@9.2.0_@types+re_27e7276eae6588d5ce57c880a5ede4d7/node_modules/react-redux)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$chartjs$2d$2$40$5$2e$3$2e$1_chart$2e$js$40$4$2e$5$2e$1_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$chartjs$2d$2$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$chartjs$2d$2$40$5$2e$3$2e$1_chart$2e$js$40$4$2e$5$2e$1_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$chartjs$2d$2$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["Chart"].register(__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["CategoryScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["LinearScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["PointElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["LineElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["Tooltip"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["Legend"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chart$2e$js$40$4$2e$5$2e$1$2f$node_modules$2f$chart$2e$js$29$__["Filler"]);
function LineChart() {
    const { metric } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.filters);
    // Pull teal.500 from your Chakra theme tokens
    const [brandColor] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["useToken"])("colors", [
        "teal.500"
    ]);
    const data = {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        datasets: [
            {
                fill: true,
                label: metric.toUpperCase(),
                // Note: In a real app, generateMockData should be memoized or inside useEffect
                data: [
                    400,
                    450,
                    420,
                    500,
                    600,
                    550,
                    700,
                    800,
                    750,
                    900,
                    850,
                    1000
                ],
                borderColor: brandColor,
                // Creating a beautiful fade-out gradient
                backgroundColor: (context)=>{
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(49, 151, 149, 0.4)");
                    gradient.addColorStop(1, "rgba(49, 151, 149, 0)");
                    return gradient;
                },
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 3
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: "#1A202C",
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#718096"
                } // gray.500
            },
            y: {
                border: {
                    dash: [
                        4,
                        4
                    ]
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    color: "#718096"
                }
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Box"], {
        h: "350px",
        w: "full",
        p: 4,
        bg: "white",
        _dark: {
            bg: "gray.900"
        },
        borderRadius: "xl",
        boxShadow: "sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$chartjs$2d$2$40$5$2e$3$2e$1_chart$2e$js$40$4$2e$5$2e$1_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$chartjs$2d$2$29$__["Line"], {
            data: data,
            options: options
        }, void 0, false, {
            fileName: "[project]/components/Charts/LineChart.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Charts/LineChart.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs, [project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
(()=>{
    const e = new Error("Cannot find module ''");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__ = __turbopack_context__.i("[externals]/@tanstack/react-query [external] (@tanstack/react-query, esm_import, [project]/node_modules/.pnpm/@tanstack+react-query@5.90.14_react@19.2.3/node_modules/@tanstack/react-query)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$charts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/charts.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/.pnpm/react-redux@9.2.0_@types+re_27e7276eae6588d5ce57c880a5ede4d7/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Charts$2f$LineChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Charts/LineChart.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Charts$2f$LineChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Charts$2f$LineChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Enforce login every time
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (status === "unauthenticated") {
            router.push("/login"); // Always redirect to login if not authenticated
        }
    }, [
        status,
        router
    ]);
    // Global filters from Redux
    const { metric, region, dateRange } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.filters);
    // Fetch chart data
    const { data, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__["useQuery"])({
        queryKey: [
            "chart-overview",
            metric,
            region,
            dateRange
        ],
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$charts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchChartOverview"])(metric, "monthly", region),
        keepPreviousData: true,
        staleTime: 1000 * 60
    });
    if (status === "loading") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Text"], {
        p: 6,
        children: "Checking session..."
    }, void 0, false, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 38,
        columnNumber: 36
    }, this);
    if (status === "unauthenticated") return null; // Ensure nothing renders if not logged in
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DashboardLayout, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Box"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Heading"], {
                    size: "lg",
                    mb: 2,
                    children: [
                        "Welcome, ",
                        session?.user?.name || session?.user?.email
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Text"], {
                    color: "gray.600",
                    _dark: {
                        color: "gray.400"
                    },
                    mb: 6,
                    children: "This is your dashboard. Charts and analytics will appear here."
                }, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Spinner"], {}, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Text"], {
                    color: "red.500",
                    children: "Failed to load chart data"
                }, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Charts$2f$LineChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    labels: data.labels,
                    data: data.data,
                    title: data.metric.toUpperCase()
                }, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/index.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2134c772._.js.map