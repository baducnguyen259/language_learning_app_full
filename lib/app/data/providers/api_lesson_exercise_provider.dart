import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/data/providers/lesson_exercise_provider.dart';

final class ApiLessonExerciseProvider implements LessonExerciseProvider {
  const ApiLessonExerciseProvider();

  @override
  Future<List<ExerciseQuestionModel>> fetchQuestions({
    required String lessonId,
  }) {
    return _apiNotConfigured();
  }

  @override
  Future<AnswerResultModel> submitAnswer({
    required ExerciseQuestionModel question,
    required List<String> userAnswer,
  }) {
    return _apiNotConfigured();
  }

  @override
  Future<AnswerResultModel> evaluatePronunciation({
    required ExerciseQuestionModel question,
  }) {
    return _apiNotConfigured();
  }

  Future<T> _apiNotConfigured<T>() {
    return Future<T>.error(
      StateError('Lesson exercise API has not been configured.'),
    );
  }
}
