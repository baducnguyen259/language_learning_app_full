import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/home/bindings/home_binding.dart';
import 'package:language_learning_app/app/modules/learning_path/bindings/learning_path_binding.dart';
import 'package:language_learning_app/app/modules/main_shell/controllers/main_controller.dart';
import 'package:language_learning_app/app/modules/practice/bindings/practice_binding.dart';
import 'package:language_learning_app/app/modules/profile/bindings/profile_binding.dart';
import 'package:language_learning_app/app/modules/vocabulary/bindings/vocabulary_binding.dart';

class MainShellBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MainShellController>(MainShellController.new);
    HomeBinding().dependencies();
    LearningPathBinding().dependencies();
    PracticeBinding().dependencies();
    VocabularyBinding().dependencies();
    ProfileBinding().dependencies();
  }
}
