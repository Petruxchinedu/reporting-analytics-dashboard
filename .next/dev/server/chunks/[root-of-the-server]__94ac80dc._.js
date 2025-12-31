module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/auth/verify.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
(()=>{
    const e = new Error("Cannot find module '@/lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/models/User'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();
    await connectDB();
    const { token } = req.query;
    const user = await User.findOne({
        verificationToken: token
    });
    if (!user) {
        return res.status(400).json({
            message: "Invalid or expired token"
        });
    }
    user.isVerified = true;
    user.verificationToken = undefined; // Remove token once used
    await user.save();
    return res.status(200).json({
        message: "Email verified successfully"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__94ac80dc._.js.map