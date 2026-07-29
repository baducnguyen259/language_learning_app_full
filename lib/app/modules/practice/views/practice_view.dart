import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/practice/controllers/practice_controller.dart';

class PracticeView extends GetView<PracticeController> {
  const PracticeView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: Stack(children: [_buildHeader()]),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 48,
      padding: EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(color: AppColors.backgroundSecondaryLightBlue),
      child: Row(
        children: [
          CircleAvatar(),
          Expanded(
            child: CustomText(
              text: 'Luyện tập',
              style: AppTextStyle.labelMedium,
              color: AppColors.purple100,
            ),
          ),
          CustomImage.asset(
            AppIcons.icSearch,
            width: 24,
            height: 24,
            color: AppColors.contentPrimary,
            semanticLabel: 'Tìm kiếm',
          ),
        ],
      ),
    );
  }
}
