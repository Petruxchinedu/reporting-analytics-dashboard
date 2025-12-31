module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs, [project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
(()=>{
    const e = new Error("Cannot find module '@/components/layout/DashboardLayout'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function HomePage() {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [
        status,
        router
    ]);
    if (status === "loading") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Text"], {
            p: 6,
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/pages/index.tsx",
            lineNumber: 18,
            columnNumber: 12
        }, this);
    }
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
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Text"], {
                    color: "gray.600",
                    _dark: {
                        color: "gray.400"
                    },
                    children: "This is your dashboard. Charts and analytics will appear here."
                }, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/index.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 22,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e40151e7._.js.map