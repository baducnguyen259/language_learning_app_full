class PronunciationSegmentResultModel {
  const PronunciationSegmentResultModel({
    required this.text,
    required this.score,
  });

  final String text;
  final double score;

  factory PronunciationSegmentResultModel.fromJson(Map<String, dynamic> json) {
    return PronunciationSegmentResultModel(
      text: json['text'] as String,
      score: (json['score'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{'text': text, 'score': score};
  }

  PronunciationSegmentResultModel copyWith({String? text, double? score}) {
    return PronunciationSegmentResultModel(
      text: text ?? this.text,
      score: score ?? this.score,
    );
  }
}

class AnswerResultModel {
  const AnswerResultModel({
    required this.questionId,
    required this.isCorrect,
    required this.score,
    this.userAnswer = const <String>[],
    this.correctAnswer = const <String>[],
    this.feedback = '',
    this.pronunciationSegments = const <PronunciationSegmentResultModel>[],
  });

  final String questionId;
  final bool isCorrect;
  final double score;
  final List<String> userAnswer;
  final List<String> correctAnswer;
  final String feedback;
  final List<PronunciationSegmentResultModel> pronunciationSegments;

  factory AnswerResultModel.fromJson(Map<String, dynamic> json) {
    return AnswerResultModel(
      questionId: json['questionId'] as String,
      isCorrect: json['isCorrect'] as bool,
      score: (json['score'] as num).toDouble(),
      userAnswer: List<String>.from(
        json['userAnswer'] as List<dynamic>? ?? const <dynamic>[],
      ),
      correctAnswer: List<String>.from(
        json['correctAnswer'] as List<dynamic>? ?? const <dynamic>[],
      ),
      feedback: json['feedback'] as String? ?? '',
      pronunciationSegments:
          (json['pronunciationSegments'] as List<dynamic>? ?? const <dynamic>[])
              .map(
                (dynamic segment) => PronunciationSegmentResultModel.fromJson(
                  segment as Map<String, dynamic>,
                ),
              )
              .toList(growable: false),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'questionId': questionId,
      'isCorrect': isCorrect,
      'score': score,
      'userAnswer': userAnswer.toList(growable: false),
      'correctAnswer': correctAnswer.toList(growable: false),
      'feedback': feedback,
      'pronunciationSegments': pronunciationSegments
          .map((PronunciationSegmentResultModel segment) => segment.toJson())
          .toList(growable: false),
    };
  }

  AnswerResultModel copyWith({
    String? questionId,
    bool? isCorrect,
    double? score,
    List<String>? userAnswer,
    List<String>? correctAnswer,
    String? feedback,
    List<PronunciationSegmentResultModel>? pronunciationSegments,
  }) {
    return AnswerResultModel(
      questionId: questionId ?? this.questionId,
      isCorrect: isCorrect ?? this.isCorrect,
      score: score ?? this.score,
      userAnswer: List<String>.unmodifiable(userAnswer ?? this.userAnswer),
      correctAnswer: List<String>.unmodifiable(
        correctAnswer ?? this.correctAnswer,
      ),
      feedback: feedback ?? this.feedback,
      pronunciationSegments: List<PronunciationSegmentResultModel>.unmodifiable(
        pronunciationSegments ?? this.pronunciationSegments,
      ),
    );
  }
}
