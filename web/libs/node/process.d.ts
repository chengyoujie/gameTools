declare namespace node { 
 namespace process {
    //import * as tty from "tty";


    //export = process;
}
}

declare namespace NodeJS {
    // this namespace merge is here because these are specifically used
    // as the type for process.stdin, process.stdout, and process.stderr.
    // they can't live in tty.d.ts because we need to disambiguate the imported name.
    interface ReadStream extends node.tty.ReadStream {}
    interface WriteStream extends node.tty.WriteStream {}
}