import 'package:get/get.dart';
import 'package:language_learning_app/app/common/controllers/material_app_controller.dart';

/// Đăng ký các dependency cần tồn tại trong toàn bộ vòng đời ứng dụng.
/// Chỉ gắn binding này một lần vào `GetMaterialApp.initialBinding`:
/// GetMaterialApp(initialBinding: GlobalBinding());

class GlobalBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<MaterialAppController>(MaterialAppController(), permanent: true);
  }
}
