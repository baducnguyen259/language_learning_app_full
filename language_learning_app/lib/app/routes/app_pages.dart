import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/complete_profile/bindings/complete_profile_binding.dart';
import 'package:language_learning_app/app/modules/complete_profile/views/complete_profile_view.dart';
import 'package:language_learning_app/app/modules/forgot_password/bindings/forgot_password_binding.dart';
import 'package:language_learning_app/app/modules/forgot_password/views/forgot_password_view.dart';
import 'package:language_learning_app/app/modules/login/bindings/login_binding.dart';
import 'package:language_learning_app/app/modules/login/views/login_view.dart';
import 'package:language_learning_app/app/modules/home/bindings/home_binding.dart';
import 'package:language_learning_app/app/modules/home/views/home_view.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/bindings/lesson_exercise_binding.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/views/lesson_exercise_view.dart';
import 'package:language_learning_app/app/modules/main/bindings/main_binding.dart';
import 'package:language_learning_app/app/modules/main/views/main_view.dart';
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
      name: AppRoutes.completeProfile,
      page: () => const CompleteProfileView(),
      binding: CompleteProfileBinding(),
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
    GetPage(
      name: Routes.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: Routes.LESSON_EXERCISE,
      page: () => const LessonExerciseView(),
      binding: LessonExerciseBinding(),
    ),
    GetPage(
      name: AppRoutes.main,
      page: () => const MainView(),
      binding: MainBinding(),
    ),
  ];
}
