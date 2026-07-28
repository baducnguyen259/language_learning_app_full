import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';
import 'package:language_learning_app/app/modules/learning/widgets/course_sumary_card.dart';
import 'package:language_learning_app/app/modules/learning/widgets/learning_header.dart';

class LearningView extends GetView<LearningController> {
  const LearningView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: SafeArea(
        child: Column(
          children: [
            const LearningHeader(),
            Expanded(
              child: SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 680),
                  child: Column(
                    children: [CourseSumaryCard(controller: controller)],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
