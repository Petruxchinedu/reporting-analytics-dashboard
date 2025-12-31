module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/models/Report.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// models/Report.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.0.2/node_modules/mongoose)");
;
const ReportSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Generated"
        ],
        default: "Pending"
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
const Report = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["default"].models.Report || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["default"].model("Report", ReportSchema);
const __TURBOPACK__default__export__ = Report;
}),
"[project]/lib/db.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
// lib/db.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.0.2/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI).then((conn)=>{
            console.log("✅ MongoDB connected"); // <-- logs on server start
            return conn;
        }).catch((err)=>{
            console.error("❌ MongoDB connection error:", err);
            throw err;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[project]/pages/api/analytics/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs, [project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Report$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Report.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [api] (ecmascript)");
;
;
;
;
async function handler(req, res) {
    const session = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__["getSession"])({
        req
    });
    if (!session) return res.status(401).json({
        message: "Unauthorized"
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["connectDB"])();
    const totalReports = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Report$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].countDocuments({
        user: session.user.id
    });
    const pendingReports = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Report$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].countDocuments({
        user: session.user.id,
        status: "Pending"
    });
    const generatedReports = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Report$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].countDocuments({
        user: session.user.id,
        status: "Generated"
    });
    return res.status(200).json({
        stats: [
            {
                label: "Total Reports",
                value: totalReports,
                change: "+5%",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$api$5d$__$28$ecmascript$29$__["LuFileText"]
            },
            {
                label: "Pending Reports",
                value: pendingReports,
                change: "-2%",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$api$5d$__$28$ecmascript$29$__["LuActivity"]
            },
            {
                label: "Generated Reports",
                value: generatedReports,
                change: "+3%",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$api$5d$__$28$ecmascript$29$__["LuTrendingUp"]
            }
        ]
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f00d78ec._.js.map