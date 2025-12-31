(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/ui/toaster.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster,
    "toaster",
    ()=>toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$toast$2f$toast$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/toast/toast.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ark$2d$ui$2b$react$40$5$2e$30$2e$0_react$2d$_3d7ffd422f8bfd84e62083a5c43dcea2$2f$node_modules$2f40$ark$2d$ui$2f$react$2f$dist$2f$components$2f$portal$2f$portal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ark-ui+react@5.30.0_react-_3d7ffd422f8bfd84e62083a5c43dcea2/node_modules/@ark-ui/react/dist/components/portal/portal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ark$2d$ui$2b$react$40$5$2e$30$2e$0_react$2d$_3d7ffd422f8bfd84e62083a5c43dcea2$2f$node_modules$2f40$ark$2d$ui$2f$react$2f$dist$2f$components$2f$toast$2f$create$2d$toaster$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ark-ui+react@5.30.0_react-_3d7ffd422f8bfd84e62083a5c43dcea2/node_modules/@ark-ui/react/dist/components/toast/create-toaster.js [client] (ecmascript)");
"use client";
;
;
const toaster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ark$2d$ui$2b$react$40$5$2e$30$2e$0_react$2d$_3d7ffd422f8bfd84e62083a5c43dcea2$2f$node_modules$2f40$ark$2d$ui$2f$react$2f$dist$2f$components$2f$toast$2f$create$2d$toaster$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createToaster"])({
    placement: "top-end",
    pauseOnPageIdle: true
});
const Toaster = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ark$2d$ui$2b$react$40$5$2e$30$2e$0_react$2d$_3d7ffd422f8bfd84e62083a5c43dcea2$2f$node_modules$2f40$ark$2d$ui$2f$react$2f$dist$2f$components$2f$portal$2f$portal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$toast$2f$toast$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Toaster"], {
            toaster: toaster,
            insetInline: 6,
            children: (toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"], {
                    gap: "1",
                    width: "full",
                    children: [
                        toast.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                            fontWeight: "medium",
                            fontSize: "sm",
                            children: toast.title
                        }, void 0, false, {
                            fileName: "[project]/components/ui/toaster.tsx",
                            lineNumber: 23,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        toast.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
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
_c = Toaster;
// Minimal helper Box if not imported
const Box = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c1 = Box;
var _c, _c1;
__turbopack_context__.k.register(_c, "Toaster");
__turbopack_context__.k.register(_c1, "Box");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/color-mode.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$client$2d$only$2f$client$2d$only$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/client-only/client-only.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/icon-button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$skeleton$2f$skeleton$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/skeleton/skeleton.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom_e1ec481706e606e7e4324a4b413dee80/node_modules/next-themes/dist/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ColorModeProvider(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        disableTransitionOnChange: true,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = ColorModeProvider;
function useColorMode() {
    _s();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const toggleColorMode = ()=>{
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };
    return {
        colorMode: resolvedTheme,
        setColorMode: setTheme,
        toggleColorMode
    };
}
_s(useColorMode, "ejWDJnui7w93Zr0cEZ1cyBPw8dI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_e1ec481706e606e7e4324a4b413dee80$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
function ColorModeIcon() {
    _s1();
    const { colorMode } = useColorMode();
    return colorMode === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuMoon"], {}, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 32,
        columnNumber: 34
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuSun"], {}, void 0, false, {
        fileName: "[project]/components/ui/color-mode.tsx",
        lineNumber: 32,
        columnNumber: 47
    }, this);
}
_s1(ColorModeIcon, "2Uu86IH3do63pkN3s1ysdRMmJuc=", false, function() {
    return [
        useColorMode
    ];
});
_c1 = ColorModeIcon;
const ColorModeButton = /*#__PURE__*/ _s2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = _s2(function ColorModeButton(props, ref) {
    _s2();
    const { toggleColorMode } = useColorMode();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$client$2d$only$2f$client$2d$only$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ClientOnly"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$skeleton$2f$skeleton$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Skeleton"], {
            boxSize: "8"
        }, void 0, false, {
            fileName: "[project]/components/ui/color-mode.tsx",
            lineNumber: 41,
            columnNumber: 27
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorModeIcon, {}, void 0, false, {
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
}, "pCB/HNB8FhZAEYh1hiUHUsp1udk=", false, function() {
    return [
        useColorMode
    ];
})), "pCB/HNB8FhZAEYh1hiUHUsp1udk=", false, function() {
    return [
        useColorMode
    ];
});
_c3 = ColorModeButton;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ColorModeProvider");
__turbopack_context__.k.register(_c1, "ColorModeIcon");
__turbopack_context__.k.register(_c2, "ColorModeButton$React.forwardRef");
__turbopack_context__.k.register(_c3, "ColorModeButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/theme-toggle.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/icon-button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/color-mode.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_@emo_0bf3b8454e7d9e67f8319eee601a9896/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ThemeToggle() {
    _s();
    const { colorMode, toggleColorMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useColorMode"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // useEffect only runs on the client. 
    // This tells the component it's safe to show the correct icon.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>{
            setMounted(true);
        }
    }["ThemeToggle.useEffect"], []);
    // If not mounted, we render a placeholder (or nothing) to match the server
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
            variant: "ghost",
            size: "lg",
            disabled: true,
            "aria-label": "Loading theme"
        }, void 0, false, {
            fileName: "[project]/components/ui/theme-toggle.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["motion"].div, {
        whileTap: {
            scale: 0.9
        },
        whileHover: {
            scale: 1.1
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
            onClick: toggleColorMode,
            variant: "ghost",
            "aria-label": "Toggle theme",
            size: "lg",
            borderRadius: "full",
            color: "teal.500",
            children: colorMode === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuMoon"], {}, void 0, false, {
                fileName: "[project]/components/ui/theme-toggle.tsx",
                lineNumber: 37,
                columnNumber: 34
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuSun"], {}, void 0, false, {
                fileName: "[project]/components/ui/theme-toggle.tsx",
                lineNumber: 37,
                columnNumber: 47
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/theme-toggle.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/theme-toggle.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "HT1oIba5PZOyaIqntdLI1QVmVME=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useColorMode"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/login.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/box/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/flex/flex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/heading/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/text/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$input$2f$input$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/input/input.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/icon-button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/h-stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$link$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/link/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$field$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/field/namespace.js [client] (ecmascript) <export * as Field>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_@emo_0bf3b8454e7d9e67f8319eee601a9896/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_@emo_0bf3b8454e7d9e67f8319eee601a9896/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_67011c482a976717e52bfafa95082b9d$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_67011c482a976717e52bfafa95082b9d/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toaster.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$theme$2d$toggle$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/theme-toggle.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const MotionFlex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["motion"].create(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"]);
_c = MotionFlex;
const MotionStack = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["motion"].create(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"]);
_c1 = MotionStack;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // URL Status Messages
    const isPending = searchParams.get("status") === "pending";
    const isVerified = searchParams.get("verified") === "true";
    const handleLogin = async (e)=>{
        e.preventDefault();
        setLoading(true);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_67011c482a976717e52bfafa95082b9d$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signIn"])("credentials", {
            email,
            password,
            redirect: false
        });
        if (result?.error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["toaster"].create({
                title: "Login Failed",
                description: result.error,
                type: "error"
            });
            setLoading(false);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toaster$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["toaster"].create({
                title: "Welcome back!",
                type: "success"
            });
            router.push("/");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
        minH: "100vh",
        direction: {
            base: "column",
            lg: "row"
        },
        bg: "white",
        _dark: {
            bg: "gray.950"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                flex: "1.2",
                bg: "teal.600",
                display: {
                    base: "none",
                    lg: "flex"
                },
                align: "center",
                justify: "center",
                p: 12,
                position: "relative",
                overflow: "hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        position: "absolute",
                        top: "-10%",
                        left: "-10%",
                        w: "500px",
                        h: "500px",
                        bg: "teal.500",
                        borderRadius: "full",
                        filter: "blur(100px)",
                        opacity: "0.4"
                    }, void 0, false, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionStack, {
                        gap: 8,
                        maxW: "440px",
                        zIndex: 1,
                        initial: {
                            opacity: 0,
                            x: -30
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Heading"], {
                                size: "4xl",
                                color: "white",
                                fontWeight: "black",
                                lineHeight: "shorter",
                                children: [
                                    "Experience the",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                        as: "span",
                                        color: "teal.200",
                                        display: "block",
                                        children: "next generation"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    "of reporting."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                fontSize: "xl",
                                color: "teal.50",
                                children: "Secure, fast, and beautifully designed for modern teams."
                            }, void 0, false, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/login.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                flex: "1",
                align: "center",
                justify: "center",
                p: 6,
                position: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        position: "absolute",
                        top: "6",
                        right: "6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$theme$2d$toggle$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                            fileName: "[project]/pages/login.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionFlex, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        direction: "column",
                        w: "full",
                        maxW: "md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"], {
                            gap: 8,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Heading"], {
                                            size: "3xl",
                                            fontWeight: "black",
                                            letterSpacing: "tight",
                                            children: "Sign In"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/login.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                            color: "gray.500",
                                            children: "Enter your credentials to continue."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/login.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/login.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_$40$emo_0bf3b8454e7d9e67f8319eee601a9896$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    children: [
                                        isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionStack, {
                                            initial: {
                                                height: 0,
                                                opacity: 0
                                            },
                                            animate: {
                                                height: "auto",
                                                opacity: 1
                                            },
                                            p: 4,
                                            bg: "orange.50",
                                            _dark: {
                                                bg: "orange.950/20"
                                            },
                                            borderRadius: "xl",
                                            border: "1px solid",
                                            borderColor: "orange.200",
                                            color: "orange.700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuCircleAlert"], {}, void 0, false, {
                                                            fileName: "[project]/pages/login.tsx",
                                                            lineNumber: 121,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                            fontSize: "sm",
                                                            fontWeight: "bold",
                                                            children: "Action Required"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/login.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/login.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                    fontSize: "xs",
                                                    children: "Please check your email to verify your account before logging in."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/login.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/login.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this),
                                        isVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionStack, {
                                            initial: {
                                                height: 0,
                                                opacity: 0
                                            },
                                            animate: {
                                                height: "auto",
                                                opacity: 1
                                            },
                                            p: 4,
                                            bg: "green.50",
                                            _dark: {
                                                bg: "green.950/20"
                                            },
                                            borderRadius: "xl",
                                            border: "1px solid",
                                            borderColor: "green.200",
                                            color: "green.700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuCircleCheck"], {}, void 0, false, {
                                                            fileName: "[project]/pages/login.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                            fontSize: "sm",
                                                            fontWeight: "bold",
                                                            children: "Email Verified"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/login.tsx",
                                                            lineNumber: 135,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/login.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                    fontSize: "xs",
                                                    children: "Your account is active. You can now log in below."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/login.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/login.tsx",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/login.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleLogin,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"], {
                                        gap: 5,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$field$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Root, {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$field$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Label, {
                                                        fontWeight: "bold",
                                                        fontSize: "xs",
                                                        color: "gray.500",
                                                        children: "EMAIL ADDRESS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/login.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$input$2f$input$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        size: "lg",
                                                        borderRadius: "xl",
                                                        placeholder: "name@company.com",
                                                        value: email,
                                                        onChange: (e)=>setEmail(e.target.value),
                                                        required: true,
                                                        bg: "gray.50",
                                                        _dark: {
                                                            bg: "gray.800"
                                                        },
                                                        border: "none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/login.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/login.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$field$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Root, {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                                                        justify: "space-between",
                                                        align: "center",
                                                        mb: 1,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$field$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Label, {
                                                            fontWeight: "bold",
                                                            fontSize: "xs",
                                                            color: "gray.500",
                                                            mb: 0,
                                                            children: "PASSWORD"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/login.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/login.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                                                        width: "full",
                                                        gap: 0,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$input$2f$input$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                type: showPassword ? "text" : "password",
                                                                size: "lg",
                                                                borderRightRadius: "0",
                                                                borderLeftRadius: "xl",
                                                                placeholder: "••••••••",
                                                                value: password,
                                                                onChange: (e)=>setPassword(e.target.value),
                                                                required: true,
                                                                bg: "gray.50",
                                                                _dark: {
                                                                    bg: "gray.800"
                                                                },
                                                                border: "none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/login.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
                                                                onClick: ()=>setShowPassword(!showPassword),
                                                                "aria-label": "toggle password",
                                                                variant: "subtle",
                                                                size: "lg",
                                                                borderLeftRadius: "0",
                                                                borderRightRadius: "xl",
                                                                bg: "gray.50",
                                                                _dark: {
                                                                    bg: "gray.800"
                                                                },
                                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuEyeOff"], {}, void 0, false, {
                                                                    fileName: "[project]/pages/login.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 39
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuEye"], {}, void 0, false, {
                                                                    fileName: "[project]/pages/login.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 54
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/login.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/login.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/login.tsx",
                                                lineNumber: 153,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$link$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Link"], {
                                                fontSize: "xs",
                                                color: "teal.600",
                                                fontWeight: "bold",
                                                onClick: ()=>router.push("/forgot-password"),
                                                children: "Forgot Password?"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/login.tsx",
                                                lineNumber: 177,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "submit",
                                                colorPalette: "teal",
                                                size: "xl",
                                                borderRadius: "xl",
                                                loading: loading,
                                                fontWeight: "bold",
                                                mt: 2,
                                                children: [
                                                    "Login to Account ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuArrowRight"], {}, void 0, false, {
                                                        fileName: "[project]/pages/login.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/login.tsx",
                                                lineNumber: 184,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/login.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                    textAlign: "center",
                                    fontSize: "sm",
                                    color: "gray.500",
                                    children: [
                                        "Don't have an account?",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$link$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Link"], {
                                            color: "teal.500",
                                            fontWeight: "extrabold",
                                            onClick: ()=>router.push("/signup"),
                                            children: "Get Started"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/login.tsx",
                                            lineNumber: 195,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/login.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/login.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/login.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/login.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "VTvNFmJfBxsBs4EtWB+AgLbj7MY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c2 = LoginPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MotionFlex");
__turbopack_context__.k.register(_c1, "MotionStack");
__turbopack_context__.k.register(_c2, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/login.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/login";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/login.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/login\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/login.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__b21b2080._.js.map