import 'package:get/get.dart';
import 'package:language_learning_app/app/data/providers/lesson_exercise_provider.dart';
import 'package:language_learning_app/app/data/providers/mock_lesson_exercise_provider.dart';
import 'package:language_learning_app/app/data/services/lesson_exercise_service.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class LessonExerciseBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LessonExerciseProvider>(
      () => const MockLessonExerciseProvider(),
    );
    Get.lazyPut<LessonExerciseService>(
      () => LessonExerciseService(provider: Get.find<LessonExerciseProvider>()),
    );
    Get.lazyPut<LessonExerciseController>(
      () => LessonExerciseController(Get.find<LessonExerciseService>()),
    );
  }
}
