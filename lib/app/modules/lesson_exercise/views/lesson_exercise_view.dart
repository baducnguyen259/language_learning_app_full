import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_bottom_actions.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_load_state.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_progress_header.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/listening_exercise.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/matching_exercise.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/missing_word_exercise.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/pronunciation_exercise.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/pronunciation_result.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/sentence_exercise.dart';

class LessonExerciseView extends GetView<LessonExerciseController> {
  const LessonExerciseView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: SizedBox(width: double.infinity, child: Obx(_buildContent)),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    return switch (controller.loadStatus.value) {
      ExerciseLoadStatus.loading => const ExerciseLoadingState(),
      ExerciseLoadStatus.empty => ExerciseEmptyState(
        onRetry: controller.loadExercises,
      ),
      ExerciseLoadStatus.error => ExerciseErrorState(
        message: controller.errorMessage.value,
        onRetry: controller.loadExercises,
      ),
      ExerciseLoadStatus.success => _buildExerciseContent(),
    };
  }

  Widget _buildExerciseContent() {
    final stage = controller.currentStage.value;

    return Column(
      children: [
        ExerciseProgressHeader(controller: controller),
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 220),
            child: KeyedSubtree(
              key: ValueKey(stage),
              child: _buildCurrentExercise(stage),
            ),
          ),
        ),
        if (stage != LessonExerciseController.pronunciationStage)
          ExerciseBottomActions(controller: controller, stage: stage),
      ],
    );
  }

  Widget _buildCurrentExercise(int stage) {
    return switch (stage) {
      LessonExerciseController.matchingStage => MatchingExercise(
        controller: controller,
      ),
      LessonExerciseController.sentenceStage => SentenceExercise(
        controller: controller,
      ),
      LessonExerciseController.missingWordStage => MissingWordExercise(
        controller: controller,
      ),
      LessonExerciseController.listeningStage => ListeningExercise(
        controller: controller,
      ),
      LessonExerciseController.pronunciationStage => PronunciationExercise(
        controller: controller,
      ),
      _ => PronunciationResult(controller: controller),
    };
  }
}
