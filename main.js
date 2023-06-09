importClass(android.content.Context);
importClass(android.provider.Settings);
try {
    var enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
    log('当前已启用的辅助服务\n', enabledServices);
    var Services = enabledServices + ":com.script.main/com.stardust.autojs.core.accessibility.AccessibilityService";
    Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, Services);
    Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '1');
    toastLog("成功开启AutoJS的辅助服务");
} catch (error) {
    //授权方法：开启usb调试并使用adb工具连接手机，执行 adb shell pm grant com.script.main android.permission.WRITE_SECURE_SETTINGS
    toastLog("\n请确保已给予 WRITE_SECURE_SETTINGS 权限\n\n授权代码已复制，请使用adb工具连接手机执行(重启不失效)\n\n", error);
    setClip("adb shell pm grant com.script.main android.permission.WRITE_SECURE_SETTINGS");
}


function MyClick(str){
    var meButton = undefined
    for(let m = 1; m < 3; m++){
        meButton = text(str).findOnce()
        if (meButton != undefined){
            meButton = meButton.parent();
            toastLog("找到了" + str)
            meButton.click();
            break;
        }else{
            toastLog("未找到(" + str + ")按钮,5秒后重试")
            sleep(5000)
            m = 1
        }
    }
}

function Close(){
    var cButton =text("继续观看").findOnce()
    if(cButton != undefined){
        cButton.click()
        sleep(500)
    }

    // back() 失效 原因未知
    var meButton =className("android.widget.Image").text("cross").findOnce()
    if (meButton == undefined){
        sleep(1000)
        meButton = className("android.widget.Image").text("此图片未加标签。打开右上角的“更多选项”菜单即可获取图片说明。").findOnce()
    }
    if(meButton != undefined){
        meButton = meButton.parent();
        toastLog("找到了关闭按钮")
        meButton.click()
    }else{
        for(let c = 0; c < 5; c++){
            sleep(1000)
            meButton =className("android.widget.Image").text("cross").findOnce()
            //其他判断暂时待定
            if(meButton != undefined){
                meButton = meButton.parent();
                toastLog("找到了关闭按钮")
                meButton.click()
                break
            }
        }
    }
}

function st(){
    toastLog("全部奖励已领完,停止脚本")
    engines.stopAll()
}

function lq(){
    toastLog("查找我知道了")
    var cButton =text("我知道了").findOnce()
    if (cButton != undefined){
        cButton = cButton.parent();
        cButton.click()
        sleep(500)
    }else{
        sleep(2000)
        cButton =text("我知道了").findOnce()
        if(cButton != undefined){
            cButton = cButton.parent();
            cButton.click()
            sleep(500)
        }else{
            //如果是第10/11个就没有领取按钮就正常
            toastLog("未找到领取按钮")
            
        }
    }
}

home()

if (launchApp("起点读书")){
    toastLog("启动起点读书成功")
}else{
    toastLog("启动起点读书失败")
}
sleep(3000)

//找到我
MyClick("我")
sleep(2000)
MyClick("福利中心")
sleep(2000)

//看视频1-8
var fButton = undefined
var eButton = undefined
let b = 0;
fButton = textMatches("看第\\d+个视频").findOnce();
eButton = textMatches("看视频").findOnce();
for(let a = 1; a < 3; a++){
    sleep(2000)
    fButton = textMatches("看第\\d+个视频").findOnce();
    eButton = textMatches("看视频").findOnce();
    a = 1
    if(fButton != undefined){
        see()
        break
    }else{
        sleep(2000)
    }
    if(eButton == undefined){
        b = b+1;
        if(b == 5){
            b = 4
            fButton = textMatches("明天再来吧").findOnce();
            eButton = textMatches("已领取").findOnce();
            if(fButton != undefined && eButton != undefined){
                st()
            }
        }
    }else{
        see2()
        break
    }
}

function see(){
    for (let index = 1; index < 11; index++) {
        let caption = "第" + parseInt(index) +"个"   
        var meButton = undefined
        meButton =textMatches("看第" + index +"个视频").findOnce();
        if (meButton == undefined){
            toastLog(caption + "视频没有找到!,1s后查找下一个")
            sleep(1000)
            continue
        }
        caption = meButton.text()
        meButton.click()
        toastLog(caption + "开始!等待20s") 
        sleep(20000)
        Close()  
        sleep(2000)
        lq()
        toastLog(caption + ",结束!") 
        sleep(2000)
    }
    eButton = textMatches("看视频").findOnce();
    if(eButton != undefined){
        see2()
    }else{
        st()
    }
}
function see2(){
    eeButton = textMatches("看视频").findOnce();
    if(eeButton != undefined){
        toastLog("尝试划动屏幕")
        const btrue = new Boolean(true);
        btrue = textMatches("明天再来吧").findOnce().scrollForward()
        toastLog(btrue)
    }
    
    var eButton = undefined
    for(let a = 9; a < 13; a++){
        eButton = textMatches("看视频").findOnce();
        if(eButton != undefined){
            eButton.click()
            sleep(500)
            toastLog("看第" + a + "个视频等待20s")
            sleep(20000)
            Close()
            sleep(1000)
            lq()
        }
    }
    st()
}
// Click on the button with text "去完成"
var completeButton = text("去完成").findOnce();
if (completeButton) {
    completeButton.click();
    sleep(2000);
}

// Wait for the "任务书单" page to load
waitForActivity("com.qidian.QDReader.ui.activity.QDBrowserActivity");
sleep(2000);

// Select 6 books and read each for 60 seconds
for (let i = 0; i < 6; i++) {
    // Find the "阅读" button for the book and click it
    var readButton = text("阅读").findOnce(i);
    if (readButton) {
        readButton.click();

        // Read for 60 seconds
        for (let j = 62; j > 0; j--) {
            toastLog("剩余时间: " + j + " 秒");
            sleep(1000);
        }

        back(); // Go back to the "任务书单" page
        sleep(2000);
    }

    // Handle the "QDUICommonTipDialog" dialog if it appears
    if (currentActivity() === "com.qd.ui.component.widget.dialog.QDUICommonTipDialog") {
        // Click the "取消" button using the coordinates you provided
        click(365, 1245);
        sleep(2000);
    }
}
// Return to the welfare center page and click the "领取" button
back();
sleep(2000);
var claimButton = text("领奖励").findOnce();
if (claimButton) {
    claimButton.click();
}

