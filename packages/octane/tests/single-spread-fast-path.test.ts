import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from './_helpers.js';
import {
	FastPathDiv,
	FastPathInput,
	FastPathMulti,
	FastPathSvgEdge,
} from './_fixtures/single-spread-fast-path.tsrx';

// A commit whose single spread source plus named writers all match the
// committed resolved record takes a raw-source fast path in setHostPropSources,
// skipping the writer Maps and resolved record the full path would allocate.
// It is a pure fast path over the resolved-record bail — never a semantic fork —
// so correctness oracles sit on the DOM boundary (MutationObserver records and
// setAttribute/removeAttribute call counts). The one internal-facing assertion
// is the Map-allocation count: the fast path exists to skip that materialization,
// and a DOM oracle cannot distinguish the two bails.

function watchWrites(el: Element): MutationObserver {
	const observer = new MutationObserver(() => {});
	observer.observe(el, {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
	});
	return observer;
}

function countMaps(fn: () => void): number {
	const RealMap = globalThis.Map;
	let count = 0;
	class SpyMap extends RealMap {
		constructor(...args: any[]) {
			count++;
			// @ts-expect-error spread ctor
			super(...args);
		}
	}
	(globalThis as any).Map = SpyMap;
	try {
		fn();
	} finally {
		(globalThis as any).Map = RealMap;
	}
	return count;
}

const EDGE = {
	cls: 'edge',
	d: 'M0 0L1 1',
	style: { stroke: 'red' },
	attrs: { 'data-x': '1', title: 'edge' },
};

afterEach(() => {
	vi.restoreAllMocks();
});

describe('single-spread fast path', () => {
	it('bails an unchanged svg-edge commit without materializing writer Maps', () => {
		const setAttribute = vi.spyOn(Element.prototype, 'setAttribute');
		const removeAttribute = vi.spyOn(Element.prototype, 'removeAttribute');
		const r = mount(FastPathSvgEdge, { tick: 'a', ...EDGE });
		const target = r.find('#fp-edge');
		expect(target.getAttribute('class')).toBe('edge');
		expect(target.getAttribute('d')).toBe('M0 0L1 1');
		expect(target.getAttribute('data-x')).toBe('1');
		const observer = watchWrites(target);
		setAttribute.mockClear();
		removeAttribute.mockClear();

		// Fresh source objects resolving to the committed record: the commit is
		// real (the tick sibling updates) but the host sees no writes.
		const unchanged = countMaps(() =>
			r.update(FastPathSvgEdge, {
				tick: 'b',
				cls: 'edge',
				d: 'M0 0L1 1',
				style: { stroke: 'red' },
				attrs: { 'data-x': '1', title: 'edge' },
			}),
		);
		expect(r.find('#edge-tick').textContent).toBe('b');
		expect(observer.takeRecords()).toEqual([]);
		expect(setAttribute).not.toHaveBeenCalled();
		expect(removeAttribute).not.toHaveBeenCalled();

		// A changed spread value falls back to the full resolve, which does
		// materialize Maps — the delta proves the unchanged commit skipped them.
		const changed = countMaps(() =>
			r.update(FastPathSvgEdge, {
				tick: 'c',
				cls: 'edge',
				d: 'M0 0L1 1',
				style: { stroke: 'red' },
				attrs: { 'data-x': '2', title: 'edge' },
			}),
		);
		expect(target.getAttribute('data-x')).toBe('2');
		expect(changed).toBeGreaterThan(unchanged);
	});

	it('detects in-place mutation of the spread source by value, not identity', () => {
		const attrs = { 'data-x': '1', title: 'edge' };
		const r = mount(FastPathDiv, { tick: 'a', cls: 'row', attrs });
		const target = r.find('#fp-div');
		expect(target.getAttribute('data-x')).toBe('1');

		// The SAME source object with a mutated value must still write: the bail
		// compares values against the committed record, never source identity.
		attrs['data-x'] = '9';
		r.update(FastPathDiv, { tick: 'b', cls: 'row', attrs });
		expect(r.find('#div-tick').textContent).toBe('b');
		expect(target.getAttribute('data-x')).toBe('9');
	});

	it('removes an attribute when the spread drops its key', () => {
		const r = mount(FastPathDiv, {
			tick: 'a',
			cls: 'row',
			attrs: { 'data-x': '1', title: 'edge' },
		});
		const target = r.find('#fp-div');
		expect(target.getAttribute('title')).toBe('edge');

		r.update(FastPathDiv, { tick: 'b', cls: 'row', attrs: { 'data-x': '1' } });
		expect(target.getAttribute('title')).toBeNull();
		expect(target.getAttribute('data-x')).toBe('1');
	});

	it('still applies named writer and class changes beside an unchanged spread', () => {
		const r = mount(FastPathSvgEdge, { tick: 'a', ...EDGE });
		const target = r.find('#fp-edge');
		r.update(FastPathSvgEdge, { ...EDGE, tick: 'b', cls: 'hot' });
		expect(target.getAttribute('class')).toBe('hot');
		expect(target.getAttribute('data-x')).toBe('1');
	});

	it('keeps the full resolve path for multiple spread sources', () => {
		const r = mount(FastPathMulti, {
			tick: 'a',
			a: { 'data-x': '1', title: 'a' },
			b: { 'data-y': '2' },
		});
		const target = r.find('#fp-multi');
		expect(target.getAttribute('data-x')).toBe('1');
		expect(target.getAttribute('data-y')).toBe('2');

		// Later sources override earlier ones; the merged ordering semantics are
		// the reason multi-source tuples never take the fast path.
		r.update(FastPathMulti, {
			tick: 'b',
			a: { 'data-x': '1', title: 'a' },
			b: { 'data-y': '3', 'data-x': '4' },
		});
		expect(target.getAttribute('data-x')).toBe('4');
		expect(target.getAttribute('data-y')).toBe('3');
	});

	it('keeps form hosts on the full path so control reassertion still runs', () => {
		const r = mount(FastPathInput, {
			tick: 'a',
			attrs: { value: 'first', 'data-x': '1' },
		});
		const input = r.find('#fp-input') as HTMLInputElement;
		expect(input.value).toBe('first');

		r.update(FastPathInput, {
			tick: 'b',
			attrs: { value: 'second', 'data-x': '1' },
		});
		expect(input.value).toBe('second');
	});

	it('reads enumerable getters once per render through the snapshot', () => {
		let calls = 0;
		const attrs = {
			get title() {
				calls++;
				return 't' + calls;
			},
		};
		const r = mount(FastPathDiv, { tick: 'a', cls: 'row', attrs });
		const target = r.find('#fp-div');
		expect(target.getAttribute('title')).toBe('t1');

		r.update(FastPathDiv, { tick: 'b', cls: 'row', attrs });
		// The getter produced a new value on the second snapshot read — the bail
		// must see the change and write it.
		expect(target.getAttribute('title')).toBe('t2');
		expect(calls).toBe(2);
	});
});
