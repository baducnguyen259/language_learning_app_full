import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/login/bindings/login_binding.dart';
import 'package:language_learning_app/app/modules/login/view/login_view.dart';

part 'app_routes.dart';

/// Danh sách trang tập trung truyền vào `GetMaterialApp.getPages`.
///
/// Danh sách không thể bị chỉnh sửa. Điều hướng bằng hằng số trong [Routes]:
/// ```dart
/// Get.toNamed<void>(Routes.LOGIN);
/// ```
class AppPages {
  AppPages._();

  /// Bảng route bất biến của ứng dụng.
  static final List<GetPage<dynamic>> routes =
      List<GetPage<dynamic>>.unmodifiable(<GetPage<dynamic>>[
        GetPage<dynamic>(
          name: Routes.LOGIN,
          page: () => const LoginView(),
          binding: LoginBinding(),
        ),
      ]);
}
