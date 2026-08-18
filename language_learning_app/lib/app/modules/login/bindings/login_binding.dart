import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/data/providers/google_auth_provider.dart';
import 'package:language_learning_app/app/data/providers/user_auth_provider.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';

class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<UserAuthProvider>(() => UserAuthProvider(Get.find<Dio>()));
    Get.lazyPut<GoogleAuthProvider>(
      () => GoogleAuthProvider(Get.find<Dio>(), GoogleSignIn.instance),
    );

    Get.lazyPut<UserAuthService>(
      () => UserAuthService(
        Get.find<UserAuthProvider>(),
        Get.find<GoogleAuthProvider>(),
        Get.find<AuthTokenStorage>(),
      ),
    );

    Get.lazyPut<LoginController>(
      () => LoginController(Get.find<UserAuthService>()),
    );
  }
}
