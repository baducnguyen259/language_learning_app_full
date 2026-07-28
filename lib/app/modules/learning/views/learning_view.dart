import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';

class LearningView extends GetView<LearningController> {
  const LearningView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: Center(
        child: Text(
          'Bài học',
          style: AppTextStyle.headingXSmall.copyWith(
            color: AppColors.contentPrimary,
          ),
        ),
      ),
    );
  }
}
