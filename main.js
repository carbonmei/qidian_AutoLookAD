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
    var meButton = text(str).findOnce()
    if (meButton != undefined){
        meButton = meButton.parent();
        toastLog("找到了" + str)
        meButton.click()
    }  
}

function Close(){
    // back() 失效 原因未知
    var meButton =className("android.widget.Image").text("cross").findOnce()
    if (meButton == undefined){
        meButton = className("android.widget.Image").text("此图片未加标签。打开右上角的“更多选项”菜单即可获取图片说明。").findOnce()
    }    
    if (meButton != undefined){
        meButton = meButton.parent();
        toastLog("找到了关闭按钮")
        meButton.click()
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
for (let index = 1; index < 14; index++) {
    let caption = "第" + parseInt(index) +"个"   
    var meButton = undefined
    if(index>8){
        meButton =text("看视频").findOnce();
    }else{
        meButton =textMatches("看第\\d+个视频").findOnce();
        if (meButton == undefined){
            continue
        }
        caption = meButton.text()        
    }
    toastLog("看视频" + caption)
    if (meButton == undefined){
        toastLog("没有找到:" + caption)
        continue
    }    
    meButton.click()
    toastLog("看视频等待20s" + caption)
    sleep(21000)
    Close()  
    sleep(2000)
    toastLog("查找我知道了")
    var meButton =text("我知道了").findOnce()
    if (meButton != undefined){
        meButton = meButton.parent();
        meButton.click()
    }               
    toastLog("看视频结束: " + caption) 
    sleep(2000)
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
        for (let j = 60; j > 0; j--) {
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
var claimButton = text("领取").findOnce();
if (claimButton) {
    claimButton.click();
}

