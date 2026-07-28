import 'package:get/get.dart';

class HomeController extends GetxController {
  final RxInt learningStreak = 7.obs;
  final RxInt earnedExperience = 20.obs;
  final RxDouble lessonProgress = 0.60.obs;
  final RxInt dailyGoalMinutes = 15.obs;
  final RxInt completedMinutes = 15.obs;
}
