/////////////////////////////////////////////////////
//     线程间相互通信  协议
///////////////////////////////////////////////////


/**
 * 主线程向渲染线程发送消息
 */
const enum Main2RenderMsgType{
    /**项目编译 */
    EgretBuild = 1,
}



/**
 * 渲染线程向主线程发送消息
 */
const enum Render2MainMsgType{
    
}