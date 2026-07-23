import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';

/// Khởi tạo trễ [LoginController] khi route đăng nhập hoạt động.
///
/// Gắn binding vào `GetPage`; không gọi [dependencies] thủ công:
/// ```dart
/// GetPage(
///   name: Routes.LOGIN,
///   page: () => const LoginView(),
///   binding: LoginBinding(),
/// );
/// ```
class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LoginController>(() => LoginController());
  }
}
