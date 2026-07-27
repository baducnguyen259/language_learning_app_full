part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const String LOGIN = _Paths.login;
  static const String REGISTER = _Paths.register;
  static const String FORGOT_PASSWORD = _Paths.forgot_password;
  static const String RESET_PASSWORD = _Paths.reset_password;
}

abstract class _Paths {
  _Paths._();

  static const String login = '/login';
  static const String register = '/register';
  static const String forgot_password = '/forgot_pasword';
  static const String reset_password = '/reset_password';
}
