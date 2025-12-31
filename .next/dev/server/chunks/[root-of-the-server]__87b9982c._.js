module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/test-db.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/api/test-db.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
(()=>{
    const e = new Error("Cannot find module '@/lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
async function handler(req, res) {
    try {
        await connectDB();
        res.status(200).json({
            message: "MongoDB connected"
        });
    } catch (err) {
        res.status(500).json({
            message: "MongoDB connection failed",
            error: err
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__87b9982c._.js.map