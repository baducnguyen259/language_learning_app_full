import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/vocabulary/controllers/vocabulary_controller.dart';

class VocabularyBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<VocabularyController>(VocabularyController.new);
  }
}
