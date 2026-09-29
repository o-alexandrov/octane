export { __methodDep } from './method-dep.js';
declare const UNIVERSAL_PLAN: unique symbol;
declare const UNIVERSAL_VALUE: unique symbol;
declare const UNIVERSAL_LIST: unique symbol;
declare const UNIVERSAL_COMPONENT: unique symbol;
declare const UNIVERSAL_COMPONENT_VALUE: unique symbol;
declare const UNIVERSAL_PROPS: unique symbol;
declare const UNIVERSAL_CHILDREN: unique symbol;
declare const UNIVERSAL_IF: unique symbol;
declare const UNIVERSAL_BLOCK: unique symbol;
declare const UNIVERSAL_SWITCH: unique symbol;
declare const UNIVERSAL_FOR: unique symbol;
declare const UNIVERSAL_HOST_BINDING: unique symbol;
export interface UniversalHostBinding<T> {
    readonly $$kind: typeof UNIVERSAL_HOST_BINDING;
    readonly source: {
        get(): unknown;
        subscribe(notify: () => void): () => void;
    };
    readonly select: (value: unknown) => T;
    readonly getSnapshot: () => T;
}
/** Exploratory local-host binding; this is not a general component subscription. */
export declare function universalHostBinding<T, U>(source: {
    get(): T;
    subscribe(notify: () => void): () => void;
}, select: (value: T) => U): UniversalHostBinding<U>;
declare const UNIVERSAL_TRY: unique symbol;
declare const UNIVERSAL_CONTEXT: unique symbol;
declare const UNIVERSAL_ACTIVITY: unique symbol;
declare const UNIVERSAL_KEYED: unique symbol;
declare const UNIVERSAL_PORTAL: unique symbol;
declare const UNIVERSAL_RENDERER_REGION: unique symbol;
/** Structured-clone protocol version used by experimental transported roots. */
export declare const UNIVERSAL_TRANSPORT_PROTOCOL_VERSION: 1;
export type UniversalKey = string | number | symbol | bigint;
/**
 * The host-neutral part of Octane context identity.
 *
 * DOM contexts and renderer-local contexts both satisfy this shape. The
 * universal runtime only observes the shared tag and default value; provider
 * lowering is owned by the compiler and does not require a DOM Scope.
 */
export interface UniversalContext<T> {
    readonly $$kind: symbol;
    readonly defaultValue: T;
    /**
     * Bumped on every committed provider change; each bump must move the shared
     * context epoch too (bumpContextEpoch in context-epoch.ts) — the
     * $$ctxDepsEpoch bail fast path treats an unmoved epoch as "nothing changed".
     */
    $$version: number;
}
export interface UniversalRendererMetadata {
    readonly id: string;
    readonly module?: string;
    readonly target: 'universal';
}
export interface UniversalBoundaryMetadata {
    readonly id: string;
    readonly ownerRenderer: string;
    readonly childRenderer: string;
    readonly childrenProp: string;
}
export interface UniversalHostPlan {
    readonly kind: 'host';
    readonly type: string;
    readonly props?: Readonly<Record<string, unknown>>;
    readonly bindings?: readonly (readonly [name: string, slot: number])[];
    /** Ordered host/component prop program produced by `universalProps`. */
    readonly propsSlot?: number;
    readonly children?: readonly UniversalPlanNode[];
}
export interface UniversalTextPlan {
    readonly kind: 'text';
    readonly value?: string;
    readonly slot?: number;
}
export interface UniversalSlotPlan {
    readonly kind: 'slot';
    readonly slot: number;
}
export interface UniversalRangePlan {
    readonly kind: 'range';
    readonly children: readonly UniversalPlanNode[];
}
/** A component node is optional compiler sugar; dynamic component descriptors are equivalent. */
export interface UniversalComponentPlan {
    readonly kind: 'component';
    readonly renderer: string;
    readonly component?: UniversalComponent<any>;
    readonly componentSlot?: number;
    readonly propsSlot?: number;
    readonly keySlot?: number;
    readonly children?: readonly UniversalPlanNode[];
}
export interface UniversalIfPlan {
    readonly kind: 'if';
    readonly conditionSlot: number;
    readonly then: UniversalPlanNode;
    readonly else?: UniversalPlanNode;
}
export interface UniversalSwitchPlan {
    readonly kind: 'switch';
    readonly valueSlot: number;
    readonly cases: readonly (readonly [unknown, UniversalPlanNode])[];
    readonly default?: UniversalPlanNode;
}
export type UniversalPlanNode = UniversalHostPlan | UniversalTextPlan | UniversalSlotPlan | UniversalRangePlan | UniversalComponentPlan | UniversalIfPlan | UniversalSwitchPlan;
export interface UniversalPlan {
    readonly $$kind: typeof UNIVERSAL_PLAN;
    readonly renderer: string;
    readonly root: UniversalPlanNode;
}
export interface UniversalPlanValue {
    readonly $$kind: typeof UNIVERSAL_VALUE;
    readonly plan: UniversalPlan;
    readonly values: readonly unknown[];
    readonly key: UniversalKey | null;
}
export interface UniversalListValue {
    readonly $$kind: typeof UNIVERSAL_LIST;
    readonly values: readonly UniversalRenderable[];
    readonly empty?: UniversalRenderable;
}
export interface UniversalPortalValue {
    readonly $$kind: typeof UNIVERSAL_PORTAL;
    readonly children: UniversalRenderable;
    readonly target: unknown;
}
export type UniversalRenderable = UniversalPlanValue | UniversalListValue | UniversalPortalValue | UniversalComponentValue | UniversalChildrenValue | UniversalIfValue | UniversalBlockValue | UniversalSwitchValue | UniversalForValue | UniversalTryValue | UniversalContextValue | UniversalActivityValue | UniversalKeyedValue | readonly UniversalRenderable[] | string | number | bigint | boolean | null | undefined;
export type UniversalComponent<P = any> = ((props: P, context: UniversalRenderContext) => UniversalRenderable) & {
    readonly [UNIVERSAL_COMPONENT]: UniversalRendererMetadata;
};
export type UniversalPropEntry = readonly ['set', name: string, value: unknown] | readonly ['spread', value: unknown];
export interface UniversalPropsValue {
    readonly $$kind: typeof UNIVERSAL_PROPS;
    readonly props: Readonly<Record<string, unknown>>;
    readonly key: unknown;
    readonly hasKey: boolean;
    readonly hasChildren: boolean;
}
export interface UniversalComponentValue {
    readonly $$kind: typeof UNIVERSAL_COMPONENT_VALUE;
    readonly renderer: string;
    readonly component: UniversalComponent<any>;
    readonly props: UniversalPropsValue | Readonly<Record<string, unknown>> | null;
    readonly key: unknown;
    readonly hasKey: boolean;
}
export interface UniversalChildrenValue {
    readonly $$kind: typeof UNIVERSAL_CHILDREN;
    readonly renderer: string;
    readonly render: () => UniversalRenderable;
}
export interface UniversalIfValue {
    readonly $$kind: typeof UNIVERSAL_IF;
    readonly condition: boolean;
    readonly then: () => UniversalRenderable;
    readonly else: (() => UniversalRenderable) | null;
}
export interface UniversalBlockValue {
    readonly $$kind: typeof UNIVERSAL_BLOCK;
    readonly body: () => UniversalRenderable;
}
export interface UniversalSwitchValue {
    readonly $$kind: typeof UNIVERSAL_SWITCH;
    readonly value: unknown;
    readonly cases: readonly (readonly [unknown, () => UniversalRenderable])[];
    readonly default: (() => UniversalRenderable) | null;
}
export interface UniversalForValue {
    readonly $$kind: typeof UNIVERSAL_FOR;
    readonly items: Iterable<unknown>;
    readonly key: (item: any, index: number) => UniversalKey;
    readonly render: (item: any, index: number) => UniversalRenderable;
    readonly empty: (() => UniversalRenderable) | null;
    readonly ownerless: boolean;
    readonly compact: boolean;
    readonly hostComponent?: UniversalComponent<any>;
    readonly leafPlan?: UniversalPlan;
    readonly leafSignature?: string;
    readonly template?: boolean;
    readonly componentScope?: boolean;
}
export interface UniversalTryValue {
    readonly $$kind: typeof UNIVERSAL_TRY;
    readonly body: () => UniversalRenderable;
    readonly pending: (() => UniversalRenderable) | null;
    readonly catch: ((error: unknown, reset: () => void) => UniversalRenderable) | null;
}
export interface UniversalContextValue {
    readonly $$kind: typeof UNIVERSAL_CONTEXT;
    readonly context: UniversalContext<any>;
    readonly value: unknown;
    readonly children: UniversalRenderable | (() => UniversalRenderable);
}
export interface UniversalActivityValue {
    readonly $$kind: typeof UNIVERSAL_ACTIVITY;
    readonly mode: 'visible' | 'hidden';
    readonly body: () => UniversalRenderable;
}
export interface UniversalKeyedValue {
    readonly $$kind: typeof UNIVERSAL_KEYED;
    readonly key: UniversalKey;
    readonly value: UniversalRenderable;
}
/**
 * Opaque payload handed through a component prop whose contents are owned by
 * another renderer. The compiler keeps `component` stable and places
 * render-time captures in `props`, so crossing a renderer boundary does not
 * reset the child root on every owner render.
 */
export interface RendererRegion<P = any> {
    readonly $$kind: typeof UNIVERSAL_RENDERER_REGION;
    readonly ownerRenderer: string;
    readonly childRenderer: string;
    readonly component: unknown;
    readonly props: P;
}
export interface UniversalRenderContext {
    readonly renderer: string;
    readContext<T>(context: UniversalContext<T>): T;
    insertionEffect(create: () => void | (() => void), deps?: readonly unknown[]): void;
    layoutEffect(create: () => void | (() => void), deps?: readonly unknown[]): void;
    effect(create: () => void | (() => void), deps?: readonly unknown[]): void;
}
export type UniversalTextPolicy = 'reject' | 'ignore' | 'host';
export interface UniversalHostCapabilities {
    /** How primitive text children are represented. Absence defaults to `reject`. */
    readonly text?: UniversalTextPolicy;
    /** Allows renderer-local callbacks whose function values never enter a host batch. */
    readonly localHostCallbacks?: boolean;
    /** Allows core-owned retained trees to change physical host visibility. */
    readonly visibility?: boolean;
    /**
     * Opts into owner elision for compiler-proven leaves whose attributes are
     * ordinary props rather than callback/event channels. Codec-free local roots
     * may additionally compact these leaves.
     */
    readonly compilerLeafProps?: boolean;
    /** Accepts immutable, shape-sharing commands for wholly fresh intrinsic host trees. */
    readonly templateMount?: boolean;
    /** Scalar static host props are encoded deterministically and may be shared within one root. */
    readonly stableStaticHostProps?: boolean;
    /** Allows fresh static template descendants to remain logically opaque until first replay. */
    readonly collapsedTemplateMount?: boolean;
    /** Accepts shared immutable intrinsic programs with contiguous host and listener IDs. */
    readonly templateProgramMount?: boolean;
    /** Defers renderer-owned public-instance metadata until explicitly requested by core. */
    readonly lazyPublicInstances?: boolean;
    /** Accepts consecutive contiguous instances of one immutable intrinsic host program. */
    readonly templateProgramRuns?: boolean;
    /** Accepts one destroy-run command per removed contiguous program-run range. */
    readonly teardownRuns?: boolean;
}
export interface UniversalResourceHandle {
    readonly $$kind: 'octane.universal.resource';
    readonly renderer: string;
    readonly root: number;
    readonly id: string | number;
}
/** Opaque, root-scoped placement parent for a renderer-owned portal target. */
export interface UniversalPortalTargetHandle {
    readonly $$kind: 'octane.universal.portal-target';
    readonly renderer: string;
    readonly root: number;
    readonly id: string | number;
}
export interface UniversalPortalTargetRegistration {
    readonly handle: UniversalPortalTargetHandle;
    release(): void;
}
export interface UniversalPortalTargetContext<Container = unknown> {
    readonly container: Container;
    readonly renderer: string;
    readonly target: unknown;
    readonly transported: boolean;
    createPortalTargetHandle(id: string | number): UniversalPortalTargetHandle;
}
export interface UniversalPortalCapability<Container = unknown> {
    prepareTarget(context: UniversalPortalTargetContext<Container>): UniversalPortalTargetRegistration;
}
export type UniversalHostParent = number | null | UniversalPortalTargetHandle;
export type UniversalSerializableValue = null | undefined | string | number | bigint | boolean | readonly UniversalSerializableValue[] | Readonly<{
    [name: string]: UniversalSerializableValue;
}>;
export type UniversalHostPropEncoding = {
    readonly kind: 'value';
    readonly value: UniversalSerializableValue;
} | {
    readonly kind: 'resource';
    readonly handle: UniversalResourceHandle;
} | {
    readonly kind: 'unsupported';
    readonly reason?: string;
};
/** One encoding call's context. Codecs may retain it across later props and renders. */
export interface UniversalHostPropCodecContext<Container = unknown> {
    readonly container: Container;
    readonly renderer: string;
    readonly hostType: string;
    readonly name: string;
    readonly value: unknown;
    createResourceHandle(id: string | number): UniversalResourceHandle;
}
export interface UniversalHostPropCodec<Container = unknown> {
    encode(context: UniversalHostPropCodecContext<Container>): UniversalHostPropEncoding;
}
export interface UniversalHostCallbackDefinition {
    readonly type: string;
}
export interface UniversalHostCallbackCapability {
    classify(name: string, value: unknown): UniversalHostCallbackDefinition | null;
}
export type UniversalHostUpdateKind = 'update' | 'recreate';
export interface UniversalHostUpdateCapability {
    classify(type: string, previous: Readonly<Record<string, unknown>>, next: Readonly<Record<string, unknown>>): UniversalHostUpdateKind;
}
/**
 * Hosts whose physical instances are recycled independently from the logical
 * tree report attachment changes through this ordered, root-scoped batch.
 * The core validates current state through the registration before touching a
 * ref, so duplicate and stale notifications are harmless.
 */
export interface UniversalHostAttachmentBatch {
    /** Logical host IDs that became unavailable; refs detach parent-first. */
    readonly detached: readonly number[];
    /**
     * Logical host IDs that became available; refs attach child-first. An ID
     * present in both arrays represents physical replacement in one batch.
     */
    readonly attached: readonly number[];
}
export interface UniversalHostAttachmentRegistration {
    /** Return the current physical state, including changes newer than a queued batch. */
    isAttached(id: number): boolean;
    /** Release this root's subscription. Called once when construction fails or the root unmounts. */
    unsubscribe(): void;
}
export interface UniversalHostAttachmentCapability<Container = unknown> {
    /** Install one root-scoped physical attachment subscription for `container`. */
    subscribe(container: Container, onChange: (batch: UniversalHostAttachmentBatch) => void): UniversalHostAttachmentRegistration;
}
/** Immutable, renderer-neutral shape shared by repeated compiler-hoisted host trees. */
export interface UniversalHostTemplateShapeNode {
    readonly type: string;
    /** Earlier shape-node index, or -1 for the template's one physical root. */
    readonly parent: number;
}
/** A native event installed on one freshly mounted template host. */
export interface UniversalHostTemplateEvent {
    readonly type: string;
    readonly listener: UniversalEventListenerDescriptor;
}
/** Per-instance values paired by index with one immutable host-template shape. */
export interface UniversalHostTemplateNode {
    readonly id: number;
    readonly props: Readonly<Record<string, unknown>>;
    readonly events?: readonly UniversalHostTemplateEvent[];
}
/** One scalar instance value patched into a shared intrinsic host program. */
export interface UniversalHostTemplateProgramBinding {
    readonly name: string;
    readonly valueIndex: number;
}
/** Immutable, renderer-encoded static host information shared by repeated mounts. */
export interface UniversalHostTemplateProgramNode {
    readonly type: string;
    readonly parent: number;
    readonly props: Readonly<Record<string, unknown>>;
    readonly bindings?: readonly UniversalHostTemplateProgramBinding[];
}
/** A stable native listener site whose ID is derived from the instance range. */
export interface UniversalHostTemplateProgramEvent {
    readonly node: number;
    readonly type: string;
    readonly priority: UniversalEventPriority;
}
/** Immutable renderer-neutral program reused by fresh intrinsic host subtrees. */
export interface UniversalHostTemplateProgram {
    readonly nodes: readonly UniversalHostTemplateProgramNode[];
    readonly events: readonly UniversalHostTemplateProgramEvent[];
}
/** Encoded primitive that can be transported directly without object reconstruction. */
export type UniversalHostTemplateProgramValue = string | number | boolean | bigint | null | undefined;
export type UniversalHostCommand = {
    readonly op: 'create';
    readonly id: number;
    readonly type: string;
    readonly props: Readonly<Record<string, unknown>>;
} | {
    readonly op: 'mount-template';
    readonly parent: UniversalHostParent;
    readonly before: number | null;
    readonly shape: readonly UniversalHostTemplateShapeNode[];
    readonly nodes: readonly UniversalHostTemplateNode[];
} | {
    readonly op: 'mount-template-range';
    readonly parent: UniversalHostParent;
    readonly before: number | null;
    readonly program: UniversalHostTemplateProgram;
    readonly firstId: number;
    readonly values: readonly UniversalHostTemplateProgramValue[];
    readonly firstListenerId: number | null;
} | {
    readonly op: 'mount-template-run';
    readonly parent: UniversalHostParent;
    readonly before: number | null;
    readonly program: UniversalHostTemplateProgram;
    readonly firstId: number;
    readonly firstListenerId: number | null;
    readonly count: number;
    readonly values: readonly UniversalHostTemplateProgramValue[];
} | {
    readonly op: 'update';
    readonly id: number;
    readonly props: Readonly<Record<string, unknown>>;
} | {
    readonly op: 'ensure-public-instance';
    readonly id: number;
} | {
    readonly op: 'recreate';
    readonly id: number;
    readonly type: string;
    readonly props: Readonly<Record<string, unknown>>;
} | {
    readonly op: 'insert' | 'move';
    readonly parent: UniversalHostParent;
    readonly id: number;
    readonly before: number | null;
} | {
    readonly op: 'event';
    readonly id: number;
    readonly type: string;
    readonly listener: UniversalEventListenerDescriptor | null;
} | {
    readonly op: 'lifecycle' | 'local-callback';
    readonly id: number;
    readonly type: string;
    readonly listener: UniversalListenerDescriptor | null;
} | {
    readonly op: 'visibility';
    readonly id: number;
    readonly state: 'hidden' | 'visible';
} | {
    readonly op: 'remove';
    readonly parent: UniversalHostParent;
    readonly id: number;
} | {
    readonly op: 'destroy';
    readonly id: number;
} | {
    /** Removes and destroys `count` contiguous collapsed program-run
     * instances of `width` hosts each, starting at `firstId`, without
     * shipping their per-host teardown commands. */
    readonly op: 'destroy-run';
    readonly parent: UniversalHostParent;
    readonly firstId: number;
    readonly count: number;
    readonly width: number;
};
export type UniversalEventPriority = 'discrete' | 'continuous' | 'default';
export interface UniversalListenerDescriptor {
    readonly id: number;
}
/** Serializable listener identity carried by a host batch. */
export interface UniversalEventListenerDescriptor extends UniversalListenerDescriptor {
    readonly priority: UniversalEventPriority;
}
export interface UniversalEventDefinition {
    readonly type: string;
    readonly priority?: UniversalEventPriority;
}
export interface UniversalEventCapability {
    /** Return null for ordinary callback/property names owned by the renderer. */
    classify(name: string): UniversalEventDefinition | null;
}
export interface UniversalHostBatch {
    readonly renderer: string;
    readonly version: number;
    readonly commands: readonly UniversalHostCommand[];
}
export interface UniversalTransportIdentity {
    readonly protocol: typeof UNIVERSAL_TRANSPORT_PROTOCOL_VERSION;
    readonly renderer: string;
    readonly root: number;
    readonly version: number;
}
export interface UniversalTransportCommitMessage extends UniversalTransportIdentity {
    readonly type: 'commit';
    readonly batch: UniversalHostBatch;
}
export interface UniversalTransportAbortMessage extends UniversalTransportIdentity {
    readonly type: 'abort';
}
export interface UniversalTransportAcknowledgement extends UniversalTransportIdentity {
    readonly type: 'ack';
}
export interface UniversalTransportCompleteMessage extends UniversalTransportIdentity {
    readonly type: 'complete';
}
export interface UniversalTransportError {
    readonly name: string;
    readonly message: string;
}
export interface UniversalTransportRejectMessage extends UniversalTransportIdentity {
    readonly type: 'reject';
    readonly error: UniversalTransportError;
}
export interface UniversalTransportFaultMessage extends UniversalTransportIdentity {
    readonly type: 'fault';
    readonly error: UniversalTransportError;
}
export interface UniversalTransportEventDelivery {
    readonly listener: number;
    readonly payload: unknown;
}
export interface UniversalTransportEventMessage extends UniversalTransportIdentity {
    readonly type: 'event';
    readonly priority: UniversalEventPriority;
    readonly deliveries: readonly UniversalTransportEventDelivery[];
}
export type UniversalTransportOutboundMessage = UniversalTransportCommitMessage | UniversalTransportAbortMessage;
export type UniversalTransportInboundMessage = UniversalTransportAcknowledgement | UniversalTransportCompleteMessage | UniversalTransportRejectMessage | UniversalTransportFaultMessage | UniversalTransportEventMessage;
export interface UniversalHostCommitContext {
    /** Invoke a renderer-local callback after its owner table has been accepted. */
    invokeLocalCallback(listener: number, args: readonly unknown[]): unknown;
}
export interface UniversalPreparedHostBatch {
    /** Apply the already-validated physical host mutation. This marks the batch accepted. */
    apply(): void;
    /** Run renderer-local callbacks after logical owner/listener publication. */
    afterAccept?(): void;
    /** Release every unpublished resource staged by preparation exactly once. */
    abort(): void;
}
/**
 * A transported batch starts asynchronously. Calling `acknowledge` is the
 * irreversible host-acceptance point. Rejection before that call is a rejected
 * preparation; rejection afterwards is an accepted commit fault.
 */
export interface UniversalAsyncPreparedHostBatch {
    apply(acknowledge: (message: UniversalTransportAcknowledgement) => void): Promise<void>;
    /** Run adapter-local work after logical owner/listener publication. */
    afterAccept?(): void;
    abort(): void;
}
export interface UniversalHostDriver<Container = unknown, PublicInstance = unknown> {
    readonly id: string;
    readonly capabilities?: UniversalHostCapabilities;
    readonly attachments?: UniversalHostAttachmentCapability<Container>;
    readonly events?: UniversalEventCapability;
    readonly lifecycles?: UniversalHostCallbackCapability;
    readonly localCallbacks?: UniversalHostCallbackCapability;
    readonly props?: UniversalHostPropCodec<Container>;
    readonly updates?: UniversalHostUpdateCapability;
    readonly portals?: UniversalPortalCapability<Container>;
    /** Validate and stage a batch without mutating the public host. */
    prepareBatch(container: Container, batch: UniversalHostBatch, context: UniversalHostCommitContext): UniversalPreparedHostBatch;
    getPublicInstance(container: Container, id: number): PublicInstance | null;
}
export interface UniversalCommitTransport<Container = unknown> {
    readonly mode?: 'sync';
    prepareBatch(container: Container, batch: UniversalHostBatch, prepare: (batch: UniversalHostBatch) => UniversalPreparedHostBatch): UniversalPreparedHostBatch;
}
export interface UniversalAsyncCommitTransport<Container = unknown> {
    readonly mode: 'async';
    prepareBatch(container: Container, batch: UniversalHostBatch, identity: UniversalTransportIdentity): UniversalAsyncPreparedHostBatch;
}
export interface UniversalRootOptions<Container> {
    transport?: UniversalCommitTransport<Container> | UniversalAsyncCommitTransport<Container>;
    /**
     * Host microtask scheduler. Required when the JS environment does not expose
     * the standard global `queueMicrotask` (for example Lynx PrimJS).
     */
    scheduleMicrotask?: (callback: () => void) => void;
    /**
     * React 19 parity, reporting only: called after a `universalTry` catch arm
     * claims an error from this root — a render-time throw its arm catches, or
     * an effect/host-callback error routed to it between renders. Mirrors the
     * DOM runtime's `createRoot` option: only the error is passed (no
     * `errorInfo`/`componentStack` second argument).
     */
    onCaughtError?: (error: unknown) => void;
    /**
     * React 19 parity: called for an error no boundary claims. When provided it
     * REPLACES the default report for this root's scheduler-owned work — a
     * scheduled render error stops rethrowing out of the microtask flush (or,
     * on a transported root, out of `flushTransport()`), and an unrouted
     * effect/host-callback error stops rethrowing out of the commit or passive
     * flush. Direct `prepare()`/`render()`/`commit()` calls still throw: the
     * thrown attempt is that API's documented result channel. Recovery
     * semantics are unchanged either way — the failed attempt is discarded and
     * committed content is retained exactly as without the option.
     */
    onUncaughtError?: (error: unknown) => void;
}
export interface UniversalTransaction {
    readonly status: 'prepared' | 'committed' | 'aborted';
    readonly batch: UniversalHostBatch;
    commit(): void;
    commitAsync(): Promise<void>;
    abort(): void;
}
export interface UniversalSuspendedAttempt {
    readonly status: 'suspended' | 'aborted';
    readonly thenable: PromiseLike<unknown>;
    abort(): void;
}
export type UniversalPreparedAttempt = UniversalTransaction | UniversalSuspendedAttempt;
export interface UniversalRoot<P = any> {
    readonly renderer: string;
    prepare(component: UniversalComponent<P>, props: P): UniversalPreparedAttempt;
    render(component: UniversalComponent<P>, props: P): UniversalPreparedAttempt;
    renderAsync(component: UniversalComponent<P>, props: P): Promise<UniversalPreparedAttempt>;
    eventScope<T>(priority: UniversalEventPriority, run: () => T): T;
    dispatchEvent(listener: number, payload: unknown): unknown;
    dispatchTransportEvent(message: UniversalTransportEventMessage): readonly unknown[];
    /** Wait for event/suspense work queued onto an asynchronous transport. */
    flushTransport(): Promise<void>;
    unmount(): void;
    unmountAsync(): Promise<void>;
}
export interface LinkedStatePrevious<Source, Value> {
    source: Source;
    value: Value;
}
export interface LinkedStateOptions<Source, Value> {
    sourceEqual?: (previous: Source, next: Source) => boolean;
    valueEqual?: (previous: Value, next: Value) => boolean;
}
export declare function universalPlan(renderer: string, root: UniversalPlanNode): UniversalPlan;
export declare function universalValue(plan: UniversalPlan, values?: readonly unknown[], key?: UniversalKey | null): UniversalPlanValue;
export declare function universalKey(key: UniversalKey, value: UniversalRenderable): UniversalRenderable;
export declare function universalList<T>(items: Iterable<T>, render: (item: T, index: number) => UniversalRenderable, empty?: UniversalRenderable): UniversalListValue;
export declare function universalProps(entries: readonly UniversalPropEntry[], children?: unknown, canonicalizeHostClass?: boolean, compilerOwnedRecord?: boolean): UniversalPropsValue;
export declare function universalComponent(renderer: string, component: UniversalComponent<any>, props?: UniversalPropsValue | Readonly<Record<string, unknown>> | null, key?: unknown): UniversalComponentValue;
export declare function universalChildren(renderer: string, render: () => UniversalRenderable): UniversalChildrenValue;
export declare function universalIf(condition: unknown, then: () => UniversalRenderable, otherwise?: (() => UniversalRenderable) | null): UniversalIfValue;
export declare function universalBlock(body: () => UniversalRenderable): UniversalBlockValue;
export declare function universalSwitch(value: unknown, cases: readonly (readonly [unknown, () => UniversalRenderable])[], defaultValue?: (() => UniversalRenderable) | null): UniversalSwitchValue;
export declare function universalFor<T>(items: Iterable<T>, key: (item: T, index: number) => UniversalKey, render: (item: T, index: number) => UniversalRenderable, empty?: (() => UniversalRenderable) | null, ownerless?: boolean, compact?: boolean, hostComponent?: UniversalComponent<any> | true, leafPlan?: UniversalPlan, leafSignature?: string, componentScope?: boolean): UniversalForValue;
export declare function universalTry(body: () => UniversalRenderable, pending?: (() => UniversalRenderable) | null, catchBody?: ((error: unknown, reset: () => void) => UniversalRenderable) | null): UniversalTryValue;
export declare function universalContext<T>(context: UniversalContext<T>, value: T, children: UniversalRenderable | (() => UniversalRenderable)): UniversalContextValue;
export declare function universalActivity(mode: 'visible' | 'hidden' | string, body: () => UniversalRenderable): UniversalActivityValue;
/** Compiler/runtime ABI for an explicitly renderer-owned component prop. */
export declare function rendererRegion<P>(ownerRenderer: string, childRenderer: string, component: unknown, props: P): RendererRegion<P>;
export declare function isRendererRegion(value: unknown): value is RendererRegion;
export declare function defineUniversalComponent<P>(renderer: string, render: (props: P, context: UniversalRenderContext) => UniversalRenderable, metadata?: {
    module?: string;
}): UniversalComponent<P>;
/** Certify a binding-owned component that only forwards its props to one host. */
export declare function markUniversalHostComponent<P>(component: UniversalComponent<P>, renderer: string, plan: UniversalPlan): UniversalComponent<P>;
/** Compiler ABI: resolve one certified adapter's immutable leaf plan once per list. */
export declare function universalHostComponentLeafPlan(renderer: string, component: UniversalComponent<any>, signature: string): UniversalPlan | undefined;
export declare const UNIVERSAL_HMR: unique symbol;
export declare function hmrUniversalComponent<P>(renderer: string, component: UniversalComponent<P>): UniversalComponent<P>;
/**
 * Cross-realm plain-object test — the universal-side twin of
 * `packages/lynx/src/core/plain-object.ts`.
 *
 * A transported renderer can hand either side values built with a foreign
 * `Object.prototype` (an engine main thread hosted in an iframe realm, an
 * Electron process split, `node:vm`), so an identity test against this realm's
 * prototype misclassifies every structurally plain value that crossed a
 * boundary. Accept a null prototype, or any prototype one hop from null — the
 * shape of every realm's `Object.prototype`; class and built-in instances are
 * still rejected. `value` must already be a non-null, non-array object.
 */
export declare function hasCrossRealmPlainPrototype(value: object): boolean;
/**
 * Whether a host prop value is unchanged — THE definition of "equal" for
 * deciding whether a committed host prop needs an update command.
 *
 * Identity is the fast path but cannot be the whole answer: on a transported
 * root every object-valued prop is re-encoded through `cloneSerializableValue`
 * each render, so two renders of the same value never share identity, and an
 * identity-only diff emits an update for every object-carrying host in the
 * tree on every commit — wire cost proportional to tree size instead of
 * change size. Equality is therefore the value semantics the wire itself
 * preserves: primitives by `Object.is`, arrays and plain records (from any
 * realm — see `hasCrossRealmPlainPrototype`) element-by-element, to a bounded
 * depth. The default depth of 2 covers the compiler's slot shapes — class
 * arrays, style records, and one level of nesting inside them — while deeper
 * or exotic values (class instances, functions, handles) fall back to
 * identity, so a pathological tree never turns the per-prop diff into an
 * unbounded walk.
 */
export declare function sameUniversalHostPropValue(left: unknown, right: unknown, depth?: number): boolean;
export declare function hookSlots(count: number): number;
/** @internal Invoke a provider that owns the trailing hook-slot ABI. */
export declare function invokeManualHook<T>(fn: (...args: any[]) => T, receiver: unknown, args: IArguments): T;
/** @internal Adapt an expression provider that owns the trailing hook-slot ABI. */
export declare function manualHook<F extends (...args: any[]) => any>(fn: F, name?: string): F;
export declare function withSlot<T>(sym: unknown, fn: (...a: any[]) => T, ...args: any[]): T;
export declare function useState<T>(initial: T | (() => T), slot?: unknown): [T, (value: T | ((previous: T) => T)) => void, () => T];
export declare const __useStateWithGetter: typeof useState;
export declare function useLinkedState<Source, Value>(source: Source, reconcile: (source: Source, previous: LinkedStatePrevious<Source, Value> | undefined) => Value, options?: LinkedStateOptions<Source, Value>, slot?: unknown): [Value, (next: Value | ((previous: Value) => Value)) => void, () => Value];
export declare function __useLinkedStateWithGetter<Source, Value>(source: Source, reconcile: (source: Source, previous: LinkedStatePrevious<Source, Value> | undefined) => Value, options?: LinkedStateOptions<Source, Value>, slot?: unknown): [Value, (next: Value | ((previous: Value) => Value)) => void, () => Value];
export declare function useReducer<S, A, I = S>(reducer: (state: S, action: A) => S, initialArg: I, initOrSlot?: ((value: I) => S) | unknown, maybeSlot?: unknown): [S, (action: A) => void, () => S];
export declare const __useReducerWithGetter: typeof useReducer;
export declare function useInsertionEffect(create: () => void | (() => void), deps?: readonly unknown[] | null, slot?: unknown): void;
export declare function useLayoutEffect(create: () => void | (() => void), deps?: readonly unknown[] | null, slot?: unknown): void;
export declare function useEffect(create: () => void | (() => void), deps?: readonly unknown[] | null, slot?: unknown): void;
export declare function useMemo<T>(compute: () => T, deps?: readonly unknown[] | null, slot?: unknown): T;
export declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: readonly unknown[] | null, slot?: unknown): T;
export declare function useRef<T>(initial: T, slot?: unknown): {
    current: T;
};
export declare function useId(slot?: unknown): string;
export declare function useSyncExternalStore<T>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T): T;
export declare function useSyncExternalStore<T>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T, getServerSnapshot: () => T): T;
export declare function useSyncExternalStore<T>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T, getServerSnapshot: (() => T) | undefined, slot: unknown): T;
export declare function useDeferredValue<T>(value: T, ...initialValueAndSlot: unknown[]): T;
export declare function useTransition(slot?: unknown): [boolean, typeof startTransition];
export declare function useActionState<State, Payload>(action: (previousState: State, payload: Payload) => State | Promise<State>, initialState: State, _permalinkOrSlot?: string | unknown, maybeSlot?: unknown): [State, (payload: Payload) => void, boolean];
/** React's pre-19 name for `useActionState`, which universal modules may import from octane. */
export { useActionState as useFormState };
/** ES-only fallback for hosts that do not provide the WHATWG FormData global. */
interface UniversalFormDataFallback {
    append(name: string, value: unknown, filename?: string): void;
    delete(name: string): void;
    get(name: string): unknown;
    getAll(name: string): unknown[];
    has(name: string): boolean;
    set(name: string, value: unknown, filename?: string): void;
    entries(): IterableIterator<[string, unknown]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<unknown>;
    [Symbol.iterator](): IterableIterator<[string, unknown]>;
}
/** Uses the host's FormData type when present without requiring the DOM lib. */
type UniversalFormData = typeof globalThis extends {
    FormData: {
        prototype: infer Data;
    };
} ? Data : UniversalFormDataFallback;
export interface FormStatus {
    pending: boolean;
    data: UniversalFormData | null;
    method: string | null;
    action: string | ((formData: UniversalFormData) => void | Promise<void>) | null;
}
export declare function useFormStatus(): FormStatus;
export declare function useOptimistic<State>(passthrough: State): [State, (action: State | ((pendingState: State) => State)) => void];
export declare function useOptimistic<State, Action = State>(passthrough: State, reducer: (state: State, action: Action) => State): [State, (action: Action) => void];
export declare function useOptimistic<State, Action = State>(passthrough: State, reducer: ((state: State, action: Action) => State) | undefined, slot: unknown): [State, (action: Action) => void];
export declare function useContext<T>(context: UniversalContext<T>): T;
/** Compiler ABI: suspend once for all pending promises in one independent stratum. */
export declare function useBatch(items: any[], warm?: () => void): void;
/** Compiler ABI: cache one speculative creation per plan occurrence, slot, and deps. */
export declare function warmMemo(compute: () => any, deps: readonly any[], slot: unknown): void;
/** Keep compiler-owned plans from following static hoisting onto unrelated HOCs. */
export declare function markWarm<T extends Function>(component: T, plan: unknown): T;
/** Compiler ABI: recurse into a compiled child's statically attached warm plan. */
export declare function warmChild(component: any, props: any): void;
/**
 * Host-neutral code-splitting component. The loader runs at most once after it
 * successfully returns a thenable; fulfillment and rejection are cached for
 * every owner of the wrapper. Compiler-generated warm plans call `__warm`
 * before an adjacent lazy child suspends, starting independent chunks in one
 * stratum without putting module namespaces in hydration or host payloads.
 */
export declare function lazy<C extends UniversalComponent<any>>(load: () => PromiseLike<{
    default: C;
} | C>): C;
export declare function use<T>(usable: UniversalContext<T> | PromiseLike<T>): T;
export declare function useImperativeHandle<T>(ref: {
    current: T | null;
} | ((value: T | null) => void) | null, create: () => T, deps?: readonly unknown[] | null, slot?: unknown): void;
export declare function useEffectEvent<T extends (...args: any[]) => any>(fn: T, slot?: unknown): T;
export declare function useDebugValue(): void;
export declare function startTransition(fn: () => void | Promise<unknown>): void;
export declare function requestFormReset(): void;
export declare function memo<C extends UniversalComponent<any>>(component: C, compare?: (previous: Readonly<Parameters<C>[0]>, next: Readonly<Parameters<C>[0]>) => boolean): C;
export declare function memo<P>(component: UniversalComponent<P>, compare?: (previous: Readonly<P>, next: Readonly<P>) => boolean): UniversalComponent<P>;
export declare function createPortal(children: UniversalRenderable, target: unknown): UniversalPortalValue;
/** Compiler sentinel for the supported universal Activity descriptor. */
export declare const Activity: unique symbol;
export type UniversalSyncFlusher = <T>(run: () => T) => T;
/** Discover a mounted owner scheduler without retaining the owner renderer. */
export declare function getUniversalHostFlusher(): UniversalSyncFlusher | undefined;
/**
 * Renderer-infrastructure companion to a host runtime's `flushSync`.
 *
 * Universal roots normally batch hook and HMR updates in a microtask. A host
 * package supplies its owner flusher so direct and bridged roots alternate to
 * quiescence before the public scheduler boundary returns.
 */
export declare function flushUniversalSync<T>(run: () => T, flushOwner?: UniversalSyncFlusher): T;
/** Universal renderer companion used by host packages to implement sync `act`. */
export declare function flushUniversalAct<T>(run: () => T, flushOwner?: UniversalSyncFlusher): T;
export declare function createUniversalRoot<Container, PublicInstance>(container: Container, driver: UniversalHostDriver<Container, PublicInstance>, options?: UniversalRootOptions<Container>): UniversalRoot;
declare const OBJECT_DRIVER_STATE: unique symbol;
export interface ObjectHostInstance {
    readonly id: number;
    readonly type: string;
    props: Readonly<Record<string, unknown>>;
    visible: boolean;
    readonly children: ObjectHostInstance[];
}
interface ObjectDriverState {
    instances: Map<number, ObjectHostInstance>;
    parents: Map<number, number | null>;
    events: Map<number, Map<string, UniversalEventListenerDescriptor>>;
    lifecycles: Map<number, Map<string, UniversalListenerDescriptor>>;
    localCallbacks: Map<number, Map<string, UniversalListenerDescriptor>>;
    localCleanups: Map<number, Map<string, () => void>>;
}
export interface ObjectHostContainer {
    readonly renderer: string;
    readonly children: ObjectHostInstance[];
    readonly commits: UniversalHostBatch[];
    /** Number of driver instances currently allocated, including detached ones. */
    readonly instanceCount: number;
    dispatchEvent(instance: ObjectHostInstance | number, type: string, payload: unknown): unknown;
    readonly [OBJECT_DRIVER_STATE]: ObjectDriverState;
}
export declare function createObjectContainer(renderer?: string): ObjectHostContainer;
export declare function createObjectDriver(renderer?: string): UniversalHostDriver<ObjectHostContainer, ObjectHostInstance>;
