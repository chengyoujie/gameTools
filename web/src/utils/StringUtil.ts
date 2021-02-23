/**
 * @project Cqll
 * @class StringUtil
 * @author byh
 * @usage 字串
 * @since 2016-7-6
 * @modified 2016-7-6
 * @modifier byh
*/
namespace tools {
	export class StringUtil extends egret.HashObject {

		/** 缓存计时器标识 */
		private static _looping: boolean;
		/** 特殊字符串Id标识 */
		public static STRID: string = "@Id";
		/** 文本替换参数字符标识 */
		public static TXT_PARAMS: string = "params=";
		/** 文本替换参数分割字符标识 */
		public static PARAM_DIV: string = "∮";
		/** 文本赋值事件变化标识 */
		public static TXT_EVENT_CHANGE: string = "text_event_change";
		/** 特殊字符请求数据缓存 */
		private static _strMsgs: { [strId: number]: { msg: string, tm: number } } = {};

		public static substitute(str: string, ...rest): string {
			if (!str) return '';
			let len = rest.length;
			let args: string[];
			let bool: boolean = rest[0] instanceof Array;
			if (len == 1 && bool) {
				args = rest[0];
				len = args.length;
			} else {
				args = rest;
			}
			for (let i: number = 0; i < len; i++) {
				str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
			}
			return str;
		}


		/**验证字符串是否是数字*/
		public static checkNumber(theObj): boolean {
			var reg = /^[0-9]+.?[0-9]*$/;
			if (reg.test(theObj)) {
				return true;
			}
			return false;
		}

		/**换行符转换 */
		public static getLineBreakStr(des: string): string {
			des = des.replace(new RegExp("\\\\n", "g"), 'br');
			return des;
		}

		private static byte: egret.ByteArray = new egret.ByteArray();
		/** 获得字符串的字节数，中英混合 */
		public static getStringByteLen(str: string): number {
			let ret: number = 0;
			this.byte.clear();
			this.byte.writeUTFBytes(str);
			ret = this.byte.length;
			return ret;
		}

		/***
		 * 获取是否满足目标值的数字格式文本
		 * @param {number} currValue
		 * @param {number} targetValue
		 * @param {boolean} isWhole 是否整个文本都更改颜色
		 * @returns {string}
		 */
		public static getLimitNumStr(currValue: number, targetValue: number, isWhole: boolean = false, enoughColor?: string, lessColor?: string): string {
			let str: string = "";
			currValue = ~~currValue;
			targetValue = ~~targetValue;
			if (!enoughColor) {
				enoughColor = ColorUtil.GREEN_S;
			}
			if (!lessColor) {
				lessColor = ColorUtil.RED_S;
			}
			let color = (currValue >= targetValue && targetValue > 0) ? enoughColor : lessColor;
			if (isWhole) {
				str = StringUtil.substitute(HtmlUtil.HTML_FORMAT, color, String(currValue + "/" + targetValue));
			} else {
				let numStr = StringUtil.substitute(HtmlUtil.HTML_FORMAT, color, String(currValue));
				str = numStr + "/" + targetValue;
			}
			return str;
		}

		/**
		 * 大数字转换
		 * @param count 数值
		 * @param digit 保留小数位
		 * @param significantDigit 保留字符串长度
		 * @param maxMyriabit 最大计数单位
		 */
		public static getDigitString(count: number, digit: number = 1, significantDigit: number = 4, maxMyriabit: boolean = false): string {
			let str: string;
			str = count + '';
			if (str.length <= significantDigit) return str;
			count = count / 10000.0;
			if (maxMyriabit) return StringUtil.getFiexd(count, digit) + "万";
			if (count < 10000) return StringUtil.getFiexd(count, digit) + "万";
			count = count / 10000.0;
			return StringUtil.getFiexd(count, digit) + "亿";
		}

		private static getFiexd(count: number, digit: number): string {
			let temp = Math.floor(count) + "";
			let len = digit;
			if (temp.length + len < 3 && digit > 0) len = 3 - temp.length;
			let num = Math.pow(10, len);
			return Math.floor(count * num) / num + "";
		}

		public static getColorStr(str: string | number, color: string): string {
			let value = String(str);
			return StringUtil.substitute(HtmlUtil.HTML_FORMAT, color, value);
		}


		public static split(str: string, c1?: string, c2?: string): any[] {
			let s = this;
			let strList = [];
			if (c1) strList = str.split(c1);
			if (c2) {
				let strLists = [];
				let lists: any[];
				for (let i = 0, len = strList.length; i < len; i++) {
					lists = strList[i].split(c2);
					for (let j = 0, cnt = lists.length; j < cnt; j++) {
						if (s.checkNumber(lists[j])) lists[j] = Number(lists[j]);
					}
					strLists.push(lists);
				}
				return strLists;
			}
			return strList;
		}

		/**验证字符串是否是英文*/
		public static checkEnglish(theObj): boolean {
			var reg = /^[a-zA-Z]*$/;
			if (reg.test(theObj)) {
				return true;
			}
			return false;
		}
	}
}