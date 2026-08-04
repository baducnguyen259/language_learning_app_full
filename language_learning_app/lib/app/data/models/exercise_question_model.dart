enum ExerciseQuestionType {
  matching,
  sentenceOrder,
  missingWord,
  listeningInput,
  pronunciation,
}

class ExerciseOptionModel {
  const ExerciseOptionModel({
    required this.id,
    required this.text,
    this.pairId,
    this.isMatched = false,
  });

  final String id;
  final String text;
  final String? pairId;
  final bool isMatched;

  factory ExerciseOptionModel.fromJson(Map<String, dynamic> json) {
    return ExerciseOptionModel(
      id: json['id'] as String,
      text: json['text'] as String,
      pairId: json['pairId'] as String?,
      isMatched: json['isMatched'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'text': text,
      'pairId': pairId,
      'isMatched': isMatched,
    };
  }

  ExerciseOptionModel copyWith({
    String? id,
    String? text,
    String? pairId,
    bool? isMatched,
  }) {
    return ExerciseOptionModel(
      id: id ?? this.id,
      text: text ?? this.text,
      pairId: pairId ?? this.pairId,
      isMatched: isMatched ?? this.isMatched,
    );
  }
}

class ExerciseQuestionModel {
  const ExerciseQuestionModel({
    required this.id,
    required this.type,
    required this.questionNumber,
    required this.totalQuestions,
    required this.instruction,
    this.prompt = '',
    this.koreanText = '',
    this.romanization = '',
    this.translation = '',
    this.audioUrl = '',
    this.options = const <ExerciseOptionModel>[],
    this.initialAnswer = const <String>[],
    this.correctAnswer = const <String>[],
  });

  final String id;
  final ExerciseQuestionType type;
  final int questionNumber;
  final int totalQuestions;
  final String instruction;
  final String prompt;
  final String koreanText;
  final String romanization;
  final String translation;
  final String audioUrl;
  final List<ExerciseOptionModel> options;
  final List<String> initialAnswer;
  final List<String> correctAnswer;

  double get progress {
    if (totalQuestions <= 0) {
      return 0;
    }

    return (questionNumber / totalQuestions).clamp(0, 1).toDouble();
  }

  factory ExerciseQuestionModel.fromJson(Map<String, dynamic> json) {
    return ExerciseQuestionModel(
      id: json['id'] as String,
      type: ExerciseQuestionType.values.byName(json['type'] as String),
      questionNumber: (json['questionNumber'] as num).toInt(),
      totalQuestions: (json['totalQuestions'] as num).toInt(),
      instruction: json['instruction'] as String,
      prompt: json['prompt'] as String? ?? '',
      koreanText: json['koreanText'] as String? ?? '',
      romanization: json['romanization'] as String? ?? '',
      translation: json['translation'] as String? ?? '',
      audioUrl: json['audioUrl'] as String? ?? '',
      options: (json['options'] as List<dynamic>? ?? const <dynamic>[])
          .map(
            (dynamic option) =>
                ExerciseOptionModel.fromJson(option as Map<String, dynamic>),
          )
          .toList(growable: false),
      initialAnswer: List<String>.from(
        json['initialAnswer'] as List<dynamic>? ?? const <dynamic>[],
      ),
      correctAnswer: List<String>.from(
        json['correctAnswer'] as List<dynamic>? ?? const <dynamic>[],
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'type': type.name,
      'questionNumber': questionNumber,
      'totalQuestions': totalQuestions,
      'instruction': instruction,
      'prompt': prompt,
      'koreanText': koreanText,
      'romanization': romanization,
      'translation': translation,
      'audioUrl': audioUrl,
      'options': options
          .map((ExerciseOptionModel option) => option.toJson())
          .toList(growable: false),
      'initialAnswer': initialAnswer.toList(growable: false),
      'correctAnswer': correctAnswer.toList(growable: false),
    };
  }

  ExerciseQuestionModel copyWith({
    String? id,
    ExerciseQuestionType? type,
    int? questionNumber,
    int? totalQuestions,
    String? instruction,
    String? prompt,
    String? koreanText,
    String? romanization,
    String? translation,
    String? audioUrl,
    List<ExerciseOptionModel>? options,
    List<String>? initialAnswer,
    List<String>? correctAnswer,
  }) {
    return ExerciseQuestionModel(
      id: id ?? this.id,
      type: type ?? this.type,
      questionNumber: questionNumber ?? this.questionNumber,
      totalQuestions: totalQuestions ?? this.totalQuestions,
      instruction: instruction ?? this.instruction,
      prompt: prompt ?? this.prompt,
      koreanText: koreanText ?? this.koreanText,
      romanization: romanization ?? this.romanization,
      translation: translation ?? this.translation,
      audioUrl: audioUrl ?? this.audioUrl,
      options: List<ExerciseOptionModel>.unmodifiable(options ?? this.options),
      initialAnswer: List<String>.unmodifiable(
        initialAnswer ?? this.initialAnswer,
      ),
      correctAnswer: List<String>.unmodifiable(
        correctAnswer ?? this.correctAnswer,
      ),
    );
  }
}
