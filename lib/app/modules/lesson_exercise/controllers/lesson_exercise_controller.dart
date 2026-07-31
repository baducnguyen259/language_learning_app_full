import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/data/services/lesson_exercise_service.dart';

enum ExerciseLoadStatus { loading, success, empty, error }

class LessonExerciseController extends GetxController {
  LessonExerciseController(this._service);

  static const int matchingStage = 0;
  static const int sentenceStage = 1;
  static const int missingWordStage = 2;
  static const int listeningStage = 3;
  static const int pronunciationStage = 4;
  static const int resultStage = 5;

  final LessonExerciseService _service;

  final Rx<ExerciseLoadStatus> loadStatus = ExerciseLoadStatus.loading.obs;
  final RxList<ExerciseQuestionModel> questions = <ExerciseQuestionModel>[].obs;
  final Rxn<AnswerResultModel> answerResult = Rxn<AnswerResultModel>();
  final RxString errorMessage = ''.obs;
  final RxBool isSubmitting = false.obs;
  final RxInt currentStage = matchingStage.obs;
  final RxInt lives = 5.obs;
  final RxInt selectedMatchingIndex = 0.obs;
  final RxInt selectedMissingWordIndex = 0.obs;
  final RxList<String> sentenceAnswer = <String>[].obs;
  final RxBool isRecording = false.obs;
  final RxDouble playbackSpeed = 0.75.obs;
  final TextEditingController listeningAnswerController =
      TextEditingController();

  ExerciseQuestionModel? get currentQuestion {
    final index = currentStage.value;
    if (index < 0 || index >= questions.length) return null;
    return questions[index];
  }

  ExerciseQuestionModel? get pronunciationQuestion {
    for (final question in questions) {
      if (question.type == ExerciseQuestionType.pronunciation) {
        return question;
      }
    }
    return null;
  }

  int? get currentQuestionNumber => currentQuestion?.questionNumber;

  double get progress {
    if (currentStage.value == resultStage) return 1;
    return currentQuestion?.progress ?? 0;
  }

  bool get showLives => currentStage.value <= listeningStage;

  String get lessonId {
    final arguments = Get.arguments;
    if (arguments is Map<String, dynamic>) {
      final value = arguments['lessonId'];
      if (value is String && value.trim().isNotEmpty) return value.trim();
    }
    return 'lesson-5';
  }

  @override
  void onInit() {
    super.onInit();
    unawaited(loadExercises());
  }

  Future<void> loadExercises() async {
    loadStatus.value = ExerciseLoadStatus.loading;
    errorMessage.value = '';
    answerResult.value = null;

    try {
      final loadedQuestions = await _service.fetchQuestions(lessonId: lessonId);
      questions.assignAll(loadedQuestions);

      if (questions.isEmpty) {
        loadStatus.value = ExerciseLoadStatus.empty;
        return;
      }

      currentStage.value = matchingStage;
      lives.value = 5;
      _resetStageState();
      loadStatus.value = ExerciseLoadStatus.success;
    } catch (_) {
      errorMessage.value = 'Không thể tải bài luyện tập. Vui lòng thử lại.';
      loadStatus.value = ExerciseLoadStatus.error;
    }
  }

  void selectMatchingOption(int index) {
    final options = currentQuestion?.options ?? const <ExerciseOptionModel>[];
    if (index < 0 || index >= options.length || options[index].isMatched) {
      return;
    }
    selectedMatchingIndex.value = index;
  }

  void selectMissingWord(int index) {
    final options = currentQuestion?.options ?? const <ExerciseOptionModel>[];
    if (index < 0 || index >= options.length) return;
    selectedMissingWordIndex.value = index;
  }

  void addSentenceToken(String token) {
    if (token.trim().isEmpty || sentenceAnswer.contains(token)) return;
    sentenceAnswer.add(token);
  }

  void removeSentenceToken(String token) {
    sentenceAnswer.remove(token);
  }

  void resetSentence() {
    sentenceAnswer.assignAll(
      currentQuestion?.initialAnswer ?? const <String>[],
    );
  }

  void changePlaybackSpeed() {
    playbackSpeed.value = playbackSpeed.value == 0.75 ? 1 : 0.75;
  }

  Future<void> nextStage() async {
    if (isSubmitting.value) return;

    if (currentStage.value >= resultStage) {
      Get.back<void>();
      return;
    }

    final question = currentQuestion;
    if (question == null) return;

    if (question.type == ExerciseQuestionType.pronunciation) {
      await showPronunciationResult();
      return;
    }

    isSubmitting.value = true;
    try {
      answerResult.value = await _service.submitAnswer(
        question: question,
        userAnswer: _resolveCurrentAnswer(question),
      );
      currentStage.value++;
      _resetStageState();
    } finally {
      isSubmitting.value = false;
    }
  }

  void startRecording() {
    isRecording.value = true;
  }

  Future<void> finishRecording() async {
    if (!isRecording.value) return;
    isRecording.value = false;
    await showPronunciationResult();
  }

  Future<void> showPronunciationResult() async {
    if (isSubmitting.value) return;

    final question = currentQuestion;
    if (question == null ||
        question.type != ExerciseQuestionType.pronunciation) {
      return;
    }

    isRecording.value = false;
    isSubmitting.value = true;
    try {
      answerResult.value = await _service.evaluatePronunciation(
        question: question,
      );
      currentStage.value = resultStage;
    } finally {
      isSubmitting.value = false;
    }
  }

  void retryPronunciation() {
    answerResult.value = null;
    isRecording.value = false;
    currentStage.value = pronunciationStage;
  }

  void closeExercise() {
    Get.back<void>();
  }

  List<String> _resolveCurrentAnswer(ExerciseQuestionModel question) {
    return switch (question.type) {
      ExerciseQuestionType.matching => _selectedMatchingAnswer(question),
      ExerciseQuestionType.sentenceOrder => sentenceAnswer.toList(),
      ExerciseQuestionType.missingWord => _selectedMissingWordAnswer(question),
      ExerciseQuestionType.listeningInput => [
        listeningAnswerController.text.trim(),
      ],
      ExerciseQuestionType.pronunciation => const <String>[],
    };
  }

  List<String> _selectedMatchingAnswer(ExerciseQuestionModel question) {
    final index = selectedMatchingIndex.value;
    if (index < 0 || index >= question.options.length) return const [];
    return [question.options[index].id];
  }

  List<String> _selectedMissingWordAnswer(ExerciseQuestionModel question) {
    final index = selectedMissingWordIndex.value;
    if (index < 0 || index >= question.options.length) return const [];
    return [question.options[index].text];
  }

  void _resetStageState() {
    final question = currentQuestion;
    if (question == null) return;

    switch (question.type) {
      case ExerciseQuestionType.matching:
        selectedMatchingIndex.value = 0;
      case ExerciseQuestionType.sentenceOrder:
        sentenceAnswer.assignAll(question.initialAnswer);
      case ExerciseQuestionType.missingWord:
        selectedMissingWordIndex.value = 0;
      case ExerciseQuestionType.listeningInput:
        listeningAnswerController.clear();
      case ExerciseQuestionType.pronunciation:
        isRecording.value = false;
    }
  }

  @override
  void onClose() {
    listeningAnswerController.dispose();
    super.onClose();
  }
}
