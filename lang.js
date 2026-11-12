(function () {
  "use strict";
  window.__mbLangLoaded = true;

  var STORE_KEY = "mb_lang";
  var LANGS = ["en", "vi", "km", "zh"];

  // [en, vi, km, zh, prefixMode]
  // prefixMode: 0 exact only, "p" label followed by ":"/"("/"·", "s" also allows a space
  var DICT = [
    ["Home", "Trang chủ", "ទំព័រដើម", "首页"],
    ["Scanner", "Trình quét", "ម៉ាស៊ីនស្កេន", "扫一扫"],
    ["Notifications", "Thông báo", "ការជូនដំណឹង", "通知"],
    ["Settings", "Cài đặt", "ការកំណត់", "设置"],
    ["Referral", "Giới thiệu", "ណែនាំមិត្តភក្តិ", "推荐"],
    ["Good morning,", "Chào buổi sáng,", "អរុណសួស្តី,", "早上好，"],
    ["Transaction history", "Lịch sử giao dịch", "ប្រវត្តិប្រតិបត្តិការ", "交易记录"],
    ["ADD", "THÊM", "បន្ថែម", "添加"],
    ["Main features", "Tính năng chính", "មុខងារសំខាន់", "主要功能"],
    ["See all", "Xem tất cả", "មើលទាំងអស់", "查看全部"],
    ["Domestic transfer", "Chuyển tiền nội địa", "ផ្ទេរប្រាក់ក្នុងស្រុក", "国内转账"],
    ["International transfer", "Chuyển tiền quốc tế", "ផ្ទេរប្រាក់អន្តរជាតិ", "国际转账"],
    ["Savings & Investment", "Tiết kiệm & Đầu tư", "សន្សំ និងវិនិយោគ", "储蓄与投资"],
    ["Loan", "Khoản vay", "កម្ចី", "贷款"],
    ["Mobile top-up", "Nạp tiền điện thoại", "បញ្ចូលទូរស័ព្ទ", "手机充值"],
    ["ATM withdrawal", "Rút tiền ATM", "ដកប្រាក់តាម ATM", "ATM取款"],
    ["Show balance", "Hiện số dư", "បង្ហាញសមតុល្យ", "显示余额"],
    ["Hide balance", "Ẩn số dư", "លាក់សមតុល្យ", "隐藏余额"],
    ["Payment account", "Tài khoản thanh toán", "គណនីទូទាត់", "支付账户", "p"],
    ["Savings account", "Tài khoản tiết kiệm", "គណនីសន្សំ", "储蓄账户", "p"],
    ["List of Accounts", "Danh sách tài khoản", "បញ្ជីគណនី", "账户列表", "p"],
    ["Balance", "Số dư", "សមតុល្យ", "余额", "p"],
    ["Exchanged", "Đã quy đổi", "ប្តូរប្រាក់", "已兑换"],
    ["Default", "Mặc định", "លំនាំដើម", "默认"],
    ["Add", "Thêm", "បន្ថែម", "添加"],
    ["Detail Account", "Chi tiết tài khoản", "ព័ត៌មានគណនី", "账户详情"],
    ["Recent transaction", "Giao dịch gần đây", "ប្រតិបត្តិការថ្មីៗ", "最近交易"],
    ["See more", "Xem thêm", "មើលបន្ថែម", "查看更多"],
    ["Export Statement", "Xuất sao kê", "ទាញយករបាយការណ៍", "导出对账单"],
    ["Sample transactions", "Giao dịch mẫu", "ប្រតិបត្តិការគំរូ", "示例交易", "s"],
    ["Transaction details", "Chi tiết giao dịch", "ព័ត៌មានប្រតិបត្តិការ", "交易详情"],
    ["AMOUNT", "SỐ TIỀN", "ចំនួនទឹកប្រាក់", "金额"],
    ["Amount", "Số tiền", "ចំនួនទឹកប្រាក់", "金额", "p"],
    ["From", "Từ", "ពី", "从", "p"],
    ["To", "Đến", "ទៅ", "到", "p"],
    ["Status", "Trạng thái", "ស្ថានភាព", "状态"],
    ["Success", "Thành công", "ជោគជ័យ", "成功"],
    ["Pending", "Đang xử lý", "កំពុងរង់ចាំ", "处理中"],
    ["Transfer amount", "Số tiền chuyển", "ចំនួនទឹកប្រាក់ផ្ទេរ", "转账金额"],
    ["Transaction time", "Thời gian giao dịch", "ពេលវេលាប្រតិបត្តិការ", "交易时间", "p"],
    ["Transaction code", "Mã giao dịch", "លេខកូដប្រតិបត្តិការ", "交易代码", "p"],
    ["External Txn Ref", "Mã tham chiếu ngoài", "ឯកសារយោងខាងក្រៅ", "外部交易参考号", "p"],
    ["Description", "Nội dung", "ការពិពណ៌នា", "描述", "p"],
    ["Share", "Chia sẻ", "ចែករំលែក", "分享"],
    ["Latest transactions", "Giao dịch mới nhất", "ប្រតិបត្តិការថ្មីៗ", "最新交易"],
    ["No transaction records yet.", "Chưa có bản ghi giao dịch.", "មិនទាន់មានកំណត់ត្រាប្រតិបត្តិការនៅឡើយទេ។", "暂无交易记录。"],
    ["Loading transactions...", "Đang tải giao dịch...", "កំពុងផ្ទុកប្រតិបត្តិការ...", "正在加载交易..."],
    ["GENERAL", "CHUNG", "ទូទៅ", "常规"],
    ["TRANSACTION", "GIAO DỊCH", "ប្រតិបត្តិការ", "交易"],
    ["Checking account", "Tài khoản thanh toán", "គណនីទូទាត់", "活期账户", "p"],
    ["Receiver bank", "Ngân hàng nhận", "ធនាគារទទួល", "收款银行", "p"],
    ["Merchant ID", "Mã cửa hàng", "លេខកូដហាង", "商户ID", "p"],
    ["Payment", "Thanh toán", "ការទូទាត់", "支付"],
    ["Recipient account", "Tài khoản người nhận", "គណនីអ្នកទទួល", "收款账户", "p"],
    ["Account", "Tài khoản", "គណនី", "账户", "s"],
    ["Cancel", "Hủy", "បោះបង់", "取消"],
    ["Confirm", "Xác nhận", "បញ្ជាក់", "确认"],
    ["Set amount", "Nhập số tiền", "កំណត់ចំនួនទឹកប្រាក់", "设置金额"],
    ["Generating…", "Đang tạo…", "កំពុងបង្កើត…", "正在生成…"],
    ["Scan QR", "Quét mã QR", "ស្កេន QR", "扫描二维码"],
    ["SELECT RECEIVING ACCOUNT:", "CHỌN TÀI KHOẢN NHẬN:", "ជ្រើសរើសគណនីទទួល:", "选择收款账户："],
    ["Open Bakong to pay", "Mở Bakong để thanh toán", "បើក Bakong ដើម្បីទូទាត់", "打开 Bakong 支付"],
    ["Transaction ID", "Mã giao dịch", "លេខសម្គាល់ប្រតិបត្តិការ", "交易ID"],
    ["Try again", "Thử lại", "ព្យាយាមម្តងទៀត", "重试"],
    ["Identification Documents", "Giấy tờ tùy thân", "ឯកសារអត្តសញ្ញាណ", "身份证件"],
    ["Utilities", "Tiện ích", "ឧបករណ៍ប្រើប្រាស់", "实用工具"],
    ["FaceID Auto Login", "Đăng nhập tự động FaceID", "ចូលដោយស្វ័យប្រវត្តិ FaceID", "FaceID 自动登录"],
    ["In-house Transfer Via Phone Number", "Chuyển nội bộ qua số điện thoại", "ផ្ទេរក្នុងធនាគារតាមលេខទូរស័ព្ទ", "通过手机号行内转账"],
    ["Digital OTP", "OTP điện tử", "OTP ឌីជីថល", "数字OTP"],
    ["Face Authentication Limit", "Giới hạn xác thực khuôn mặt", "ដែនកំណត់ផ្ទៀងផ្ទាត់ផ្ទៃមុខ", "面部识别限额"],
    ["Easy Payment", "Thanh toán nhanh", "ការទូទាត់ងាយស្រួល", "快捷支付"],
    ["Unlink Devices", "Hủy liên kết thiết bị", "ផ្តាច់ឧបករណ៍", "解除设备关联"],
    ["Change Password", "Đổi mật khẩu", "ប្តូរពាក្យសម្ងាត់", "修改密码"],
    ["Change Language", "Đổi ngôn ngữ", "ប្តូរភាសា", "切换语言"],
    ["Push Notification", "Thông báo đẩy", "ការជូនដំណឹងផ្គូផ្គង", "推送通知"],
    ["Contact Us", "Liên hệ chúng tôi", "ទំនាក់ទំនងយើង", "联系我们"],
    ["Partial", "Một phần", "មួយផ្នែក", "部分"],
    ["Verify Online", "Xác minh trực tuyến", "ផ្ទៀងផ្ទាត់តាមអ៊ីនធឺណិត", "在线验证"],
    ["Choose language", "Chọn ngôn ngữ", "ជ្រើសរើសភាសា", "选择语言"],
    ["Select your preferred language", "Chọn ngôn ngữ bạn muốn", "ជ្រើសរើសភាសាដែលអ្នកចូលចិត្ត", "选择您偏好的语言"],
    ["Done", "Xong", "រួចរាល់", "完成"],
    ["Security Alert: New Device Login", "Cảnh báo bảo mật: Đăng nhập thiết bị mới", "ការជូនដំណឹងសុវត្ថិភាព: ចូលឧបករណ៍ថ្មី", "安全提醒：新设备登录"],
    ["New", "Mới", "ថ្មី", "新"],
    ["✦ New", "✦ Mới", "✦ ថ្មី", "✦ 新"],
    ["Send to", "Gửi đến", "ផ្ញើទៅ", "发送给", "s"],
    ["Received from", "Nhận từ", "បានទទួលពី", "来自", "s"],
    ["KHQR payment to", "Thanh toán KHQR đến", "ទូទាត់ KHQR ទៅ", "KHQR 支付至", "s"],
    ["Payment to", "Thanh toán đến", "ទូទាត់ទៅ", "支付至", "s"],
    ["Transfer to", "Chuyển đến", "ផ្ទេរទៅ", "转账至", "s"],
    ["Top-up", "Nạp tiền", "បញ្ចូលទឹកប្រាក់", "充值", "s"],
    ["Add account", "Thêm tài khoản", "បន្ថែមគណនី", "添加账户"],
    ["Account added", "Đã thêm tài khoản", "បានបន្ថែមគណនី", "已添加账户"],
    ["Transactions refreshed", "Đã làm mới giao dịch", "បានធ្វើឱ្យប្រតិបត្តិការថ្មី", "交易已刷新"],
    ["Copy account number", "Sao chép số tài khoản", "ចម្លងលេខគណនី", "复制账号"],
    ["Reference copied", "Đã sao chép mã tham chiếu", "បានចម្លងលេខយោង", "已复制参考号", "p"],
    ["Referral link copied", "Đã sao chép liên kết giới thiệu", "បានចម្លងតំណណែនាំ", "已复制推荐链接"],
    ["Full statement is a demo feature", "Sao kê đầy đủ là tính năng demo", "របាយការណ៍ពេញលេញជាមុខងារសាកល្បង", "完整对账单为演示功能"],
    ["Statement export is a demo feature", "Xuất sao kê là tính năng demo", "ការទាញយករបាយការណ៍ជាមុខងារសាកល្បង", "对账单导出为演示功能"],
    ["Online verification is a demo feature", "Xác minh trực tuyến là tính năng demo", "ការផ្ទៀងផ្ទាត់តាមអ៊ីនធឺណិតជាមុខងារសាកល្បង", "在线验证为演示功能"],

    /* ---------- Home (React bundle) labels ---------- */
    ["Account overview", "Tổng quan tài khoản", "ទិដ្ឋភាពទូទៅគណនី", "账户概览"],
    ["Refresh information", "Làm mới thông tin", "ធ្វើឱ្យព័ត៌មានថ្មី", "刷新信息"],
    ["MB Cambodia promotions", "Khuyến mãi MB Cambodia", "ការផ្តល់ជូនពិសេស MB Cambodia", "MB Cambodia 优惠"],
    ["Select promotion", "Chọn ưu đãi", "ជ្រើសរើសការផ្តល់ជូន", "选择优惠"],
    ["Show promotion", "Hiển thị ưu đãi", "បង្ហាញការផ្តល់ជូន", "显示优惠", "s"],
    ["View promotion", "Xem ưu đãi", "មើលការផ្តល់ជូន", "查看优惠", "p"],
    ["Open scanner", "Mở trình quét", "បើកម៉ាស៊ីនស្កេន", "打开扫一扫"],
    ["Main navigation", "Điều hướng chính", "ការរុករកសំខាន់", "主导航"],
    ["Choose demo account", "Chọn tài khoản demo", "ជ្រើសរើសគណនីគំរូ", "选择演示账户"],
    ["You have no new notifications.", "Bạn hiện không có thông báo mới.", "អ្នកមិនមានការជូនដំណឹងថ្មីទេ។", "您没有新通知。"],
    ["You are viewing popular features in the demo.", "Bạn đang xem các tính năng phổ biến trong bản demo.", "អ្នកកំពុងមើលមុខងារពេញនិយមក្នុងកំណែសាកល្បង។", "您正在查看演示中的常用功能。"],
    ["This scan feature is only a preview.", "Chức năng quét này chỉ là bản xem trước.", "មុខងារស្កេននេះគ្រាន់តែជាការមើលជាមុនប៉ុណ្ណោះ។", "此扫描功能仅为预览。"],
    ["Demo app settings.", "Cài đặt minh họa của ứng dụng.", "ការកំណត់កម្មវិធីសាកល្បង។", "应用演示设置。"],
    ["Thank you for exploring MB Cambodia.", "Cảm ơn bạn đã khám phá MB Cambodia.", "សូមអរគុណដែលបានស្វែងយល់អំពី MB Cambodia។", "感谢您探索 MB Cambodia。"],
    ["Demo transactions will be shown here.", "Giao dịch minh họa sẽ được hiển thị tại đây.", "ប្រតិបត្តិការសាកល្បងនឹងបង្ហាញនៅទីនេះ។", "演示交易将显示在此处。"],
    ["The information in the image is for illustration only.", "Thông tin trong hình chỉ mang tính minh họa.", "ព័ត៌មានក្នុងរូបភាពគ្រាន់តែជាការបង្ហាញប៉ុណ្ណោះ។", "图片中的信息仅供参考。"],
    ["Demo account information has been updated.", "Thông tin tài khoản demo đã được cập nhật.", "ព័ត៌មានគណនីសាកល្បងត្រូវបានធ្វើបច្ចុប្បន្នភាព។", "演示账户信息已更新。"],
    ["Additional accounts are only available in the real app.", "Tài khoản bổ sung chỉ có trong ứng dụng thật.", "គណនីបន្ថែមមានតែនៅក្នុងកម្មវិធីពិតប៉ុណ្ណោះ។", "附加账户仅在真实应用中可用。"],
    ["This feature is only a preview and does not perform transactions.", "Tính năng này chỉ là bản xem trước, không thực hiện giao dịch.", "មុខងារនេះគ្រាន់តែជាការមើលជាមុន ហើយមិនធ្វើប្រតិបត្តិការទេ។", "此功能仅为预览，不执行交易。"],
    ["All features", "Tất cả tính năng", "មុខងារទាំងអស់", "全部功能"],
    ["This is a demo. The QR scan feature is not connected.", "Đây là bản demo. Tính năng quét mã chưa được kết nối.", "នេះជាកំណែសាកល្បង។ មុខងារស្កេនកូដ QR មិនទាន់បានភ្ជាប់ទេ។", "这是演示。二维码扫描功能尚未连接。"],
    ["Refreshed", "Đã làm mới", "បានធ្វើឱ្យថ្មី", "已刷新"],
    ["MB Cambodia offers", "Ưu đãi MB Cambodia", "ការផ្តល់ជូន MB Cambodia", "MB Cambodia 优惠"],
    ["MB Cambodia international transfer offers", "Ưu đãi chuyển tiền quốc tế MB Cambodia", "ការផ្តល់ជូនផ្ទេរប្រាក់អន្តរជាតិ MB Cambodia", "MB Cambodia 国际转账优惠"],
    ["MB Cambodia savings offers", "Ưu đãi tiết kiệm MB Cambodia", "ការផ្តល់ជូនសន្សំ MB Cambodia", "MB Cambodia 储蓄优惠"],

    /* ---------- Settings / language sheet ---------- */
    ["Preferences", "Tùy chọn", "ចំណូលចិត្ត", "偏好设置"],
    ["Close language selection", "Đóng chọn ngôn ngữ", "បិទការជ្រើសរើសភាសា", "关闭语言选择"],
    ["Available languages", "Ngôn ngữ có sẵn", "ភាសាដែលមាន", "可用语言"],
    ["Close", "Đóng", "បិទ", "关闭"],
    ["Back", "Quay lại", "ត្រឡប់ក្រោយ", "返回"],
    ["Go back", "Quay lại", "ត្រឡប់ក្រោយ", "返回"],
    ["Language changed", "Đã đổi ngôn ngữ", "បានប្តូរភាសា", "语言已更改"],
    ["This is a demo setting.", "Đây là cài đặt minh họa.", "នេះជាការកំណត់សាកល្បង។", "这是演示设置。"],

    /* ---------- Accounts ---------- */
    ["Today", "Hôm nay", "ថ្ងៃនេះ", "今天"],
    ["Currency", "Tiền tệ", "រូបិយប័ណ្ណ", "币种"],
    ["Savings", "Tiết kiệm", "សន្សំ", "储蓄"],
    ["New Account", "Tài khoản mới", "គណនីថ្មី", "新账户"],
    ["Add Account", "Thêm tài khoản", "បន្ថែមគណនី", "添加账户"],
    ["Initial balance", "Số dư ban đầu", "សមតុល្យដំបូង", "初始余额"],
    ["Account holder", "Chủ tài khoản", "ម្ចាស់គណនី", "账户持有人"],
    ["Account type", "Loại tài khoản", "ប្រភេទគណនី", "账户类型"],
    ["Not available", "Không có", "មិនមាន", "暂无"],
    ["No description", "Không có mô tả", "គ្មានការពិពណ៌នា", "无描述"],
    ["Recent Transaction", "Giao dịch gần đây", "ប្រតិបត្តិការថ្មីៗ", "最近交易"],
    ["No transactions yet", "Chưa có giao dịch", "មិនទាន់មានប្រតិបត្តិការនៅឡើយទេ", "还没有交易"],
    ["Refresh transactions", "Làm mới giao dịch", "ធ្វើឱ្យប្រតិបត្តិការថ្មី", "刷新交易"],
    ["Back to transactions", "Quay lại giao dịch", "ត្រឡប់ទៅប្រតិបត្តិការ", "返回交易"],
    ["Back to home", "Quay lại trang chủ", "ត្រឡប់ទៅទំព័រដើម", "返回首页"],
    ["Transaction parties", "Các bên giao dịch", "ភាគីប្រតិបត្តិការ", "交易双方"],
    ["Transaction record", "Bản ghi giao dịch", "កំណត់ត្រាប្រតិបត្តិការ", "交易记录"],
    ["Copy external transaction reference", "Sao chép mã tham chiếu giao dịch ngoài", "ចម្លងឯកសារយោងប្រតិបត្តិការខាងក្រៅ", "复制外部交易参考号"],
    ["Notification type", "Loại thông báo", "ប្រភេទការជូនដំណឹង", "通知类型"],

    /* ---------- Scan / payment flow ---------- */
    ["Scan to Pay", "Quét để thanh toán", "ស្កេនដើម្បីទូទាត់", "扫码支付"],
    ["Image ready to scan", "Hình ảnh sẵn sàng để quét", "រូបភាពរួចរាល់សម្រាប់ស្កេន", "图片已准备好扫描"],
    ["Align frame with QR code", "Căn khung với mã QR", "តម្រឹមស៊ុមជាមួយកូដ QR", "将取景框对准二维码"],
    ["Gallery", "Thư viện", "វិចិត្រសាល", "相册"],
    ["Sample QR", "QR mẫu", "QR គំរូ", "示例二维码"],
    ["My QR Code", "Mã QR của tôi", "កូដ QR របស់ខ្ញុំ", "我的二维码"],
    ["My KHR QR", "Mã QR KHR của tôi", "កូដ QR KHR របស់ខ្ញុំ", "我的 KHR 二维码"],
    ["My KHQR code", "Mã KHQR của tôi", "កូដ KHQR របស់ខ្ញុំ", "我的 KHQR 码"],
    ["Support payment:", "Thanh toán hỗ trợ:", "ការទូទាត់គាំទ្រ:", "支持支付："],
    ["TO / RECIPIENT", "ĐẾN / NGƯỜI NHẬN", "ទៅ / អ្នកទទួល", "收款人"],
    ["PAY FROM", "THANH TOÁN TỪ", "ទូទាត់ពី", "付款账户"],
    ["Change account", "Đổi tài khoản", "ប្តូរគណនី", "更换账户"],
    ["Choose an account", "Chọn tài khoản", "ជ្រើសរើសគណនី", "选择账户"],
    ["Choose account", "Chọn tài khoản", "ជ្រើសរើសគណនី", "选择账户"],
    ["Use either your USD or KHR account.", "Dùng tài khoản USD hoặc KHR của bạn.", "ប្រើគណនី USD ឬ KHR របស់អ្នក។", "使用您的 USD 或 KHR 账户。"],
    ["Transaction confirmation", "Xác nhận giao dịch", "ការបញ្ជាក់ប្រតិបត្តិការ", "交易确认"],
    ["TRANSFER AMOUNT", "SỐ TIỀN CHUYỂN", "ចំនួនទឹកប្រាក់ផ្ទេរ", "转账金额"],
    ["Merchant", "Cửa hàng", "ពាណិជ្ជករ", "商户"],
    ["Transaction fee", "Phí giao dịch", "ថ្លៃប្រតិបត្តិការ", "交易手续费"],
    ["Debit amount", "Số tiền ghi nợ", "ចំនួនទឹកប្រាក់ដក", "扣款金额"],
    ["Enter your PIN Digital OTP", "Nhập PIN Digital OTP", "បញ្ចូល PIN Digital OTP", "输入 PIN 数字 OTP"],
    ["Forgot PIN Digital OTP?", "Quên PIN Digital OTP?", "ភ្លេច PIN Digital OTP?", "忘记 PIN 数字 OTP？"],
    ["Transaction Completed Successfully", "Giao dịch hoàn tất thành công", "ប្រតិបត្តិការបានបញ្ចប់ដោយជោគជ័យ", "交易成功完成"],
    ["Bakong member bank", "Ngân hàng thành viên Bakong", "ធនាគារសមាជិក Bakong", "Bakong 成员银行"],
    ["Other Transaction", "Giao dịch khác", "ប្រតិបត្តិការផ្សេងទៀត", "其他交易"],
    ["Screenshot", "Ảnh chụp màn hình", "រូបភាពអេក្រង់", "截图"],
    ["Toggle flashlight", "Bật/tắt đèn flash", "បើក/បិទពន្លឺ", "开关闪光灯"],
    ["QR code scanner", "Trình quét mã QR", "ម៉ាស៊ីនស្កេនកូដ QR", "二维码扫描器"],
    ["QR code alignment frame", "Khung căn chỉnh mã QR", "ស៊ុមតម្រឹមកូដ QR", "二维码取景框"],
    ["Choose a QR code image", "Chọn ảnh mã QR", "ជ្រើសរើសរូបភាពកូដ QR", "选择二维码图片"],
    ["Test scan with demo Bakong KHQR", "Quét thử với KHQR Bakong demo", "សាកល្បងស្កេនជាមួយ KHQR Bakong គំរូ", "使用演示 Bakong KHQR 测试扫描"],
    ["KHQR and ATM MB Cambodia", "KHQR và ATM MB Cambodia", "KHQR និង ATM MB Cambodia", "KHQR 与 MB Cambodia ATM"],
    ["KHQR payment", "Thanh toán KHQR", "ការទូទាត់ KHQR", "KHQR 支付"],
    ["Back to scanner", "Quay lại trình quét", "ត្រឡប់ទៅម៉ាស៊ីនស្កេន", "返回扫描器"],
    ["Payment amount", "Số tiền thanh toán", "ចំនួនទឹកប្រាក់ទូទាត់", "支付金额"],
    ["Payment currency", "Tiền tệ thanh toán", "រូបិយប័ណ្ណទូទាត់", "支付币种"],
    ["Payment accounts", "Tài khoản thanh toán", "គណនីទូទាត់", "支付账户"],
    ["Close account selection", "Đóng chọn tài khoản", "បិទការជ្រើសរើសគណនី", "关闭账户选择"],
    ["Cancel Digital OTP", "Hủy Digital OTP", "បោះបង់ Digital OTP", "取消数字 OTP"],
    ["Digital OTP keypad", "Bàn phím Digital OTP", "ក្តារចុច Digital OTP", "数字 OTP 键盘"],
    ["Delete last digit", "Xóa chữ số cuối", "លុបខ្ទង់ចុងក្រោយ", "删除最后一位"],
    ["0 of 6 PIN digits entered", "Đã nhập 0/6 chữ số PIN", "បានបញ្ចូល 0/6 ខ្ទង់ PIN", "已输入 0/6 位 PIN"],
    ["Copy reference", "Sao chép mã tham chiếu", "ចម្លងលេខយោង", "复制参考号"],
    ["Download", "Tải xuống", "ទាញយក", "下载"],

    /* ---------- Referral ---------- */
    ["Refer Your", "Giới thiệu", "ណែនាំ", "推荐您的"],
    ["Friends", "Bạn bè", "មិត្តភក្តិ", "好友"],
    ["Good things are better when shared.", "Những điều tốt đẹp nên được chia sẻ.", "រឿងល្អៗគួរតែចែករំលែក។", "好东西要一起分享。"],
    ["Get a referral code and send it to your friends", "Nhận mã giới thiệu và gửi cho bạn bè", "ទទួលបានកូដណែនាំ ហើយផ្ញើទៅមិត្តភក្តិ", "获取推荐码并发送给好友"],
    ["Referral link", "Liên kết giới thiệu", "តំណណែនាំ", "推荐链接"],
    ["Referral code", "Mã giới thiệu", "កូដណែនាំ", "推荐码"],
    ["Scan QR code", "Quét mã QR", "ស្កេនកូដ QR", "扫描二维码"],
    ["Share referral link", "Chia sẻ liên kết giới thiệu", "ចែករំលែកតំណណែនាំ", "分享推荐链接"],
    ["Referral list", "Danh sách giới thiệu", "បញ្ជីណែនាំ", "推荐列表"],
    ["Share your code to invite a friend", "Chia sẻ mã của bạn để mời bạn bè", "ចែករំលែកកូដរបស់អ្នកដើម្បីអញ្ជើញមិត្តភក្តិ", "分享您的推荐码以邀请好友"],
    ["Your referral details", "Thông tin giới thiệu của bạn", "ព័ត៌មានណែនាំរបស់អ្នក", "您的推荐信息"],
    ["Copy referral link", "Sao chép liên kết giới thiệu", "ចម្លងតំណណែនាំ", "复制推荐链接"],
    ["Copy referral code", "Sao chép mã giới thiệu", "ចម្លងកូដណែនាំ", "复制推荐码"],
    ["Referral QR code", "Mã QR giới thiệu", "កូដ QR ណែនាំ", "推荐二维码"],

    /* ---------- Toasts and status messages ---------- */
    ["Processing…", "Đang xử lý…", "កំពុងដំណើរការ…", "处理中…"],
    ["Completing demo payment…", "Đang hoàn tất thanh toán demo…", "កំពុងបញ្ចប់ការទូទាត់សាកល្បង…", "正在完成演示支付…"],
    ["Waiting for payment…", "Đang chờ thanh toán…", "កំពុងរង់ចាំការទូទាត់…", "等待支付…"],
    ["Approve it in Bakong, then come back — this screen updates automatically.", "Phê duyệt trong Bakong, rồi quay lại — màn hình này sẽ tự cập nhật.", "អនុម័តក្នុង Bakong បន្ទាប់មកត្រឡប់មកវិញ — អេក្រង់នេះនឹងធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ។", "在 Bakong 中批准，然后返回——此屏幕会自动更新。"],
    ["Demo mode: completing the preview payment. No real funds are moved.", "Chế độ demo: hoàn tất thanh toán xem trước. Không có tiền thật bị chuyển.", "របៀបសាកល្បង៖ បញ្ចប់ការទូទាត់ជាមុន។ គ្មានប្រាក់ពិតត្រូវបានផ្ទេរទេ។", "演示模式：完成预览支付。不会转移真实资金。"],
    ["Tap the button to approve it in Bakong. This screen only completes when Bakong confirms the transfer — never simulated.", "Nhấn nút để phê duyệt trong Bakong. Màn hình chỉ hoàn tất khi Bakong xác nhận chuyển khoản — không bao giờ mô phỏng.", "ចុចប៊ូតុងដើម្បីអនុម័តក្នុង Bakong។ អេក្រង់នេះបញ្ចប់តែនៅពេល Bakong បញ្ជាក់ការផ្ទេរ — មិនដែលក្លែងធ្វើទេ។", "点击按钮在 Bakong 中批准。只有 Bakong 确认转账后此屏幕才会完成——绝不模拟。"],
    ["Waiting for the transfer to arrive. Success is shown only after Bakong confirms it.", "Đang chờ chuyển khoản đến. Thành công chỉ hiển thị sau khi Bakong xác nhận.", "កំពុងរង់ចាំការផ្ទេរមកដល់។ ជោគជ័យបង្ហាញតែបន្ទាប់ពី Bakong បញ្ជាក់ប៉ុណ្ណោះ។", "等待转账到达。仅在 Bakong 确认后才显示成功。"],
    ["Bakong did not receive this payment before the QR expired. Nothing was charged.", "Bakong chưa nhận được thanh toán này trước khi mã QR hết hạn. Không có khoản phí nào.", "Bakong មិនបានទទួលការទូទាត់នេះមុនពេលកូដ QR ផុតកំណត់ទេ។ គ្មានការគិតថ្លៃទេ។", "二维码过期前 Bakong 未收到此付款。未收取任何费用。"],
    ["Static preview on GitHub Pages — no real Bakong call.", "Bản xem trước tĩnh trên GitHub Pages — không gọi Bakong thật.", "ការមើលជាមុនជាប់លាប់នៅលើ GitHub Pages — គ្មានការហៅ Bakong ពិតទេ។", "GitHub Pages 上的静态预览——不调用真实 Bakong。"],
    ["Payment service unavailable.", "Dịch vụ thanh toán không khả dụng.", "សេវាកម្មទូទាត់មិនអាចប្រើបានទេ។", "支付服务不可用。"],
    ["Enter all 6 digits to continue.", "Nhập đủ 6 chữ số để tiếp tục.", "បញ្ចូលលេខទាំង 6 ខ្ទង់ដើម្បីបន្ត។", "输入全部 6 位数字以继续。"],
    ["Contact MB Bank to reset your Digital OTP.", "Liên hệ MB Bank để đặt lại Digital OTP.", "ទាក់ទង MB Bank ដើម្បីកំណត់ Digital OTP ឡើងវិញ។", "联系 MB Bank 重置您的数字 OTP。"],
    ["Receipt copied to clipboard", "Đã sao chép biên lai", "បានចម្លងបង្កាន់ដៃ", "收据已复制到剪贴板"],
    ["Screenshot saved (demo)", "Đã lưu ảnh chụp màn hình (demo)", "បានរក្សាទុករូបភាពអេក្រង់ (សាកល្បង)", "截图已保存（演示）"],
    ["This QR code is not a supported payment code.", "Mã QR này không phải mã thanh toán được hỗ trợ.", "កូដ QR នេះមិនមែនជាកូដទូទាត់ដែលគាំទ្រទេ។", "此二维码不是受支持的支付码。"],
    ["Loading sample KHQR…", "Đang tải KHQR mẫu…", "កំពុងផ្ទុក KHQR គំរូ…", "正在加载示例 KHQR…"],
    ["Reading QR code…", "Đang đọc mã QR…", "កំពុងអានកូដ QR…", "正在读取二维码…"],
    ["No QR code found", "Không tìm thấy mã QR", "រកមិនឃើញកូដ QR", "未找到二维码"],
    ["No QR code found in that image. Try another one.", "Không tìm thấy mã QR trong ảnh đó. Hãy thử ảnh khác.", "រកមិនឃើញកូដ QR ក្នុងរូបភាពនោះទេ។ សូមសាកល្បងរូបផ្សេង។", "该图片中未找到二维码。请尝试其他图片。"],
    ["Image selected", "Đã chọn ảnh", "បានជ្រើសរើសរូបភាព", "已选择图片"],
    ["QR decoder failed to load.", "Không tải được bộ giải mã QR.", "មិនអាចផ្ទុកកម្មវិធីឌិកូដ QR បានទេ។", "二维码解码器加载失败。"],
    ["Camera unavailable — upload a QR image or click Sample QR.", "Camera không khả dụng — tải ảnh QR lên hoặc nhấn QR mẫu.", "កាមេរ៉ាមិនអាចប្រើបាន — ផ្ទុករូបភាព QR ឬចុច QR គំរូ។", "摄像头不可用——请上传二维码图片或点击示例二维码。"],
    ["Enter a valid amount.", "Nhập số tiền hợp lệ.", "បញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ។", "输入有效金额。"],
    ["Saved to your downloads", "Đã lưu vào mục tải xuống", "បានរក្សាទុកក្នុងការទាញយក", "已保存到下载"],
    ["Unable to prepare the image. Try again.", "Không thể chuẩn bị ảnh. Thử lại.", "មិនអាចរៀបចំរូបភាពបានទេ។ សូមព្យាយាមម្តងទៀត។", "无法准备图片。请重试。"],
    ["QR details copied", "Đã sao chép thông tin QR", "បានចម្លងព័ត៌មាន QR", "二维码信息已复制"],
    ["Unable to share on this device.", "Không thể chia sẻ trên thiết bị này.", "មិនអាចចែករំលែកនៅលើឧបករណ៍នេះបានទេ។", "无法在此设备上分享。"],
    ["Account number copied", "Đã sao chép số tài khoản", "បានចម្លងលេខគណនី", "账号已复制"],
    ["Copy failed", "Sao chép thất bại", "ការចម្លងបរាជ័យ", "复制失败"],
    ["Initial balance must be 0 or more.", "Số dư ban đầu phải từ 0 trở lên.", "សមតុល្យដំបូងត្រូវតែ 0 ឬច្រើនជាងនេះ។", "初始余额必须大于或等于 0。"],
    ["Account added (demo only)", "Đã thêm tài khoản (chỉ demo)", "បានបន្ថែមគណនី (សាកល្បងតែប៉ុណ្ណោះ)", "已添加账户（仅演示）"],
    ["Receipt shared", "Đã chia sẻ biên lai", "បានចែករំលែកបង្កាន់ដៃ", "收据已分享"],
    ["Unable to share receipt", "Không thể chia sẻ biên lai", "មិនអាចចែករំលែកបង្កាន់ដៃបានទេ។", "无法分享收据"],
    ["Share is not available in this browser", "Chia sẻ không khả dụng trong trình duyệt này", "ការចែករំលែកមិនអាចប្រើបាននៅក្នុងកម្មវិធីរុករកនេះទេ", "此浏览器不支持分享"],
    ["External reference copied", "Đã sao chép mã tham chiếu ngoài", "បានចម្លងឯកសារយោងខាងក្រៅ", "外部参考号已复制"],
    ["Unable to copy reference", "Không thể sao chép mã tham chiếu", "មិនអាចចម្លងឯកសារយោងបានទេ", "无法复制参考号"],
    ["Copy is not available in this browser", "Sao chép không khả dụng trong trình duyệt này", "ការចម្លងមិនអាចប្រើបាននៅក្នុងកម្មវិធីរុករកនេះទេ", "此浏览器不支持复制"],
    ["Copy is unavailable in this browser", "Sao chép không khả dụng trong trình duyệt này", "ការចម្លងមិនអាចប្រើបាននៅក្នុងកម្មវិធីរុករកនេះទេ", "此浏览器不支持复制"],

    /* ---------- Standalone pages ---------- */
    ["Internal transfer", "Chuyển tiền nội bộ", "ផ្ទេរប្រាក់ផ្ទៃក្នុង", "内部转账"],
    ["International Transfer", "Chuyển tiền quốc tế", "ផ្ទេរប្រាក់អន្តរជាតិ", "国际转账"],
    ["Cash to ATM", "Rút tiền tại ATM", "សាច់ប្រាក់តាម ATM", "ATM 取现"],
    ["Withdrawal History", "Lịch sử rút tiền", "ប្រវត្តិនៃការដកប្រាក់", "取现记录"],
    ["Select account", "Chọn tài khoản", "ជ្រើសរើសគណនី", "选择账户"],
    ["Generating code for Cash Withdrawals at Any MBCambodia ATM/CRM.", "Đang tạo mã rút tiền mặt tại mọi ATM/CRM MBCambodia.", "កំពុងបង្កើតកូដសម្រាប់ការដកសាច់ប្រាក់នៅ ATM/CRM MBCambodia ណាមួយ។", "为任意 MBCambodia ATM/CRM 生成现金取款码。"],
    ["The Withdrawal history only shows codes from the past 7 days.", "Lịch sử rút tiền chỉ hiển thị mã trong 7 ngày qua.", "ប្រវត្តិនៃការដកប្រាក់បង្ហាញតែកូដក្នុងរយៈពេល 7 ថ្ងៃចុងក្រោយប៉ុណ្ណោះ។", "取现记录仅显示过去 7 天的代码。"],
    ["Transfer between your accounts", "Chuyển tiền giữa các tài khoản của bạn", "ផ្ទេរប្រាក់រវាងគណនីរបស់អ្នក", "在您的账户之间转账"],
    ["Same-currency only. This moves money inside the prototype ledger - it never touches Bakong or a real account.", "Chỉ cùng loại tiền. Thao tác này chuyển tiền trong sổ cái nguyên mẫu - không bao giờ chạm vào Bakong hay tài khoản thật.", "តែរូបិយប័ណ្ណដូចគ្នា។ វាផ្ទេរប្រាក់ក្នុងសៀវភៅគំរូ - មិនប៉ះពាល់ Bakong ឬគណនីពិតទេ។", "仅限同币种。此操作仅在原型账本内转移资金——不会触及 Bakong 或真实账户。"],
    ["Note (optional)", "Ghi chú (tùy chọn)", "កំណត់ចំណាំ (ជាជម្រើស)", "备注（可选）"],
    ["Transfer", "Chuyển tiền", "ផ្ទេរ", "转账"],
    ["Recent transfers", "Chuyển khoản gần đây", "ការផ្ទេរថ្មីៗ", "最近转账"],
    ["No transfers yet.", "Chưa có chuyển khoản nào.", "មិនទាន់មានការផ្ទេរនៅឡើយទេ។", "还没有转账。"],
    ["Transfer completed", "Chuyển khoản hoàn tất", "ការផ្ទេរបានបញ្ចប់", "转账完成"],
    ["Reference", "Mã tham chiếu", "ឯកសារយោង", "参考号"],
    ["Time", "Thời gian", "ពេលវេលា", "时间"],
    ["Loading accounts.", "Đang tải tài khoản.", "កំពុងផ្ទុកគណនី។", "正在加载账户。"],
    ["Remittance To Vietnam", "Chuyển tiền đến Việt Nam", "ការផ្ទេរប្រាក់ទៅវៀតណាម", "汇款至越南"],
    ["Open Fixed Deposit", "Mở tiền gửi kỳ hạn", "បើកប្រាក់បញ្ញើមានកាលកំណត់", "开立定期存款"],
    ["Open Real-time Deposit", "Mở tiền gửi linh hoạt", "បើកប្រាក់បញ្ញើភ្លាមៗ", "开立活期存款"],
    ["Query Savings", "Tra cứu tiết kiệm", "សាកសួរសន្សំ", "查询储蓄"],
    ["Hot", "Hot", "ពេញនិយម", "热门"],
    ["Savings & Invest", "Tiết kiệm & Đầu tư", "សន្សំ និងវិនិយោគ", "储蓄与投资"]
  ];

  var exact = {};
  var prefixes = [];

  function buildIndex() {
    DICT.forEach(function (entry) {
      LANGS.forEach(function (lang, i) {
        var value = entry[i];
        if (!value) return;
        if (!exact[value]) exact[value] = entry;
      });
      if (entry[4]) prefixes.push(entry);
    });
    prefixes.sort(function (a, b) {
      return Math.max(b[0].length, b[1].length, b[2].length, b[3].length) - Math.max(a[0].length, a[1].length, a[2].length, a[3].length);
    });
  }
  buildIndex();

  function targetOf(entry, lang) {
    if (lang === "en") return entry[0];
    if (lang === "vi") return entry[1];
    if (lang === "km") return entry[2];
    return entry[3];
  }

  function boundaryOk(rest, mode) {
    if (!rest) return false;
    var first = rest.charAt(0);
    if (first === ":" || first === "(" || first === "·") return true;
    if (mode !== "s" || first !== " ") return false;
    return Boolean(rest.trim());
  }

  function translateText(text, lang) {
    if (!text) return null;
    var lead = text.match(/^\s*/)[0];
    var trail = text.match(/\s*$/)[0];
    var core = text.slice(lead.length, text.length - trail.length);
    if (!core) return null;

    var entry = exact[core];
    if (entry) {
      var direct = targetOf(entry, lang);
      return direct && direct !== core ? lead + direct + trail : null;
    }

    for (var i = 0; i < prefixes.length; i++) {
      var item = prefixes[i];
      var mode = item[4];
      for (var j = 0; j < LANGS.length; j++) {
        var source = item[j];
        if (!source || core.indexOf(source) !== 0) continue;
        if (lang === LANGS[j]) continue;
        if (!boundaryOk(core.slice(source.length), mode)) continue;
        var target = targetOf(item, lang);
        if (!target) continue;
        return lead + target + core.slice(source.length) + trail;
      }
    }
    return null;
  }

  var textState = typeof WeakMap === "function" ? new WeakMap() : null;
  var attrState = typeof WeakMap === "function" ? new WeakMap() : null;
  var currentLang = "";
  var timer = 0;
  var applying = false;

  function stateFor(store, key) {
    if (!store) return null;
    var st = store.get(key);
    if (!st) {
      st = {};
      store.set(key, st);
    }
    return st;
  }

  function translateNode(node, lang) {
    var all = stateFor(textState, node);
    if (!all) return;
    var cur = node.nodeValue;
    var rec = all.__text;
    if (!rec || cur !== rec.out) {
      rec = { orig: cur, out: cur };
      all.__text = rec;
    }
    var next = translateText(rec.orig, lang);
    if (!next) next = rec.orig;
    if (next !== node.nodeValue) node.nodeValue = next;
    rec.out = node.nodeValue;
  }

  function translateAttr(el, attr, lang) {
    var all = stateFor(attrState, el);
    if (!all) return;
    var map = all.attrs;
    if (!map) {
      map = {};
      all.attrs = map;
    }
    var cur = el.getAttribute(attr);
    var rec = map[attr];
    if (!rec || cur !== rec.out) {
      rec = { orig: cur, out: cur };
      map[attr] = rec;
    }
    var next = translateText(rec.orig, lang);
    if (!next) next = rec.orig;
    if (next !== null && next !== cur) el.setAttribute(attr, next);
    rec.out = el.getAttribute(attr);
  }

  function translateAttributes(el, lang) {
    ["placeholder", "aria-label", "title", "alt"].forEach(function (attr) {
      if (!el.hasAttribute || !el.hasAttribute(attr)) return;
      translateAttr(el, attr, lang);
    });
  }

  function walk(root, lang) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateNode(root, lang);
      return;
    }
    if (root.nodeType === 1) {
      var tag = root.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return;
      translateAttributes(root, lang);
      var children = root.childNodes;
      for (var i = 0; i < children.length; i++) walk(children[i], lang);
    }
  }

  function apply(lang, persist) {
    if (LANGS.indexOf(lang) === -1) return;
    currentLang = lang;
    if (persist !== false) {
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    }
    document.documentElement.setAttribute("lang", lang);
    if (timer) window.clearTimeout(timer);
    applying = true;
    walk(document.body, lang);
    window.setTimeout(function () { applying = false; }, 0);
    document.dispatchEvent(new CustomEvent("mb:language-changed", { detail: { lang: lang } }));
  }

  function detectLang() {
    var stored = "";
    try { stored = localStorage.getItem(STORE_KEY) || ""; } catch (e) {}
    if (LANGS.indexOf(stored) !== -1) return { lang: stored, persist: false };
    var nav = "";
    try { nav = String((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase(); } catch (e) {}
    if (nav.indexOf("km") === 0) return { lang: "km", persist: true };
    if (nav.indexOf("vi") === 0) return { lang: "vi", persist: true };
    if (nav.indexOf("zh") === 0) return { lang: "zh", persist: true };
    return { lang: "en", persist: true };
  }

  function init() {
    var observer = new MutationObserver(function (records) {
      if (applying) return;
      var lang = currentLang;
      if (!lang) return;
      records.forEach(function (record) {
        if (record.type === "characterData") {
          translateNode(record.target, lang);
        } else if (record.type === "childList") {
          for (var i = 0; i < record.addedNodes.length; i++) walk(record.addedNodes[i], lang);
        } else if (record.type === "attributes") {
          translateAttr(record.target, record.attributeName, lang);
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title", "alt"]
    });
    var detected = detectLang();
    apply(detected.lang, detected.persist);
  }

  window.mbI18n = {
    apply: function (lang) { apply(lang, true); },
    get: function () { return currentLang || "en"; },
    t: function (text) { return translateText(text, currentLang || "en") || text; },
    languages: LANGS
  };

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
