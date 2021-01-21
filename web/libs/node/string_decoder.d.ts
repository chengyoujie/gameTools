declare namespace node { 
 namespace string_decoder {
    class StringDecoder {
        constructor(encoding?: string);
        write(buffer: Buffer): string;
        end(buffer?: Buffer): string;
    }
}
}