import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/common/values/app_config.dart';
import 'package:language_learning_app/app/data/providers/google_auth_provider.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';

class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<Dio>(
      () => Dio(
        BaseOptions(
          baseUrl: AppConfig.apiBaseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
          headers: const <String, String>{
            'Content-Type': 'application/json',
          },
        ),
      ),
    );
    Get.lazyPut<AuthTokenStorage>(() => const AuthTokenStorage());
    Get.lazyPut<GoogleAuthProvider>(
      () => GoogleAuthProvider(
        dio: Get.find<Dio>(),
        googleSignIn: GoogleSignIn.instance,
      ),
    );
    Get.lazyPut<UserAuthService>(
      () => UserAuthService(
        googleAuthProvider: Get.find<GoogleAuthProvider>(),
        tokenStorage: Get.find<AuthTokenStorage>(),
      ),
    );
    Get.lazyPut<LoginController>(
      () => LoginController(Get.find<UserAuthService>()),
    );
  }
}
