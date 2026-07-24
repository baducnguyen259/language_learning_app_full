part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const String LOGIN = _Paths.login;
  static const String REGISTER = _Paths.register;
}

abstract class _Paths {
  _Paths._();

  static const String login = '/login';
  static const String register = '/register';
}
