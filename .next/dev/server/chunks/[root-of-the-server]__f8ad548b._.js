module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/users.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock users for demonstration
__turbopack_context__.s([
    "users",
    ()=>users
]);
const users = [
    {
        id: 1,
        email: "test@example.com",
        password: "password123",
        name: "Test User"
    }
];
}),
"[project]/pages/api/auth/signup.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import, [project]/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }
    // Check if user already exists
    const existingUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["users"].find((u)=>u.email === email);
    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }
    // ✅ Hash password
    const hashedPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__["default"].hash(password, 10);
    // Create new user
    const newUser = {
        id: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["users"].length + 1,
        name,
        email,
        password: hashedPassword
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["users"].push(newUser);
    return res.status(201).json({
        message: "User created successfully"
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f8ad548b._.js.map