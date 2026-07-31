class PronunciationSegmentResultModel {
  const PronunciationSegmentResultModel({
    required this.text,
    required this.score,
  });

  final String text;
  final double score;

  factory PronunciationSegmentResultModel.fromJson(Map<String, dynamic> json) {
    return PronunciationSegmentResultModel(
      text: _stringValue(json['text']),
      score: _doubleValue(json['score']),
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
      questionId: _stringValue(json['questionId']),
      isCorrect: _boolValue(json['isCorrect']),
      score: _doubleValue(json['score']),
      userAnswer: _stringList(json['userAnswer']),
      correctAnswer: _stringList(json['correctAnswer']),
      feedback: _stringValue(json['feedback']),
      pronunciationSegments: _pronunciationSegmentList(
        json['pronunciationSegments'],
      ),
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

List<PronunciationSegmentResultModel> _pronunciationSegmentList(Object? value) {
  if (value is! Iterable<Object?>) {
    return const <PronunciationSegmentResultModel>[];
  }

  return List<PronunciationSegmentResultModel>.unmodifiable(
    value.whereType<Map>().map(
      (Map segment) => PronunciationSegmentResultModel.fromJson(
        Map<String, dynamic>.from(segment),
      ),
    ),
  );
}

List<String> _stringList(Object? value) {
  if (value is! Iterable<Object?>) {
    return const <String>[];
  }

  return List<String>.unmodifiable(
    value
        .where((Object? item) => item != null)
        .map((Object? item) => item.toString()),
  );
}

String _stringValue(Object? value) => value?.toString() ?? '';

double _doubleValue(Object? value) {
  if (value is num) {
    return value.toDouble();
  }

  return double.tryParse(value?.toString() ?? '') ?? 0;
}

bool _boolValue(Object? value) {
  if (value is bool) {
    return value;
  }
  if (value is num) {
    return value != 0;
  }

  return switch (value?.toString().trim().toLowerCase()) {
    'true' || '1' => true,
    _ => false,
  };
}
