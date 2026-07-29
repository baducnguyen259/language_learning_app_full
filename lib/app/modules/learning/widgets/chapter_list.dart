import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';

class ChapterList extends StatelessWidget {
  const ChapterList({required this.controller, super.key});

  final LearningController controller;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 12,
        children: [
          _buildChapterHeader(
            title: 'Chương 1: Bảng chữ cái',
            subtitle: '4 bài học • Đã hoàn thành',
            color: AppColors.contentSecondaryGreen,
            icon: CustomImage.asset(
              AppIcons.icCheckOutlined,
              width: 24,
              height: 24,
              color: AppColors.white,
            ),
          ),
          _buildChapterHeader(
            title: 'Chương 2: Chào hỏi',
            subtitle: 'Bài 5-9 • Đang học',
            color: AppColors.purple100,
            icon: Icon(
              Icons.play_arrow_rounded,
              color: AppColors.contentPrimaryInvert,
            ),
          ),
          // const SizedBox(height: 14),
          Padding(
            padding: const EdgeInsets.only(left: 48),
            child: Column(
              spacing: 8,
              children: [
                Obx(
                  () => _buildLessonTile(
                    number: 5,
                    title: 'Bài 5: Xin chào',
                    progressLabel:
                        '${(controller.currentLessonProgress.value * 100).round()}%',
                    progressIndicator: LinearProgressIndicator(
                      value: controller.currentLessonProgress.value,
                      minHeight: 5,
                      borderRadius: BorderRadius.circular(4),
                      backgroundColor: AppColors.purple15,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.purple100,
                      ),
                    ),
                  ),
                ),
                _buildLessonTile(number: 6, title: 'Bài 6: Tạm biệt'),
                _buildLessonTile(number: 7, title: 'Bài 7: Xin lỗi và Cảm ơn'),
              ],
            ),
          ),
          _buildChapterHeader(
            title: 'Chương 3: Số đếm',
            subtitle: 'Bài 10-15 • Đã khóa',
            color: AppColors.backgroundPPLightAccent,
            disabled: true,
            icon: CustomImage.asset(
              AppIcons.icLock,
              width: 22,
              height: 22,
              color: AppColors.contentTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChapterHeader({
    required String title,
    required String subtitle,
    required Color color,
    required Widget icon,
    bool disabled = false,
  }) {
    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: icon,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomText(
                    text: title,
                    style: AppTextStyle.labelMedium,
                    color: AppColors.contentPrimary,
                  ),
                  const SizedBox(height: 2),
                  CustomText(
                    text: subtitle,
                    style: AppTextStyle.bodyXSReg,
                    color: disabled
                        ? AppColors.contentTertiary
                        : AppColors.contentSecondary,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonTile({
    required int number,
    required String title,
    String? progressLabel,
    Widget? progressIndicator,
  }) {
    final hasProgress = progressIndicator != null;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(12),
        border: hasProgress
            ? Border(left: BorderSide(color: AppColors.purple100, width: 4))
            : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              if (!hasProgress) ...[
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: AppColors.backgroundPPLightAccent,
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: CustomText(
                    text: '$number',
                    style: AppTextStyle.bodyXSReg,
                    color: AppColors.contentSecondary,
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: CustomText(
                  text: title,
                  style: AppTextStyle.labelMedXSmall,
                  color: hasProgress
                      ? AppColors.contentPrimary
                      : AppColors.contentSecondary,
                ),
              ),
              if (progressLabel != null)
                CustomText(
                  text: progressLabel,
                  style: AppTextStyle.bodyXSSemi,
                  color: AppColors.purple100,
                ),
            ],
          ),
          if (progressIndicator != null) ...[
            const SizedBox(height: 8),
            progressIndicator,
          ],
        ],
      ),
    );
  }
}
