import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/data/providers/lesson_exercise_provider.dart';

final class LessonExerciseService {
  const LessonExerciseService({required this.provider});

  final LessonExerciseProvider provider;

  Future<List<ExerciseQuestionModel>> fetchQuestions({
    required String lessonId,
  }) async {
    final normalizedLessonId = lessonId.trim();
    if (normalizedLessonId.isEmpty) {
      throw ArgumentError.value(
        lessonId,
        'lessonId',
        'Lesson ID must not be empty.',
      );
    }

    final questions = await provider.fetchQuestions(
      lessonId: normalizedLessonId,
    );
    final sortedQuestions = List<ExerciseQuestionModel>.of(questions)
      ..sort((first, second) {
        final questionNumberComparison = first.questionNumber.compareTo(
          second.questionNumber,
        );
        if (questionNumberComparison != 0) return questionNumberComparison;

        return first.id.compareTo(second.id);
      });

    return List.unmodifiable(sortedQuestions);
  }

  Future<AnswerResultModel> submitAnswer({
    required ExerciseQuestionModel question,
    required List<String> userAnswer,
  }) {
    return provider.submitAnswer(question: question, userAnswer: userAnswer);
  }

  Future<AnswerResultModel> evaluatePronunciation({
    required ExerciseQuestionModel question,
  }) {
    return provider.evaluatePronunciation(question: question);
  }
}
