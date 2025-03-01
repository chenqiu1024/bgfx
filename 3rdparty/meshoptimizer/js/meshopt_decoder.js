// This file is part of meshoptimizer library and is distributed under the terms of MIT License.
// Copyright (C) 2016-2019, by Arseny Kapoulkine (arseny.kapoulkine@gmail.com)
var MeshoptDecoder = (function() {
	"use strict";
	var wasm = "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";

	var instance;
	var promise =
		(typeof fetch === 'function' ?
			fetch('data:application/octet-stream;base64,' + wasm)
			.then(response => response.arrayBuffer()) :
			Promise.resolve(Buffer.from(wasm, 'base64').buffer))
		.then(bytes => WebAssembly.instantiate(bytes, {}))
		.then(result => instance = result.instance)

	function heap(offset, length) {
		var memory = instance.exports["memory"];
		return new Uint8Array(memory.buffer, offset, length);
	}

	function decode(fun, target, count, size, source) {
		var sbrk = instance.exports["sbrk"];
		var tp = sbrk(count * size);
		var sp = sbrk(source.length);
		heap(sp, source.length).set(source);
		var res = fun(tp, count, size, sp, source.length);
		target.set(heap(tp, count * size));
		sbrk(tp - sbrk(0));
		if (res != 0) {
			throw new Error("Malformed buffer data: " + res);
		}
	};

	return {
		ready: promise,
		decodeVertexBuffer: function(target, count, size, source) {
			decode(instance.exports["meshopt_decodeVertexBuffer"], target, count, size, source);
		},
		decodeIndexBuffer: function(target, count, size, source) {
			decode(instance.exports["meshopt_decodeIndexBuffer"], target, count, size, source);
		}
	};
})();

if (typeof exports === 'object' && typeof module === 'object')
	module.exports = MeshoptDecoder;
else if (typeof define === 'function' && define['amd'])
	define([], function() {
		return MeshoptDecoder;
	});
else if (typeof exports === 'object')
	exports["MeshoptDecoder"] = MeshoptDecoder;
