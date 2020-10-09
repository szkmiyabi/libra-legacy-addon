class libraUtil {

    //メイン処理をクラスで定義
    
    //コンストラクタ
    constructor() {
    }
}

const util = new libraUtil();

browser.runtime.onMessage.addListener((message) => {
    let cmd = message.command;
    switch(cmd) {
        default:
            break;
    }
});
