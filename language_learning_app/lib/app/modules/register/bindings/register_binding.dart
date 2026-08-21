import 'package:get/get.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/modules/register/controllers/register_controller.dart';

class RegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<RegisterController>(
      () => RegisterController(Get.find<UserAuthService>()),
    );
  }
}
