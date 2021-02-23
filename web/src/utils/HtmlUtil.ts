
namespace tools {
    export class HtmlUtil {
        static HTML_U: string = '<u>{0}</u>';
        static HTML_FORMAT: string = '<font color="{0}">{1}</font>';

        static ins: HtmlUtil = new HtmlUtil();
        public static getHtmlStr(str = '', ...rest): Array<egret.ITextElement> {
            if (rest.length > 0) str = StringUtil.substitute(str, ...rest);
            let Itext = HtmlUtil.ins.parser(str);
            return Itext;
        }

        public static getSpHtmlStr(str = '', text: egret.TextField, ...rest): Array<egret.ITextElement> {
            if (rest.length > 0) str = StringUtil.substitute(str, ...rest);
            let Itext = HtmlUtil.ins.parser(str, text);
            return Itext;
        }

        constructor() {
            this.initReplaceArr();
        }

        private replaceArr: any[] = [];
        private initReplaceArr(): void {
            this.replaceArr = [];
            this.replaceArr.push([/&lt;/g, "<"]);
            this.replaceArr.push([/&gt;/g, ">"]);
            this.replaceArr.push([/&amp;/g, "&"]);
            this.replaceArr.push([/&quot;/g, "\""]);
            this.replaceArr.push([/&apos;/g, "\'"]);
            this.replaceArr.push([/br/g, "\n"]);
            this.replaceArr.push([/&nbsp;/g, " "]);
            this.replaceArr.push([/\\n/gi, "\r\n"]);
        }

        private replaceSpecial(value: string): string {
            for (let i = 0; i < this.replaceArr.length; i++) {
                let k = this.replaceArr[i][0];
                let v = this.replaceArr[i][1];

                value = value.replace(k, v);
            }
            return value;
        }

        private replacejkh(value: string): string {
            switch (value.toLowerCase()) {
                case "<br/>":
                    return '\n';
                default:
                    return '';
            }
        }

        private resutlArr: Array<egret.ITextElement> = [];

        private _hasCont: boolean;
        private parse(htmltext: string): egret.ITextElement[] {
            this._hasCont = false;
            this.stackArray = [];
            this.resutlArr = [];
            let firstIdx = 0;//文本段开始位置
            let length: number = htmltext.length;
            while (firstIdx < length) {
                let starIdx: number = htmltext.indexOf("<", firstIdx);
                if (starIdx < 0) {
                    this.addToResultArr(htmltext.substring(firstIdx));
                    firstIdx = length;
                }
                else {
                    let cont = htmltext.substring(firstIdx, starIdx);
                    if (cont) {
                        this._hasCont = true;
                        this.addToResultArr(cont);
                        let stack: ITextStyle;
                        for (let i = 0, len = this.stackArray.length; i < len; i++) {
                            stack = this.stackArray[i];
                            delete stack.textIndent;
                            delete stack.textAlign;
                        }
                    }

                    let fontEnd = htmltext.indexOf(">", starIdx);
                    if (fontEnd == -1) {
                        egret.$error(1038);
                        fontEnd = starIdx;
                    }
                    else if (htmltext.charAt(starIdx + 1) == "\/") {//关闭
                        if (/^(p|h\d+)\s*/.test(htmltext.substring(starIdx + 2, htmltext.indexOf('>', starIdx + 2)))) {
                            let len = this.resutlArr.length;
                            if (len > 0 && this._hasCont) {
                                this._hasCont = false;
                                this.resutlArr[len - 1].text += '\n';
                            }
                        }
                        this.stackArray.pop();
                    }
                    else if (htmltext.charAt(fontEnd - 1) == "\/") {//关闭
                        let len = this.resutlArr.length;
                        if (len > 0) this.resutlArr[len - 1].text += this.replacejkh(htmltext.substring(starIdx, htmltext.indexOf('>', starIdx) + 1));
                    }
                    else {
                        this.addToArray(htmltext.substring(starIdx + 1, fontEnd));
                    }

                    firstIdx = fontEnd + 1;
                }
            }
            this._curText = null;
            return this.resutlArr;
        }

        private _curText: egret.TextField = null;
        public parser(htmltext: string, text?: egret.TextField): Array<egret.ITextElement> {
            let self = this;
            self._curText = text;
            return this.parse(htmltext);
        }

        private addToResultArr(value: string): void {
            if (value == "") return;
            value = this.replaceSpecial(value);

            if (this.stackArray.length > 0) {
                let style = this.stackArray[this.stackArray.length - 1];
                value = this.transText(value, style);
                this.resutlArr.push({ text: value, style: style })
            }
            else {
                this.resutlArr.push(<egret.ITextElement>{ text: value });
            }
        }

        private transText(text: string, style: ITextStyle): string {
            let self = this;
            if (!style.textIndent && !style.textAlign) return text;
            let curText = self._curText || {} as egret.TextField;
            let textStyle = { fontFamily: style.fontFamily || curText.fontFamily || egret.TextField.default_fontFamily, size: style.size || curText.size || 16, bold: style.bold || curText.bold, italic: style.italic || curText.italic };
            let strWidth = egret.sys.measureText(text, textStyle.fontFamily, textStyle.size, textStyle.bold, textStyle.italic);//本行文本的宽度
            let textW = curText.width || curText.measuredWidth || 300;
            let spaceW = egret.sys.measureText(' ', textStyle.fontFamily, textStyle.size, textStyle.bold, textStyle.italic);//一个空格的宽度
            if (style.textAlign) {
                let leftW = textW - strWidth;
                if (leftW <= 0) return text;
                if (style.textAlign == 'center') {
                    let spaceCnt = Math.round(leftW / spaceW / 2);
                    return self.spaceStr(spaceCnt) + text;
                }
                else if (style.textAlign == 'right') {
                    let spaceCnt = Math.round(leftW / spaceW) - 1;
                    return self.spaceStr(spaceCnt) + text;
                }
                else {
                    return text;
                }
            }
            else if (style.textIndent) {
                let spaceStr = self.spaceStr(style.textIndent);
                return spaceStr + text;
            }
        }

        private spaceStr(cnt: number): string {
            let spaceStr = '';
            for (let i = 0; i < cnt; i++) {
                spaceStr += ' '
            }
            return spaceStr;
        }

        //将字符数据转成Json数据
        private changeStringToObject(str: string): ITextStyle {
            str = str.trim();
            let info: any = {};

            let header = [];
            if (str.charAt(0) == "i" || str.charAt(0) == "b" || str.charAt(0) == "u" || str.substr(0, 6) == "strong" || str.substr(0, 2) == "em") {
                this.addProperty(info, str, "true");
            }
            else if (header = str.match(/^(font|a|p|span|h\d+)\s/)) {
                str = str.substring(header[0].length).trim();
                let next: number = 0;
                let titles;
                while (titles = str.match(this.getHeadReg())) {
                    let title = titles[0];
                    let value = "";
                    str = str.substring(title.length).trim();
                    if (str.charAt(0) == "\"") {
                        next = str.indexOf("\"", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else if (str.charAt(0) == "\'") {
                        next = str.indexOf("\'", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else {
                        value = str.match(/(\S)+/)[0];
                        next = value.length;
                    }

                    this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim());
                    this.transH(header[1], info);
                    str = str.substring(next).trim();
                }
            }

            return info;
        }

        /** 转换标题字体 */
        private transH(header: string, info: ITextStyle): void {
            let pSizes = { h1: 32, h2: 24, h3: 18, h4: 16, h5: 13, h6: 12 };
            let size = pSizes[header];
            if (size) {
                if (!info.size) info.size = size;
                info.bold = true;
            }
        }


        private getHeadReg(): RegExp {
            return /^(color|textcolor|strokecolor|stroke|b|bold|i|italic|u|size|fontfamily|href|target|style)(\s)*=/;
        }


        private addProperty(info: ITextStyle, head: string, value: string): void {

            switch (head.toLowerCase()) {
                case "color":
                case "textcolor":
                    if (value.indexOf('rgb') >= 0) value = ColorUtil.colorRGB2Hex(value);
                    value = value.replace(/#/, "0x");
                    info.textColor = parseInt(value);
                    break;
                case "strokecolor":
                    value = value.replace(/#/, "0x");
                    info.strokeColor = parseInt(value);
                    break;
                case "stroke":
                    info.stroke = parseInt(value);
                    break;
                case "b":
                case "bold":
                case "strong":
                    info.bold = value == "true";
                    break;
                case "text-decoration-line":
                    info.underline = value == "underline";
                    break;
                case "u":
                    info.underline = value == "true";
                    break;
                case "i":
                case "em":
                case "italic":
                    info.italic = value == "true";
                    break;
                case "size":
                    info.size = parseInt(value);
                    break;
                case "font-size":
                    info.size = parseInt(value.substr(0, value.length - 2));
                    break;
                case "font-family":
                case "fontfamily":
                    info.fontFamily = value;
                    break;
                case "href":
                    info.href = this.replaceSpecial(value);
                    break;
                case "target":
                    info.target = this.replaceSpecial(value);
                    break;
                case "text-indent":
                    info.textIndent = parseInt(value.substr(0, value.length - 2));
                    break;
                case "text-align":
                    info.textAlign = value;
                    break;
                case "style":
                    let valArr = value.split(';');
                    let prop: string[];
                    for (let i = 0, len = valArr.length; i < len; i++) {
                        prop = valArr[i].split(':');
                        if (prop[0] && prop[1]) this.addProperty(info, prop[0].trim(), prop[1].trim());
                    }
                    break;
            }
        }

        private stackArray: Array<ITextStyle>;

        private addToArray(infoStr: string): void {
            let info: ITextStyle = this.changeStringToObject(infoStr);

            if (this.stackArray.length == 0) {
                this.stackArray.push(info);
            }
            else {
                let lastInfo: Object = this.stackArray[this.stackArray.length - 1];
                for (let key in lastInfo) {
                    if (info[key] == null) {
                        info[key] = lastInfo[key];
                    }
                }
                this.stackArray.push(info);
            }
        }
    }

    /*** 文本样式*/
    interface ITextStyle extends egret.ITextStyle {
        /** 首行缩进 */
        textIndent?: number;
        textAlign?: string;
    }
}
