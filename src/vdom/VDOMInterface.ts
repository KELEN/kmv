export interface VDOMInterface {
    renderInit(data, kmv):any;  // 初始化
    reRender(data, kmv);    // 重新渲染
}