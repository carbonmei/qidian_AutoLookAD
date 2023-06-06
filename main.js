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
for (let index = 1; index < 11; index++) {
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
    sleep(20000)
    Close()  
    sleep(2000)
    toastLog("查找开心收下")
    var meButton =text("开心收下").findOnce()
    if (meButton != undefined){
        meButton = meButton.parent();
        meButton.click()
    }               
    toastLog("看视频结束: " + caption) 
    sleep(2000)
}
// 定义一个函数，用于阅读书籍
function readBooks() {
  // 视频看完后，点击带有“去完成”的按钮
  var button = text("去完成").findOne();
  if (button) {
    button.click();
  }

  // 跳转到“任务书单”页面后，获取所有带有“阅读”字样的按钮
  var books = text("阅读").find();

// 定义一个函数，用于按顺序选择一个按钮并点击
function chooseBook() {
  // 获取所有带有“阅读”字样的按钮
  var books = text("阅读").find();
  // 判断是否有足够的书籍可供选择，如果没有，就提示并退出程序
  if (books.length < 6) {
    toast("没有找到足够的书籍");
    exit();
  }
  // 如果有超过6个书籍，就只保留前6个
  if (books.length > 6) {
    books = books.slice(0, 6);
  }
  // 获取当前已阅读的书籍数量
  var num = count + 1;
  // 获取对应位置的按钮
  var book = books[num - 1];
  // 点击按钮
  book.click();
  // 返回按钮
  return book;
}
  // 定义一个变量，用于记录已经阅读的书籍数量
  var count = 0;

  // 定义一个函数，用于阅读一本书籍一分钟以上，并返回
  function readBook() {
    // 随机选择一本书籍并点击
    var book = chooseBook();
    // 随机生成一个时间值，介于60秒到120秒之间
    var time = random(60, 80);
    // 等待时间过去后，返回上一页
    sleep(time * 1000);
    back();
    // 增加已阅读的书籍数量
    count++;
    // 判断是否已经阅读了6本书籍，如果是，就结束程序，如果不是，就继续阅读下一本书籍
    if (count == 6) {
      toast("任务完成");
      exit();
    } else {
      readBook();
    }
  }

  // 开始阅读第一本书籍
  readBook();
}

// 调用阅读书籍函数
readBooks();
