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
"[project]/components/layout/Sidebar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/box/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/text/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$icon$2f$icon$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/icon/icon.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/flex/flex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$link$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/link/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)"); // Lucide icons look great with v3
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuLayoutDashboard"]
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuChartBar"]
    },
    {
        label: "Reports",
        href: "/reports",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuFileText"]
    },
    {
        label: "Settings",
        href: "/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuSettings"]
    }
];
function Sidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
        h: "full",
        w: "full",
        p: 4,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                align: "center",
                gap: 3,
                px: 3,
                mb: 10,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        bg: "teal.600",
                        p: 1.5,
                        borderRadius: "lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$icon$2f$icon$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                            color: "white",
                            fontSize: "xl",
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuLayoutDashboard"]
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                        fontSize: "xl",
                        fontWeight: "bold",
                        letterSpacing: "tight",
                        children: "SaaS Admin"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Stack"], {
                gap: 1,
                children: navItems.map((item)=>{
                    const isActive = pathname === item.href;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$link$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Link"], {
                        asChild: true,
                        textDecoration: "none",
                        _hover: {
                            textDecoration: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                px: 3,
                                py: 2.5,
                                borderRadius: "lg",
                                transition: "all 0.2s",
                                fontWeight: "medium",
                                fontSize: "sm",
                                bg: isActive ? "teal.50" : "transparent",
                                color: isActive ? "teal.700" : "gray.600",
                                _dark: {
                                    bg: isActive ? "teal.900/30" : "transparent",
                                    color: isActive ? "teal.200" : "gray.400"
                                },
                                _hover: {
                                    bg: isActive ? "teal.50" : "gray.100",
                                    color: isActive ? "teal.700" : "gray.900",
                                    _dark: {
                                        bg: isActive ? "teal.900/30" : "gray.800",
                                        color: isActive ? "teal.200" : "gray.100"
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$icon$2f$icon$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        as: item.icon,
                                        fontSize: "lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 75,
                                        columnNumber: 19
                                    }, this),
                                    item.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 50,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 49,
                            columnNumber: 15
                        }, this)
                    }, item.href, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/Sidebar.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
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
"[project]/components/layout/Topbar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Topbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/box/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/flex/flex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/heading/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$input$2f$input$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/input/input.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/icon-button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/h-stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/text/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/menu/namespace.js [client] (ecmascript) <export * as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/color-mode.tsx [client] (ecmascript)"); // Use standard v3 hook
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Topbar() {
    _s();
    const { colorMode, toggleColorMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useColorMode"])();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSearch = (e)=>{
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    // You can redirect to: router.push(`/search?q=${searchQuery}`)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
        h: "70px",
        align: "center",
        justify: "space-between",
        px: 6,
        bg: "white/80",
        _dark: {
            bg: "gray.900/80"
        },
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: "0",
        zIndex: "10",
        borderBottom: "1px solid",
        borderColor: "gray.100",
        _darkBorderColor: "gray.800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                gap: 4,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Heading"], {
                    size: "md",
                    fontWeight: "semibold",
                    children: "Overview"
                }, void 0, false, {
                    fileName: "[project]/components/layout/Topbar.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Topbar.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                display: {
                    base: "none",
                    md: "block"
                },
                maxW: "400px",
                w: "full",
                mx: 8,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSearch,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        position: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                position: "absolute",
                                left: "3",
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: "1",
                                color: "gray.400",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuSearch"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Topbar.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$input$2f$input$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Search reports or metrics...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                pl: "10",
                                bg: "gray.100",
                                border: "none",
                                _focus: {
                                    bg: "white",
                                    ring: "2px",
                                    ringColor: "teal.500"
                                },
                                _dark: {
                                    bg: "gray.800",
                                    _focus: {
                                        bg: "gray.700"
                                    }
                                },
                                borderRadius: "full"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Topbar.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/Topbar.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Topbar.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                gap: 3,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Root, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Trigger, {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
                                    variant: "ghost",
                                    "aria-label": "Notifications",
                                    borderRadius: "full",
                                    color: "gray.600",
                                    _dark: {
                                        color: "gray.400"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuBell"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Topbar.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Topbar.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Content, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Item, {
                                        value: "notif-1",
                                        gap: 2,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuDot"], {
                                                color: "teal",
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/Topbar.tsx",
                                                lineNumber: 106,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                        fontSize: "sm",
                                                        fontWeight: "bold",
                                                        children: "New Report Ready"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/Topbar.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                        fontSize: "xs",
                                                        color: "gray.500",
                                                        children: "Your monthly summary is here."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/Topbar.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/Topbar.tsx",
                                                lineNumber: 107,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/Topbar.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$menu$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Item, {
                                        value: "notif-2",
                                        gap: 2,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuDot"], {
                                                color: "gray",
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/Topbar.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                        fontSize: "sm",
                                                        children: "System Update"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/Topbar.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                                        fontSize: "xs",
                                                        color: "gray.500",
                                                        children: "Scheduled maintenance at 2AM."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/Topbar.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/Topbar.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/Topbar.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Topbar.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$icon$2d$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IconButton"], {
                        variant: "ghost",
                        "aria-label": "Toggle Theme",
                        borderRadius: "full",
                        onClick: toggleColorMode,
                        children: colorMode === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuMoon"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Topbar.tsx",
                            lineNumber: 129,
                            columnNumber: 36
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuSun"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Topbar.tsx",
                            lineNumber: 129,
                            columnNumber: 59
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Topbar.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                        gap: 3,
                        pl: 2,
                        cursor: "pointer",
                        _hover: {
                            opacity: 0.8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                textAlign: "right",
                                display: {
                                    base: "none",
                                    sm: "block"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                        fontSize: "sm",
                                        fontWeight: "bold",
                                        lineHeight: "1",
                                        children: session?.user?.name || "User"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Topbar.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                        fontSize: "xs",
                                        color: "gray.500",
                                        children: "Admin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Topbar.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                                w: "40px",
                                h: "40px",
                                bg: "teal.500",
                                borderRadius: "full",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                overflow: "hidden",
                                children: session?.user?.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: session.user.image,
                                    alt: "Profile"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Topbar.tsx",
                                    lineNumber: 159,
                                    columnNumber: 16
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuCircleUser"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Topbar.tsx",
                                    lineNumber: 161,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Topbar.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Topbar.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Topbar.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/Topbar.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(Topbar, "wCx1gCH651QtXaKuNsF17TjJcgU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$color$2d$mode$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useColorMode"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = Topbar;
var _c;
__turbopack_context__.k.register(_c, "Topbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/LogouButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoutButton",
    ()=>LogoutButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/text/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.3/node_modules/react-icons/lu/index.mjs [client] (ecmascript)");
"use client";
;
;
;
;
function LogoutButton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
        variant: "ghost",
        colorPalette: "red",
        width: "full",
        justifyContent: "flex-start",
        gap: 3,
        borderRadius: "xl",
        size: "lg",
        _hover: {
            bg: "red.50",
            _dark: {
                bg: "red.900/20"
            }
        },
        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signOut"])({
                callbackUrl: "/login"
            }),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2d$icons$2f$lu$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["LuLogOut"], {}, void 0, false, {
                fileName: "[project]/components/layout/LogouButton.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                fontWeight: "bold",
                children: "Sign Out"
            }, void 0, false, {
                fileName: "[project]/components/layout/LogouButton.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/LogouButton.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = LogoutButton;
var _c;
__turbopack_context__.k.register(_c, "LogoutButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/DashboardLayout.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/box/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/flex/flex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$separator$2f$separator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/separator/separator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Sidebar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Topbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Topbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$LogouButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/LogouButton.tsx [client] (ecmascript)"); // We will create this below
"use client";
;
;
;
;
;
function DashboardLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
        minH: "100vh",
        bg: "gray.50",
        _dark: {
            bg: "gray.950"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                display: {
                    base: "none",
                    md: "flex"
                },
                flexDirection: "column",
                w: "280px",
                position: "fixed",
                h: "100vh",
                borderEndWidth: "1px",
                bg: "white",
                _dark: {
                    bg: "gray.900",
                    borderEndColor: "gray.800"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                    direction: "column",
                    h: "full",
                    p: 4,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                            flex: "1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/components/layout/DashboardLayout.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/DashboardLayout.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$separator$2f$separator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Separator"], {
                            my: 4
                        }, void 0, false, {
                            fileName: "[project]/components/layout/DashboardLayout.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$LogouButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LogoutButton"], {}, void 0, false, {
                            fileName: "[project]/components/layout/DashboardLayout.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/DashboardLayout.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/DashboardLayout.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                direction: "column",
                flex: "1",
                minW: 0,
                ml: {
                    base: 0,
                    md: "280px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        position: "sticky",
                        top: "0",
                        zIndex: "docked",
                        bg: "white/80",
                        backdropFilter: "blur(10px)",
                        _dark: {
                            bg: "gray.900/80"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Topbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/components/layout/DashboardLayout.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$separator$2f$separator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                fileName: "[project]/components/layout/DashboardLayout.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/DashboardLayout.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        as: "main",
                        p: {
                            base: 4,
                            md: 8
                        },
                        flex: "1",
                        mx: "auto",
                        w: "full",
                        maxW: "8xl",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/layout/DashboardLayout.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/DashboardLayout.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/DashboardLayout.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/reports.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchReports",
    ()=>fetchReports
]);
async function fetchReports() {
    const res = await fetch("/api/reports");
    if (!res.ok) throw new Error("Failed to fetch reports data");
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/reports.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.1_dd8af818c549560ed8496813acc4feb7/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/box/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/heading/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/text/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/button/button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/flex/flex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/stack/h-stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$badge$2f$badge$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/badge/badge.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$spinner$2f$spinner$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/spinner/spinner.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$center$2f$center$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/center/center.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@chakra-ui+react@3.30.0_@em_347f1b66de58053c4d9f6d92f73240cf/node_modules/@chakra-ui/react/dist/esm/components/table/namespace.js [client] (ecmascript) <export * as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$DashboardLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/DashboardLayout.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.14_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useQuery.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$reports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/reports.ts [client] (ecmascript)"); // Backend API client
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
function ReportsPage() {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "reports"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$reports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchReports"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsPage.useEffect": ()=>{
            if (status === "unauthenticated") router.push("/login");
        }
    }["ReportsPage.useEffect"], [
        status,
        router
    ]);
    if (status === "loading" || isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$center$2f$center$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Center"], {
        h: "100vh",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$spinner$2f$spinner$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Spinner"], {
                size: "xl",
                color: "teal.500"
            }, void 0, false, {
                fileName: "[project]/pages/reports.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                ml: 4,
                children: "Loading reports..."
            }, void 0, false, {
                fileName: "[project]/pages/reports.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.tsx",
        lineNumber: 37,
        columnNumber: 7
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$DashboardLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$center$2f$center$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Center"], {
            h: "60vh",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                color: "red.500",
                children: "Failed to load reports."
            }, void 0, false, {
                fileName: "[project]/pages/reports.tsx",
                lineNumber: 47,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/reports.tsx",
            lineNumber: 46,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/reports.tsx",
        lineNumber: 45,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$DashboardLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$flex$2f$flex$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Flex"], {
                justify: "space-between",
                align: "center",
                mb: 8,
                direction: {
                    base: "column",
                    sm: "row"
                },
                gap: 4,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$box$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Box"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$heading$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Heading"], {
                                size: "lg",
                                mb: 2,
                                children: "Reports"
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$text$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                color: "gray.500",
                                children: "Manage and download your generated data exports."
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$stack$2f$h$2d$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HStack"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                gap: 2,
                                children: "Filter"
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                colorScheme: "teal",
                                size: "sm",
                                gap: 2,
                                children: "Export All"
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Root, {
                variant: "simple",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Header, {
                        bg: "gray.50",
                        _dark: {
                            bg: "gray.800"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Row, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "ID"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Name"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Date"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].ColumnHeader, {
                                    textAlign: "right",
                                    children: "Action"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/reports.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Body, {
                        children: data?.map((report)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Row, {
                                _hover: {
                                    bg: "gray.50/50",
                                    _dark: {
                                        bg: "gray.800/50"
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Cell, {
                                        fontWeight: "bold",
                                        children: report._id
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Cell, {
                                        children: report.name
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Cell, {
                                        children: new Date(report.date).toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Cell, {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$badge$2f$badge$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            colorScheme: report.status === "Generated" ? "green" : "orange",
                                            children: report.status
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.tsx",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$table$2f$namespace$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Table$3e$__["Table"].Cell, {
                                        textAlign: "right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$chakra$2d$ui$2b$react$40$3$2e$30$2e$0_$40$em_347f1b66de58053c4d9f6d92f73240cf$2f$node_modules$2f40$chakra$2d$ui$2f$react$2f$dist$2f$esm$2f$components$2f$button$2f$button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "xs",
                                            colorScheme: "teal",
                                            children: "View"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, report._id, true, {
                                fileName: "[project]/pages/reports.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(ReportsPage, "JKwOViqnjeEypux2EO1Han60Ufc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$1_dd8af818c549560ed8496813acc4feb7$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$14_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = ReportsPage;
var _c;
__turbopack_context__.k.register(_c, "ReportsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/reports.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/reports";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/reports.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/reports\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/reports.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__cb1d2809._.js.map