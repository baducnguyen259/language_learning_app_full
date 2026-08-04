part of 'app_pages.dart';

abstract class AppRoutes {
  AppRoutes._();

  static const String main = '/main';
}

abstract class Routes {
  Routes._();
  static const String LOGIN = _Paths.login;
  static const String REGISTER = _Paths.register;
  static const String FORGOT_PASSWORD = _Paths.forgot_password;
  static const String RESET_PASSWORD = _Paths.reset_password;
  static const String HOME = _Paths.home;
  static const String LESSON_EXERCISE = _Paths.lesson_exercise;
}

abstract class _Paths {
  _Paths._();

  static const String login = '/login';
  static const String register = '/register';
  static const String forgot_password = '/forgot_password';
  static const String reset_password = '/reset_password';
  static const String home = '/home';
  static const String lesson_exercise = '/lesson_exercise';
}
