import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VocabularyController extends GetxController {
  final TextEditingController searchController = TextEditingController();

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }
}
