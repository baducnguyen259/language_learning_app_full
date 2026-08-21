import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/common/controllers/material_app_controller.dart';
import 'package:language_learning_app/app/common/values/app_config.dart';
import 'package:language_learning_app/app/data/interceptors/auth_interceptor.dart';
import 'package:language_learning_app/app/data/providers/google_auth_provider.dart';
import 'package:language_learning_app/app/data/providers/user_auth_provider.dart';
import 'package:language_learning_app/app/data/providers/user_profile_provider.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/data/services/user_profile_service.dart';

class GlobalBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<MaterialAppController>(MaterialAppController(), permanent: true);

    const tokenStorage = AuthTokenStorage();

    final dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 15),
        headers: const <String, String>{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(AuthInterceptor(dio, tokenStorage));

    final googleAuthProvider = GoogleAuthProvider(dio, GoogleSignIn.instance);

    final userAuthProvider = UserAuthProvider(dio);
    final userProfileProvider = UserProfileProvider(dio);

    final userAuthService = UserAuthService(
      userAuthProvider,
      googleAuthProvider,
      tokenStorage,
    );
    final userProfileService = UserProfileService(userProfileProvider);

    Get.put<AuthTokenStorage>(tokenStorage, permanent: true);

    Get.put<Dio>(dio, permanent: true);

    Get.put<UserAuthProvider>(userAuthProvider, permanent: true);

    Get.put<UserProfileProvider>(userProfileProvider, permanent: true);

    Get.put<GoogleAuthProvider>(googleAuthProvider, permanent: true);

    Get.put<UserAuthService>(userAuthService, permanent: true);

    Get.put<UserProfileService>(userProfileService, permanent: true);
  }
}
