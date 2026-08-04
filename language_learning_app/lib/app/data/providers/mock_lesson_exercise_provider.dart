import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/data/providers/lesson_exercise_provider.dart';

final class MockLessonExerciseProvider implements LessonExerciseProvider {
  const MockLessonExerciseProvider({
    this.responseDelay = const Duration(milliseconds: 300),
  });

  final Duration responseDelay;

  @override
  Future<List<ExerciseQuestionModel>> fetchQuestions({
    required String lessonId,
  }) async {
    await _simulateDelay();

    return const [
      ExerciseQuestionModel(
        id: 'matching-4',
        type: ExerciseQuestionType.matching,
        questionNumber: 4,
        totalQuestions: 10,
        instruction: 'Ghép từ với nghĩa phù hợp',
        options: [
          ExerciseOptionModel(id: 'love-ko', text: '사랑', pairId: 'love'),
          ExerciseOptionModel(
            id: 'family-vi',
            text: 'Gia đình',
            pairId: 'family',
          ),
          ExerciseOptionModel(id: 'friend-ko', text: '친구', pairId: 'friend'),
          ExerciseOptionModel(
            id: 'thanks-vi',
            text: 'Cảm ơn',
            pairId: 'thanks',
            isMatched: true,
          ),
          ExerciseOptionModel(
            id: 'thanks-ko',
            text: '감사합니다',
            pairId: 'thanks',
            isMatched: true,
          ),
          ExerciseOptionModel(id: 'love-vi', text: 'Tình yêu', pairId: 'love'),
          ExerciseOptionModel(id: 'family-ko', text: '가족', pairId: 'family'),
          ExerciseOptionModel(
            id: 'friend-vi',
            text: 'Bạn bè',
            pairId: 'friend',
          ),
        ],
        initialAnswer: ['thanks-ko', 'thanks-vi'],
        correctAnswer: [
          'love-ko',
          'love-vi',
          'family-ko',
          'family-vi',
          'friend-ko',
          'friend-vi',
          'thanks-ko',
          'thanks-vi',
        ],
      ),
      ExerciseQuestionModel(
        id: 'sentence-order-5',
        type: ExerciseQuestionType.sentenceOrder,
        questionNumber: 5,
        totalQuestions: 10,
        instruction: 'Sắp xếp các từ thành câu đúng',
        prompt: 'Xin chào, tôi là Min-su.',
        koreanText: '안녕하세요, 저는 민수예요.',
        romanization: 'Annyeonghaseyo, jeoneun Minsuyeyo.',
        translation: 'Xin chào, tôi là Min-su.',
        options: [
          ExerciseOptionModel(id: 'sentence-hello', text: '안녕하세요'),
          ExerciseOptionModel(id: 'sentence-i', text: '저는'),
          ExerciseOptionModel(id: 'sentence-minsu', text: '민수예요'),
          ExerciseOptionModel(id: 'sentence-meet', text: '만나서'),
        ],
        initialAnswer: ['안녕하세요', '저는'],
        correctAnswer: ['안녕하세요', '저는', '민수예요'],
      ),
      ExerciseQuestionModel(
        id: 'missing-word-6',
        type: ExerciseQuestionType.missingWord,
        questionNumber: 6,
        totalQuestions: 10,
        instruction: 'Chọn từ còn thiếu',
        koreanText: '저는 베트남 사람 ________.',
        romanization: 'Jeoneun Beteunam saram imnida.',
        translation: 'Tôi là người Việt Nam.',
        options: [
          ExerciseOptionModel(id: 'missing-imnida', text: '입니다'),
          ExerciseOptionModel(id: 'missing-isseoyo', text: '있어요'),
          ExerciseOptionModel(id: 'missing-gayo', text: '가요'),
          ExerciseOptionModel(id: 'missing-meogeoyo', text: '먹어요'),
        ],
        correctAnswer: ['입니다'],
      ),
      ExerciseQuestionModel(
        id: 'listening-input-7',
        type: ExerciseQuestionType.listeningInput,
        questionNumber: 7,
        totalQuestions: 10,
        instruction: 'Nghe và nhập từ bạn nghe được',
        prompt: 'Nhập từ tiếng Hàn',
        koreanText: '안녕하세요',
        romanization: 'Annyeonghaseyo',
        translation: 'Xin chào',
        correctAnswer: ['안녕하세요'],
      ),
      ExerciseQuestionModel(
        id: 'pronunciation-8',
        type: ExerciseQuestionType.pronunciation,
        questionNumber: 8,
        totalQuestions: 10,
        instruction: 'Hãy đọc câu sau',
        koreanText: '안녕하세요, 만나서 반갑습니다.',
        romanization: 'Annyeonghaseyo, mannaseo bangapseumnida.',
        translation: 'Xin chào, rất vui được gặp bạn.',
        correctAnswer: ['안녕하세요, 만나서 반갑습니다.'],
      ),
    ];
  }

  @override
  Future<AnswerResultModel> submitAnswer({
    required ExerciseQuestionModel question,
    required List<String> userAnswer,
  }) async {
    await _simulateDelay();

    final normalizedUserAnswer = _normalizeAnswers(userAnswer);
    final normalizedCorrectAnswer = _normalizeAnswers(question.correctAnswer);
    final isCorrect = _answersAreEqual(
      normalizedUserAnswer,
      normalizedCorrectAnswer,
    );

    return AnswerResultModel(
      questionId: question.id,
      isCorrect: isCorrect,
      score: isCorrect ? 1 : 0,
      userAnswer: List.unmodifiable(userAnswer),
      correctAnswer: List.unmodifiable(question.correctAnswer),
      feedback: isCorrect ? 'Chính xác!' : 'Chưa chính xác.',
    );
  }

  @override
  Future<AnswerResultModel> evaluatePronunciation({
    required ExerciseQuestionModel question,
  }) async {
    await _simulateDelay();

    return AnswerResultModel(
      questionId: question.id,
      isCorrect: true,
      score: 0.85,
      userAnswer: [question.koreanText],
      correctAnswer: List.unmodifiable(question.correctAnswer),
      feedback: 'Phát âm tốt!',
      pronunciationSegments: const [
        PronunciationSegmentResultModel(text: '안녕하세요,', score: 0.92),
        PronunciationSegmentResultModel(text: '만나서', score: 0.72),
        PronunciationSegmentResultModel(text: '반갑습니다.', score: 0.91),
      ],
    );
  }

  Future<void> _simulateDelay() {
    return Future<void>.delayed(responseDelay);
  }

  List<String> _normalizeAnswers(List<String> answers) {
    return answers.map(_normalizeAnswer).toList(growable: false);
  }

  String _normalizeAnswer(String answer) {
    return answer.trim().toLowerCase().replaceAll(RegExp(r'\s+'), ' ');
  }

  bool _answersAreEqual(List<String> first, List<String> second) {
    if (first.length != second.length) return false;

    for (var index = 0; index < first.length; index++) {
      if (first[index] != second[index]) return false;
    }

    return true;
  }
}
