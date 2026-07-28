import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/learning_path/controllers/learning_path_controller.dart';

class LearningPathBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LearningPathController>(LearningPathController.new);
  }
}
