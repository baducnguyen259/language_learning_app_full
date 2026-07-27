import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/forgot_password/bindings/forgot_password_binding.dart';
import 'package:language_learning_app/app/modules/forgot_password/views/forgot_password_view.dart';
import 'package:language_learning_app/app/modules/login/bindings/login_binding.dart';
import 'package:language_learning_app/app/modules/login/views/login_view.dart';
import 'package:language_learning_app/app/modules/register/bindings/register_binding.dart';
import 'package:language_learning_app/app/modules/register/views/register_view.dart';
import 'package:language_learning_app/app/modules/reset_password/bindings/reset_password_binding.dart';
import 'package:language_learning_app/app/modules/reset_password/views/reset_password_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();
  static final routes = [
    GetPage(
      name: Routes.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: Routes.REGISTER,
      page: () => const RegisterView(),
      binding: RegisterBinding(),
    ),
    GetPage(
      name: Routes.FORGOT_PASSWORD,
      page: () => const ForgotPasswordView(),
      binding: ForgotPasswordBinding(),
    ),
    GetPage(
      name: Routes.RESET_PASSWORD,
      page: () => const ResetPasswordView(),
      binding: ResetPasswordBinding(),
    ),
  ];
}
