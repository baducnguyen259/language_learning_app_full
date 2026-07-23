part of 'app_pages.dart';

/// Tên route công khai dùng cho điều hướng GetX.
///
/// Ví dụ:
/// ```dart
/// Get.toNamed<void>(Routes.LOGIN);
/// ```
abstract class Routes {
  Routes._();

  /// Mở UI shell đăng nhập và áp dụng binding của route.
  // ignore: constant_identifier_names
  static const String LOGIN = _Paths.login;
}

abstract class _Paths {
  _Paths._();

  static const String login = '/login';
}
