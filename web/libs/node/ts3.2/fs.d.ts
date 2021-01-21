// tslint:disable-next-line:no-bad-reference
/// <reference path="../fs.d.ts" />

declare module 'fs' {
    interface BigIntStats extends node.fs.StatsBase<bigint> {
    }

    class BigIntStats {
        atimeNs: bigint;
        mtimeNs: bigint;
        ctimeNs: bigint;
        birthtimeNs: bigint;
    }

    interface BigIntOptions {
        bigint: true;
    }

    interface StatOptions {
        bigint: boolean;
    }

    function stat(path: node.fs.PathLike, options: BigIntOptions, callback: (err: NodeJS.ErrnoException | null, stats: BigIntStats) => void): void;
    function stat(path: node.fs.PathLike, options: StatOptions, callback: (err: NodeJS.ErrnoException | null, stats: node.fs.Stats | BigIntStats) => void): void;

    namespace stat {
        function __promisify__(path: node.fs.PathLike, options: BigIntOptions): Promise<BigIntStats>;
        function __promisify__(path: node.fs.PathLike, options: StatOptions): Promise<node.fs.Stats | BigIntStats>;
    }

    function statSync(path: node.fs.PathLike, options: BigIntOptions): BigIntStats;
    function statSync(path: node.fs.PathLike, options: StatOptions): node.fs.Stats | BigIntStats;
}
