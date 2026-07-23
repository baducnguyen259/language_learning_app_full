import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// Điểm mở rộng cho trạng thái và hành động đăng nhập.
///
/// Màn hình hiện chỉ là UI shell nên chưa có logic xác thực. Sau khi
/// `LoginBinding` chạy, lấy controller bằng:
/// ```dart
/// final controller = Get.find<LoginController>();
/// ```
class LoginController extends GetxController {
  final emailcontroller = TextEditingController();
  final passwordcontroller = TextEditingController();
  final googlecontroller = TextEditingController();
  final RxBool isSavePassword = RxBool(false);
}
