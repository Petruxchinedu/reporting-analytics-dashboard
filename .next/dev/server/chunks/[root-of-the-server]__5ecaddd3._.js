module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
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
"[project]/models/User.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// models/User.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.0.2/node_modules/mongoose)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "admin",
            "user"
        ],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    settings: {
        darkMode: {
            type: Boolean,
            default: false
        },
        notifications: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$0$2e$2$2f$node_modules$2f$mongoose$29$__["default"].model("User", UserSchema);
const __TURBOPACK__default__export__ = User;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/pages/api/auth/signup.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import, [project]/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["connectDB"])();
    const { name, email, password } = req.body;
    try {
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOne({
            email
        });
        if (existingUser) return res.status(400).json({
            message: "Email already exists"
        });
        const hashedPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$29$__["default"].hash(password, 12);
        // Generate a unique verification token
        const verificationToken = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("hex");
        const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false,
            role: "user"
        });
        // SIMULATION: In reality, you'd email this link:
        // http://localhost:3000/verify-email?token=${verificationToken}
        console.log("VERIFICATION LINK:", `http://localhost:3000/verify-email?token=${verificationToken}`);
        return res.status(201).json({
            message: "User created. Please verify your email."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error during signup"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5ecaddd3._.js.map