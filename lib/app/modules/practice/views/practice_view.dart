import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/practice/controllers/practice_controller.dart';

class PracticeView extends GetView<PracticeController> {
  const PracticeView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: Center(
        child: Text(
          'Luyện tập',
          style: AppTextStyle.headingXSmall.copyWith(
            color: AppColors.contentPrimary,
          ),
        ),
      ),
    );
  }
}
