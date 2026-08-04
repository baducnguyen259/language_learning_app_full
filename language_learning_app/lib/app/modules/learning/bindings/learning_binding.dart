import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';

class LearningBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LearningController>(() => LearningController());
  }
}
