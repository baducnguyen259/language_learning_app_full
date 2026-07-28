import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/practice/controllers/practice_controller.dart';

class PracticeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PracticeController>(PracticeController.new);
  }
}
