import 'package:get/get.dart';
import 'package:language_learning_app/app/data/services/user_profile_service.dart';
import 'package:language_learning_app/app/modules/complete_profile/controllers/complete_profile_controller.dart';

class CompleteProfileBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CompleteProfileController>(
      () => CompleteProfileController(Get.find<UserProfileService>()),
    );
  }
}
