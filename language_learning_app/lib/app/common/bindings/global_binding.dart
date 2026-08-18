// import 'package:get/get.dart';
// import 'package:language_learning_app/app/common/controllers/material_app_controller.dart';

// class GlobalBinding extends Bindings {
//   @override
//   void dependencies() {
//     Get.put<MaterialAppController>(MaterialAppController(), permanent: true);
//   }
// }

import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/controllers/material_app_controller.dart';
import 'package:language_learning_app/app/common/values/app_config.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';

class GlobalBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<MaterialAppController>(MaterialAppController(), permanent: true);
    Get.put<AuthTokenStorage>(const AuthTokenStorage(), permanent: true);
    Get.put<Dio>(
      Dio(
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
      ),
      permanent: true,
    );
  }
}
