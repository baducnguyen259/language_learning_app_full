import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';

class LearningFilterBar extends StatelessWidget {
  const LearningFilterBar({super.key, required this.controller});
  final LearningController controller;
  static const List<String> _labels = ['Tất cả', 'Đang học', 'Đã hoàn thành'];
  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Wrap(
        spacing: 8,
        runSpacing: 8,
        children: List.generate(_labels.length, (index) {
          final isSelected = controller.selectedFilterIndex.value == index;
          return ChoiceChip(
            showCheckmark: false,
            label: CustomText(
              text: _labels[index],
              style: AppTextStyle.labelMedXSmall,
              color: isSelected
                  ? AppColors.contentPrimaryInvert
                  : AppColors.contentPrimary,
            ),
            selected: isSelected,
            selectedColor: AppColors.purple100,
            backgroundColor: AppColors.backgroundPrimary,
            labelPadding: const EdgeInsets.symmetric(horizontal: 8),
            onSelected: (_) => controller.changeFilter(index),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
              side: BorderSide.none,
            ),
          );
        }),
      ),
    );
  }
}
