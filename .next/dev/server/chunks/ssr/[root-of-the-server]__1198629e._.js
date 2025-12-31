module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/store/sessionSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "clearUser",
    ()=>clearUser,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setUser",
    ()=>setUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import, [project]/node_modules/.pnpm/@reduxjs+toolkit@2.11.2_rea_1f129cae76f3a7c2673f496bd07a36ef/node_modules/@reduxjs/toolkit)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const initialState = {
    user: null,
    isAuthenticated: false
};
const sessionSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: "session",
    initialState,
    reducers: {
        setUser (state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser (state) {
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});
const { setUser, clearUser } = sessionSlice.actions;
const __TURBOPACK__default__export__ = sessionSlice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/filtersSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "setDateRange",
    ()=>setDateRange,
    "setMetric",
    ()=>setMetric,
    "setRegion",
    ()=>setRegion
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import, [project]/node_modules/.pnpm/@reduxjs+toolkit@2.11.2_rea_1f129cae76f3a7c2673f496bd07a36ef/node_modules/@reduxjs/toolkit)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const initialState = {
    metric: "revenue",
    region: "global",
    dateRange: {
        from: "2024-01-01",
        to: "2024-12-31"
    }
};
const filtersSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: "filters",
    initialState,
    reducers: {
        setMetric (state, action) {
            state.metric = action.payload;
        },
        setRegion (state, action) {
            state.region = action.payload;
        },
        setDateRange (state, action) {
            state.dateRange = action.payload;
        }
    }
});
const { setMetric, setRegion, setDateRange } = filtersSlice.actions;
const __TURBOPACK__default__export__ = filtersSlice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/authSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "clearUser",
    ()=>clearUser,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setUser",
    ()=>setUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import, [project]/node_modules/.pnpm/@reduxjs+toolkit@2.11.2_rea_1f129cae76f3a7c2673f496bd07a36ef/node_modules/@reduxjs/toolkit)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const initialState = {
    user: null
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action)=>{
            state.user = action.payload;
        },
        clearUser: (state)=>{
            state.user = null;
        }
    }
});
const { setUser, clearUser } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/index.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import, [project]/node_modules/.pnpm/@reduxjs+toolkit@2.11.2_rea_1f129cae76f3a7c2673f496bd07a36ef/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$sessionSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/sessionSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$filtersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/filtersSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/authSlice.ts [ssr] (ecmascript)"); // New slice for user authentication
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$sessionSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$filtersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$sessionSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$filtersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$11$2e$2_rea_1f129cae76f3a7c2673f496bd07a36ef$2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["configureStore"])({
    reducer: {
        session: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$sessionSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        filters: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$filtersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/ui/toaster.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster,
    "toaster",
    ()=>toaster
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
const toaster = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["createToaster"])({
    placement: "top-end",
    pauseOnPageIdle: true
});
const Toaster = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Toaster"], {
            toaster: toaster,
            insetInline: 6,
            children: (toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Stack"], {
                    gap: "1",
                    width: "full",
                    children: [
                        toast.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Box, {
                            fontWeight: "medium",
                            fontSize: "sm",
                            children: toast.title
                        }, void 0, false, {
                            fileName: "[project]/components/ui/toaster.tsx",
                            lineNumber: 23,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        toast.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Box, {
                            fontSize: "xs",
                            color: "fg.muted",
                            children: toast.description
                        }, void 0, false, {
                            fileName: "[project]/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/toaster.tsx",
                    lineNumber: 21,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/toaster.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/toaster.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// Minimal helper Box if not imported
const Box = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ...props,
        style: {
            display: "flex",
            flexDirection: "column",
            ...props.style
        }
    }, void 0, false, {
        fileName: "[project]/components/ui/toaster.tsx",
        lineNumber: 40,
        columnNumber: 29
    }, ("TURBOPACK compile-time value", void 0));
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/ui/color-mode.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ColorModeButton",
    ()=>ColorModeButton,
    "ColorModeIcon",
    ()=>ColorModeIcon,
    "ColorModeProvider",
    ()=>ColorModeProvider,
    "useColorMode",
    ()=>useColorMode
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$themes__$5b$external$5d$__$28$next$2d$themes$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$29$__ = __turbopack_context__.i("[externals]/next-themes [external] (next-themes, esm_import, [project]/node_modules/.pnpm/next-themes@0.4.6_react-dom_e1ec481706e606e7e4324a4b413dee80/node_modules/next-themes)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$themes__$5b$external$5d$__$28$next$2d$themes$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$themes__$5b$external$5d$__$28$next$2d$themes$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
function ColorModeProvider(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$themes__$5b$external$5d$__$28$next$2d$themes$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$29$__["ThemeProvider"], {
        attribute: "class",
        disableTransitionOnChange: true,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
function useColorMode() {
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$themes__$5b$external$5d$__$28$next$2d$themes$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$29$__["useTheme"])();
    const toggleColorMode = ()=>{
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };
    return {
        colorMode: resolvedTheme,
        setColorMode: setTheme,
        toggleColorMode
    };
}
function ColorModeIcon() {
    const { colorMode } = useColorMode();
    return colorMode === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["LuMoon"], {}, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 32,
        columnNumber: 34
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["LuSun"], {}, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 32,
        columnNumber: 47
    }, this);
}
const ColorModeButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["forwardRef"](function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["ClientOnly"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["Skeleton"], {
            boxSize: "8"
        }, void 0, false, {
            fileName: "[project]/components/ui/color-mode.tsx",
            lineNumber: 41,
            columnNumber: 27
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["IconButton"], {
            onClick: toggleColorMode,
            variant: "ghost",
            "aria-label": "Toggle color mode",
            size: "md",
            ref: ref,
            ...props,
            css: {
                _icon: {
                    width: "5",
                    height: "5"
                }
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ColorModeIcon, {}, void 0, false, {
                fileName: "[project]/components/ui/color-mode.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/color-mode.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__ = __turbopack_context__.i("[externals]/@chakra-ui/react [external] (@chakra-ui/react, esm_import, [project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__ = __turbopack_context__.i("[externals]/@tanstack/react-query [external] (@tanstack/react-query, esm_import, [project]/node_modules/.pnpm/@tanstack+react-query@5.90.14_react@19.2.3/node_modules/@tanstack/react-query)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/index.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/.pnpm/react-redux@9.2.0_@types+re_27e7276eae6588d5ce57c880a5ede4d7/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_67011c482a976717e52bfafa95082b9d$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs, [project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_67011c482a976717e52bfafa95082b9d/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toaster.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/color-mode.tsx [ssr] (ecmascript)"); // Manual file we created
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
const config = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["defineConfig"])({
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: {
                        value: "#e6fffa"
                    },
                    500: {
                        value: "#319795"
                    },
                    900: {
                        value: "#171923"
                    }
                }
            },
            fonts: {
                heading: {
                    value: `'Inter', sans-serif`
                },
                body: {
                    value: `'Inter', sans-serif`
                }
            }
        }
    }
});
const system = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["createSystem"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["defaultConfig"], config);
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    // Using useState for QueryClient prevents recreation on re-renders
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__["QueryClient"]());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$re_27e7276eae6588d5ce57c880a5ede4d7$2f$node_modules$2f$react$2d$redux$29$__["Provider"], {
            store: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["store"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_67011c482a976717e52bfafa95082b9d$2f$node_modules$2f$next$2d$auth$29$__["SessionProvider"], {
                session: session,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$chakra$2d$ui$2f$react__$5b$external$5d$__$2840$chakra$2d$ui$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$29$__["ChakraProvider"], {
                    value: system,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ColorModeProvider"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                                ...pageProps
                            }, void 0, false, {
                                fileName: "[project]/pages/_app.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
                                fileName: "[project]/pages/_app.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/_app.tsx",
                        lineNumber: 40,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/_app.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/_app.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/_app.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1198629e._.js.map