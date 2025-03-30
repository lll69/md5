var wasmModule = null;
var hashers = {};
var worker = this;
onmessage = function (e) {
    var data = e.data;
    switch (data.type) {
        case "createMD5":
            hashers[data.id] = new wasmModule.WasmMD5();
            break;
        case "createSha1":
            hashers[data.id] = new wasmModule.WasmSha1();
            break;
        case "createSha256":
            hashers[data.id] = new wasmModule.WasmSha256();
            break;
        case "createSha512":
            hashers[data.id] = new wasmModule.WasmSha512();
            break;
        case "updateHash":
            hashers[data.id].update(data.array);
            worker.postMessage({ type: "updated", id: data.id, size: data.array.length });
            break;
        case "finishHash":
            var result = hashers[data.id].finish();
            worker.postMessage({ type: "result", id: data.id, result: result });
            break;
        case "freeHash":
            hashers[data.id].free();
            delete hashers[data.id];
            break;
        case "queryWasm":
            worker.postMessage({ type: "init", success: (wasmModule != null) });
            break;
    }
}
onWasmInit = function (mod) {
    wasmModule = mod;
    worker.postMessage({ type: "init", success: true });
}
document = {
    getElementsByTagName: () => [],
    createElement: (tag) => ({
        tag: tag,
        setAttribute: () => { }
    }),
    head: {
        appendChild: function () {
            var e = arguments[0];
            worker.importScripts(e.src);
        }
    }
}
worker.importScripts("/wasm/md5_wasm.js");