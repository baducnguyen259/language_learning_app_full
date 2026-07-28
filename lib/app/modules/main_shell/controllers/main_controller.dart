import 'package:get/get.dart';

class MainShellController extends GetxController {
  static const int tabCount = 5;

  final RxInt currentIndex = 0.obs;

  void changeTab(int index) {
    if (index < 0 || index >= tabCount) return;
    currentIndex.value = index;
  }
}
