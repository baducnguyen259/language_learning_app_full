import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';

abstract interface class LessonExerciseProvider {
  Future<List<ExerciseQuestionModel>> fetchQuestions({
    required String lessonId,
  });

  Future<AnswerResultModel> submitAnswer({
    required ExerciseQuestionModel question,
    required List<String> userAnswer,
  });

  Future<AnswerResultModel> evaluatePronunciation({
    required ExerciseQuestionModel question,
  });
}
