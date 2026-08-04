import 'package:get/get.dart';

class LearningController extends GetxController {
  static const int filterCount = 3;

  final RxInt selectedFilterIndex = 0.obs;
  final RxDouble courseProgress = 0.35.obs;
  final RxDouble currentLessonProgress = 0.60.obs;

  void changeFilter(int index) {
    if (index < 0 || index >= filterCount) return;
    selectedFilterIndex.value = index;
  }
}
