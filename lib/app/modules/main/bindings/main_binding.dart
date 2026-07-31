import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/home/bindings/home_binding.dart';
import 'package:language_learning_app/app/modules/learning/bindings/learning_binding.dart';
import 'package:language_learning_app/app/modules/main/controllers/main_controller.dart';
import 'package:language_learning_app/app/modules/practice/bindings/practice_binding.dart';
import 'package:language_learning_app/app/modules/profile/bindings/profile_binding.dart';
import 'package:language_learning_app/app/modules/vocabulary/bindings/vocabulary_binding.dart';

class MainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MainController>(() => MainController());
    HomeBinding().dependencies();
    LearningBinding().dependencies();
    PracticeBinding().dependencies();
    VocabularyBinding().dependencies();
    ProfileBinding().dependencies();
  }
}
