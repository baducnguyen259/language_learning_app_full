import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/vocabulary/controllers/vocabulary_controller.dart';

class VocabularyView extends GetView<VocabularyController> {
  const VocabularyView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: Center(
        child: Text(
          'Từ vựng',
          style: AppTextStyle.headingXSmall.copyWith(
            color: AppColors.contentPrimary,
          ),
        ),
      ),
    );
  }
}
