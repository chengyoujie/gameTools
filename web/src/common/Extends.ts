declare module egret {
    export interface DisplayObject {
        clk(listener: Function, thisObject: any): void;
        /**
         * 长按间隔一段时间执行监听函数
         * @param listener 监听函数
         * @param thisObject this指向
         * @param gapTime 长按时间隔多少ms执行一次监听函数 
         */
        clklong(listener: Function, thisObject: any, gapTime?: number): void;
        /**取消长按监听 */
        offclklong(listener: Function, thisObject: any): void;
        offclk(listener: Function, thisObject: any): void;
        removeSelf(): void;
        setEnabled(value: boolean): void;
        scale: number;
        tag: number;
        filters: (Filter | CustomFilter)[];
        /**当前对象的可点击区域*/
        hitArea: egret.Rectangle;
    }
}
declare module eui {
    export interface List {
        /**
        * 设置列表数据
        * @param dataArr 数据列表。
        * @param isSelectLast 是否选择上次的选项，并滚动到所选项的位置
        */
        setDataArr(dataArr: any[], isSelectLast?: boolean);
        /***
         * 滚动到那个索引的位置
         * index 滚动到那一项
         * tweenTime 默认为0 不使用滚动， 大于0则表示使用tween滚动的时间
         * toTop  是否滚动到顶部， 默认false如果在显示区域内则不滚动
         */
        scrollToIndex(index: number, tweenTime?: number, toTop?: boolean);
        /**是否进行合批绘制， 默认合批绘制 */
        autoBatch?:boolean;
    }

    export interface IItemRenderer {
        rmvFromStage?: () => void;
        onToStage?: () => void;
    }

    // export interface Scroller {

    //     bindList(list: eui.List, btn_left: egret.DisplayObject, btn_right: egret.DisplayObject, itemW: number, redSize?:number,prop?:string);
    // }

    // export interface Component {
    //     setEnabled(value: boolean): void;
    // }
}
declare module RES {
    function on(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean, priority?: number): void;
    function off(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean): void;
}

declare module egret {
    interface IEventDispatcher {
        once(type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 简写, 等同于 addEventListener
         */
        on(type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;

        /**
         * 简写, 等同于 removeEventListener
         */
        off(type: string | number, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * 简写, 等同于 dispatchEvent
         */
        post(type: string | number, data?: any, bubbles?: boolean, cancelable?: boolean): boolean;
    }

    interface EventDispatcher {
        once(type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 简写, 等同于 addEventListener
         */
        on(type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;

        /**
         * 简写, 等同于 removeEventListener
         */
        off(type: string | number, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * 简写, 等同于 dispatchEventWith
         */
        post(type: string | number, data?: any, bubbles?: boolean, cancelable?: boolean): boolean;

        rmvByTar(tar: any): void;
    }
}


(function () {
    let f, p, t;
    p = egret.EventDispatcher.prototype;
    Object.defineProperties(p, {
        once: {
            value: function (type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number) {
                let tt: string = type + "";
                this.addEventListener(tt, listener, thisObject, useCapture, priority, true);
            },
            enumerable: false
        },
        on: {
            value: function (type: string | number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number) {
                let tt: string = type + "";
                this.addEventListener(tt, listener, thisObject, useCapture, priority);
            },
            enumerable: false
        },
        off: {
            value: function (type: string | number, listener: Function, thisObject: any, useCapture?: boolean) {
                let tt: string = type + "";
                this.removeEventListener(tt, listener, thisObject, useCapture);
            },
            enumerable: false
        },
        post: {
            value: function (type: string | number, data?: any, bubbles?: boolean, cancelable?: boolean): boolean {
                let tt: string = type + "";
                return this.dispatchEventWith(tt, bubbles, data, cancelable);
            },
            enumerable: false
        },
        addEventListener: {
            value: function (type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, once = false): void {
                if (thisObject) {
                    let evtObInfo: { evtObjs: egret.EventDispatcher[], evtHash: egret.MapLike<boolean> } = thisObject.evtObInfo;
                    if (evtObInfo) {
                        if (!evtObInfo.evtHash[this.hashCode]) {
                            evtObInfo.evtHash[this.hashCode] = true;
                            evtObInfo.evtObjs.push(this);
                        }
                    }
                }
                this.$addListener(type, listener, thisObject, useCapture, priority, once);
            },
            enumerable: false
        },
        rmvByTar: {
            value: function (thisObject: any): void {
                let Keys = {
                    eventTarget: 0,
                    eventsMap: 1,
                    captureEventsMap: 2,
                    notifyLevel: 3
                }
                let self = this;
                let values = self.$EventDispatcher;
                function rmvOneType(type: string, map: Object) {
                    let list: egret.sys.EventBin[] = map[type];
                    if (!list) return;
                    if (values[Keys.notifyLevel] !== 0) {
                        map[type] = list = list.concat();
                    }

                    let length = list.length;
                    for (let i = length - 1; i >= 0; i--) {
                        let bin = list[i];
                        if (bin.thisObject == thisObject && bin.target == self) {
                            list.splice(i, 1);
                        }
                    }

                    if (list.length == 0) map[type] = null;
                }
                let eventMap: Object = values[Keys.eventsMap];
                let type: string;
                for (type in eventMap) {
                    rmvOneType(type, eventMap);
                }

                eventMap = values[Keys.captureEventsMap];
                for (type in eventMap) {
                    rmvOneType(type, eventMap);
                }
            },
            enumerable: false
        }
    });
    RES.on = RES.addEventListener;
    RES.off = RES.removeEventListener;
    egret.toColorString = function toColorString(value: number): string {
        if (value <= 0) {
            value = 0;
        }
        else if (value > 16777215 || !value) {
            value = 16777215;
        }
        let color: string = value.toString(16).toUpperCase();
        while (color.length > 6) {
            color = color.slice(1, color.length);
        }
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    };

    p = egret.ByteArray.prototype;
    Object.defineProperties(p, {
        decodeUTF8: {
            value: function (data: Uint8Array): string {
                let fatal: boolean = false;
                let pos: number = 0;
                let result: string[] = [];
                let code_point: number;
                let utf8_code_point = 0;
                let utf8_bytes_needed = 0;
                let utf8_bytes_seen = 0;
                let utf8_lower_boundary = 0;

                while (data.length > pos) {

                    let _byte = data[pos++];

                    if (_byte == this.EOF_byte) {
                        if (utf8_bytes_needed != 0) {
                            code_point = this.decoderError(fatal);
                        } else {
                            code_point = this.EOF_code_point;
                        }
                    } else {

                        if (utf8_bytes_needed == 0) {
                            if (this.inRange(_byte, 0x00, 0x7F)) {
                                code_point = _byte;
                            } else {
                                if (this.inRange(_byte, 0xC2, 0xDF)) {
                                    utf8_bytes_needed = 1;
                                    utf8_lower_boundary = 0x80;
                                    utf8_code_point = _byte - 0xC0;
                                } else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                    utf8_bytes_needed = 2;
                                    utf8_lower_boundary = 0x800;
                                    utf8_code_point = _byte - 0xE0;
                                } else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                    utf8_bytes_needed = 3;
                                    utf8_lower_boundary = 0x10000;
                                    utf8_code_point = _byte - 0xF0;
                                } else {
                                    this.decoderError(fatal);
                                }
                                utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                                code_point = null;
                            }
                        } else if (!this.inRange(_byte, 0x80, 0xBF)) {
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            pos--;
                            code_point = this.decoderError(fatal, _byte);
                        } else {

                            utf8_bytes_seen += 1;
                            utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

                            if (utf8_bytes_seen !== utf8_bytes_needed) {
                                code_point = null;
                            } else {

                                let cp = utf8_code_point;
                                let lower_boundary = utf8_lower_boundary;
                                utf8_code_point = 0;
                                utf8_bytes_needed = 0;
                                utf8_bytes_seen = 0;
                                utf8_lower_boundary = 0;
                                if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                    code_point = cp;
                                } else {
                                    code_point = this.decoderError(fatal, _byte);
                                }
                            }

                        }
                    }
                    //Decode string
                    if (code_point !== null && code_point !== this.EOF_code_point) {
                        if (code_point <= 0xFFFF) {
                            if (code_point > 0) result.push(String.fromCharCode(code_point));
                        } else {
                            code_point -= 0x10000;
                            result.push(String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff)));
                            result.push(String.fromCharCode(0xDC00 + (code_point & 0x3ff)));
                        }
                    }
                }
                return result.join("");
            },
            enumerable: false
        }
    });

    p = eui.List.prototype;
    Object.defineProperties(p, {
        setDataArr: {
            value: function (dataArr: any[], resetScroll = false) {
                let self = this;
                let dataProvider = self.dataProvider as eui.ArrayCollection;
                let oldSelectData = self.selectedItem;
                if (dataProvider) {
                    dataProvider.source = dataArr;
                } else {
                    self.dataProvider = new eui.ArrayCollection(dataArr);
                }
                if (resetScroll && dataArr) {
                    self.scrollToIndex(dataArr.indexOf(oldSelectData));
                }
            }
        },
        scrollToIndex: {
            value: function (index: number, tweenTime: number = 0, toTop = false) {
                if (index < 0) return;
                let self = this;
                let dataProvider = self.dataProvider as eui.ArrayCollection;
                let dataArr = dataProvider.source;
                if (!dataArr || index >= dataArr.length) return;//没有数据或者索引大于当前最大的索引
                let oldScrollH = self.scrollH;
                let oldScrollV = self.scrollV;
                self.selectedIndex = index;
                self.validateProperties();
                let renderItem = self.getElementAt(index);
                if (renderItem)
                    eui.ItemTapEvent.dispatchItemTapEvent(self, eui.ItemTapEvent.ITEM_TAP, renderItem);
                if (self.layout) {
                    let item = self.getVirtualElementAt(0);
                    let contentWidth = self.contentWidth;
                    let contentHeight = self.contentHeight;
                    let listWidth = self.width;
                    let listHeight = self.height;
                    if (self.layout instanceof eui.HorizontalLayout) {
                        if (contentWidth == 0) {
                            contentWidth = self.numElements * (item.width + self.layout.gap);
                            if (self.parent instanceof eui.Scroller)
                                listWidth = self.parent.width;
                        }
                        if (item && contentWidth > 0) {
                            let scrollpos = index * (item.width + self.layout.gap);
                            if (!toTop && oldScrollH <= scrollpos && oldScrollH + listWidth - item.width >= scrollpos)
                                scrollpos = oldScrollH;
                            if (scrollpos > contentWidth - listWidth)
                                scrollpos = contentWidth - listWidth;
                            self.layout.$typicalWidth = item.width;
                            if (tweenTime) {
                                egret.Tween.get(self).to({ scrollH: scrollpos }, tweenTime);
                            } else {
                                self.scrollH = scrollpos;
                            }
                        }
                    } else if (self.layout instanceof eui.VerticalLayout) {
                        if (contentHeight == 0) {
                            contentHeight = self.numElements * (item.height + self.layout.gap);
                            if (self.parent instanceof eui.Scroller)
                                listHeight = self.parent.height;
                        }
                        if (item && contentHeight > 0) {
                            let scrollpos = index * (item.height + self.layout.gap);
                            if (!toTop && oldScrollV <= scrollpos && oldScrollV + listHeight - item.height >= scrollpos)
                                scrollpos = oldScrollV;
                            if (scrollpos > contentHeight - listHeight)
                                scrollpos = contentHeight - listHeight;

                            self.layout.$typicalHeight = item.height;
                            if (tweenTime) {
                                egret.Tween.get(self).to({ scrollV: scrollpos }, tweenTime);
                            } else {
                                self.scrollV = scrollpos;
                            }
                        }
                    } else if (self.layout instanceof eui.TileLayout) {
                        if (contentHeight == 0) {
                            contentHeight = Math.ceil(self.numElements / self.layout.columnCount) * (item.height + self.layout.verticalGap);
                            if (self.parent instanceof eui.Scroller)
                                listHeight = self.parent.height;
                        }
                        if (item && contentHeight > 0) {
                            let scrollpos = Math.floor(index / self.layout.columnCount) * (item.height + self.layout.verticalGap);
                            if (!toTop && oldScrollV <= scrollpos && oldScrollV + listHeight - item.height >= scrollpos)
                                scrollpos = oldScrollV;
                            if (scrollpos > contentHeight - listHeight)
                                scrollpos = contentHeight - listHeight;

                            self.layout.$typicalHeight = item.height;
                            if (tweenTime) {
                                egret.Tween.get(self).to({ scrollV: scrollpos }, tweenTime);
                            } else {
                                self.scrollV = scrollpos;
                            }

                        }
                    }
                }
            }
        }
    });

    p = eui.Scroller.prototype;
    Object.defineProperties(p, {
        bindList: {
            value: function (list: eui.List, btn_left: egret.DisplayObject, btn_right: egret.DisplayObject, itemW: number, redSize: number = 14, prop = '') {
                if (this.viewport != list) {
                    throw new Error("Scroller bindList 的list 不是Scroller的viewport 请在Skin里把list放在scroll里面");
                    // return;
                }
                let _tween: egret.Tween;
                btn_left.clk(handleListPre, this);
                btn_right.clk(handleListNext, this);
                // this.addEventListener(egret.Event.CHANGE, refushListBtnState, this)
                this.addEventListener(eui.UIEvent.CHANGE_END, refushListBtnState, this);
                // refushListBtnState();//先初始化刷新下状态
                tools.loopMgr.once(refushListBtnState, this, 200);//200ms后刷新下程序， 否则有可能还没有获取该list的宽高
                function refushListBtnState() {
                    if (list.measuredWidth < list.width)//如果列表宽度大于内容宽度，先暂时不能左右滑动（按钮灰掉）如需要隐藏则可以尝试传递option参数的形式处理
                    {
                        btn_left.setEnabled(false);
                        btn_right.setEnabled(false);
                    } else if (list.scrollH <= 0) {
                        btn_left.setEnabled(false);
                        btn_right.setEnabled(true);
                    }
                    else if (list.scrollH >= list.measuredWidth - list.width) {
                        btn_left.setEnabled(true);
                        btn_right.setEnabled(false);
                    } else {
                        btn_left.setEnabled(true);
                        btn_right.setEnabled(true);
                    }
                    let gap = (list.layout as eui.HorizontalLayout).gap;
                    let startIndex = Math.floor((list.scrollH) / (itemW + gap));
                    let endIndex = Math.round((list.scrollH + list.width) / (itemW + gap));
                    let len = list.numElements;
                    let has = false;
                    for (let i = 0; i < startIndex; i++) {
                        let item = list.getVirtualElementAt(i);
                        if (item) {
                            if ((prop && item[prop]["RED_KEY"]) || item["RED_KEY"]) {
                                has = true;
                                break;
                            }
                        }
                    }
                    setIconShow(btn_left, has);
                    has = false;
                    for (let i = endIndex; i < len; i++) {
                        let item = list.getVirtualElementAt(i);
                        if (item) {
                            if ((prop && item[prop]["RED_KEY"]) || item["RED_KEY"]) {
                                has = true;
                                break;
                            }
                        }
                    }
                    setIconShow(btn_right, has);
                }

                function setIconShow(btn: egret.DisplayObject, isShow: boolean) {
                    let redIcon = btn["RED_KEY"];
                    if (!redIcon) {
                        redIcon = btn["RED_KEY"] = new eui.Image();
                        redIcon.source = 'icn_yd_png';
                        redIcon.width = redIcon.height = redSize;
                        // redIcon.scaleX ;
                        // redIcon.scaleY = btn.scaleY-0.1;
                        if (btn instanceof egret.DisplayObjectContainer) {
                            if (btn == btn_left)
                                redIcon.x = redIcon.width / 2;
                            else
                                redIcon.x = redIcon.width / 2;
                            // redIcon.y = -redIcon.height;
                            btn.addChild(redIcon);
                        } else if (btn.parent) {
                            if (btn == btn_left)
                                redIcon.x = btn.x + redIcon.width / 2;// + btn.width*btn.scaleX - redIcon.width;
                            else
                                redIcon.x = btn.x - redIcon.width * 1.5;// + btn.width*btn.scaleX;// - redIcon.width/2;
                            redIcon.y = btn.y;// - redIcon.height;
                            btn.parent.addChild(redIcon);
                        }
                    }
                    redIcon.visible = isShow;
                }

                /**点击列表向前一页 */
                function handleListPre() {
                    if (_tween) {
                        _tween.pause();
                        _tween = null;
                    }
                    let gap = (list.layout as eui.HorizontalLayout).gap;
                    // let index = Math.floor((this.viewport.scrollH - this.width)/(itemW+gap));
                    // let pos =  index*(itemW+gap);
                    let index = Math.floor((this.viewport.scrollH - itemW - gap) / (itemW + gap));
                    let pos = index * (itemW + gap);
                    if (pos < 0) pos = 0;
                    _tween = egret.Tween.get(this.viewport).to({ scrollH: pos }, Math.abs(this.viewport.scrollH - pos) / 0.9).call(handleRefushSelect, this, [Math.ceil(pos / (itemW + gap))]);

                }
                function handleRefushSelect(index: number) {
                    list.selectedIndex = index;
                    refushListBtnState();
                }
                /**点击列表向后一页 */
                function handleListNext() {
                    if (_tween) {
                        _tween.pause();
                        _tween = null;
                    }
                    let gap = (list.layout as eui.HorizontalLayout).gap;
                    // let index = Math.ceil((this.viewport.scrollH + this.width)/(itemW+gap));
                    // let pos =  index*(itemW+gap);

                    let index = Math.floor((this.viewport.scrollH + itemW + gap) / (itemW + gap));
                    let pos = index * (itemW + gap);
                    // let pos = this.viewport.scrollH + itemW+gap;
                    let endpos = this.viewport.contentWidth - this.width;
                    if (pos > endpos) pos = endpos;
                    _tween = egret.Tween.get(this.viewport).to({ scrollH: pos }, Math.abs(this.viewport.scrollH - pos) / 0.9).call(handleRefushSelect, this, [Math.ceil(pos / (itemW + gap))]);
                    // list_shenshou.selectedIndex = Math.ceil(pos/(itemW+gap));
                }


            }

        }
    });


    p = egret.DisplayObjectContainer.prototype;
    let t2 = p.$doAddChild;
    Object.defineProperties(p, {
        $hitTest: {
            value: function (stageX: number, stageY: number): egret.DisplayObject {
                if (!this.$visible) {
                    return null;
                }
                let m = this.$getInvertedConcatenatedMatrix();
                let localX = m.a * stageX + m.c * stageY + m.tx;
                let localY = m.b * stageX + m.d * stageY + m.ty;
                if (this.hitArea) {
                    if (this.hitArea.contains(localX, localY)) {
                        return this;
                    }
                    return null;
                }
                let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
                if (rect && !rect.contains(localX, localY)) {
                    return null;
                }
                if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                    return null;
                }
                const children = this.$children;
                let found = false;
                let target: egret.DisplayObject = null;
                for (let i = children.length - 1; i >= 0; i--) {
                    const child = children[i];
                    if (child.$maskedObject) {
                        continue;
                    }
                    target = child.$hitTest(stageX, stageY);
                    if (target) {
                        found = true;
                        if (target.$touchEnabled) {
                            break;
                        }
                        else {
                            target = null;
                        }
                    }
                }
                if (target) {
                    if (this.$touchChildren) {
                        return target;
                    }
                    return this;
                }
                if (found) {
                    return this;
                }
                return egret.DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
            },
            enumerable: false
        }
    });


    p = egret.DisplayObject.prototype;
    Object.defineProperties(p, {
        clk: {
            value: function (listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
                this.on(egret.TouchEvent.TOUCH_TAP, listener, thisObject, useCapture, priority);
            },
            enumerable: false
        },
        clklong: {//长按某个键
            value: function (listener: Function, thisObject: any, gapTime?: number, useCapture?: boolean, priority?: number): void {
                gapTime = gapTime || 200;
                listener["$_CLKLONGKEY"] = handleStartTouch;
                this.on(egret.TouchEvent.TOUCH_BEGIN, handleStartTouch, thisObject, useCapture, priority);
                function handleStartTouch() {
                    egret.sys.$TempStage.addEventListener(egret.TouchEvent.TOUCH_END, handleTouchEnd, this);
                    tools.loopMgr.once(startApply, thisObject, 1000);
                }
                function startApply() {
                    listener.apply(thisObject);
                    tools.loopMgr.clear(startApply, thisObject);
                    tools.loopMgr.loop(listener, thisObject, gapTime);
                }
                function handleTouchEnd() {
                    tools.loopMgr.clear(listener, thisObject);
                    tools.loopMgr.clear(startApply, thisObject);
                    egret.sys.$TempStage.removeEventListener(egret.TouchEvent.TOUCH_END, handleTouchEnd, this)
                }
            },
            enumerable: false
        },
        offclklong: {
            value: function (listener: Function, thisObject: any, useCapture?: boolean): void {
                this.off(egret.TouchEvent.TOUCH_BEGIN, listener["$_CLKLONGKEY"], thisObject, useCapture);
                listener["$_CLKLONGKEY"] = undefined;
                delete listener["$_CLKLONGKEY"];
            },
            enumerable: false
        },
        offclk: {
            value: function (listener: Function, thisObject: any, useCapture?: boolean): void {
                this.off(egret.TouchEvent.TOUCH_TAP, listener, thisObject, useCapture);
            },
            enumerable: false
        },
        removeSelf: {
            value: function (): void {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            },
            enumerable: false
        },
        setEnabled: {
            value: function (value: boolean) {
                this.enabled = value;
                this.filters = !value ? tools.ColorUtil.FILTER_GRAY : undefined;
            },
            enumerable: false
        },
        scale: {
            set(value: number) {
                var sx = this.$getScaleX() < 0 ? -1 : 1;
                var sy = this.$getScaleY() < 0 ? -1 : 1;
                this.$setScaleX(sx * value);
                this.$setScaleY(sy * value);
            },
            get() {
                return this.$getScaleX() || this.$getScaleY();
            },
            enumerable: false
        },
        $hitTest: {
            value: function (stageX: number, stageY: number): egret.DisplayObject {
                let self = this;
                if ((!egret.nativeRender && !self.$renderNode) || !self.$visible || self.$scaleX == 0 || self.$scaleY == 0) {
                    if (!self.hitArea) {
                        return null;
                    }
                }
                let m = self.$getInvertedConcatenatedMatrix();
                if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
                    if (!self.hitArea) {
                        return null;
                    }
                }
                let bounds = self.$getContentBounds();
                let localX = m.a * stageX + m.c * stageY + m.tx;
                let localY = m.b * stageX + m.d * stageY + m.ty;
                if (self.hitArea) {
                    if (self.hitArea.contains(localX, localY)) {
                        return self;
                    }
                    return null;
                }
                if (bounds.contains(localX, localY)) {
                    if (!self.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。
                        let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                        if (rect && !rect.contains(localX, localY)) {
                            return null;
                        }
                        if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                            return null;
                        }
                    }
                    return self;
                }
                return null;
            },
            enumerable: false
        },

        filters: {
            set(value: (egret.Filter | egret.CustomFilter)[]) {
                let self = this;
                if (egret.Capabilities.renderMode != 'webgl') return;
                let filters: egret.Filter[] = self.$filters;
                if (!filters && !value) {
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(null);
                    }
                    else {
                        self.$updateRenderMode();
                        let p = self.$parent;
                        if (p && !p.$cacheDirty) {
                            p.$cacheDirty = true;
                            p.$cacheDirtyUp();
                        }
                        let maskedObject = self.$maskedObject;
                        if (maskedObject && !maskedObject.$cacheDirty) {
                            maskedObject.$cacheDirty = true;
                            maskedObject.$cacheDirtyUp();
                        }
                    }
                    return;
                }
                if (value && value.length) {
                    value = value.concat();
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(value);
                    }
                }
                else {
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(null);
                    }
                }
                if (!egret.nativeRender) {
                    self.$updateRenderMode();
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            },
            get() {
                return this.$filters;
            },
            enumerable: false
        }
    });


})();
