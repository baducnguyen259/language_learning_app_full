import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/practice/controllers/practice_controller.dart';

class PracticeView extends GetView<PracticeController> {
  const PracticeView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            spacing: 12,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              _buildQuickReviewCard(),
              CustomText(
                text: 'Chế độ luyện tập',
                style: AppTextStyle.labelMedium,
                color: AppColors.contentPrimary,
              ),
              _buildPracticeModeList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: AppColors.backgroundPPLightAccent,
          child: CustomImage.asset(
            AppIcons.icAccount,
            width: 24,
            height: 24,
            color: AppColors.contentPPAccent,
            semanticLabel: 'Ảnh đại diện',
          ),
        ),
        CustomText(
          text: 'Luyện tập',
          textAlign: TextAlign.center,
          style: AppTextStyle.labelSmall,
          color: AppColors.purple100,
        ),
        CustomImage.asset(
          AppIcons.icBell,
          width: 22,
          height: 22,
          color: AppColors.contentPrimary,
          semanticLabel: 'Thông báo',
        ),
      ],
    );
  }

  Widget _buildQuickReviewCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.purple100, AppColors.purple75],
          begin: Alignment.centerLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 14,
        children: [
          _buildReviewChip(),
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomText(
                text: 'Từ vựng cần ôn tập',
                style: AppTextStyle.labelLarge,
                color: AppColors.contentPrimaryInvert,
              ),
              CustomText(
                text: 'Giữ vững chuỗi học tập của bạn!',
                style: AppTextStyle.bodyXSReg,
                color: AppColors.contentPrimaryInvert,
              ),
            ],
          ),
          CustomButton(
            onPressed: () {},
            radius: 16,
            buttonSize: ButtonSizeEnum.EXTRA_SMALL,
            backgroundColor: AppColors.backgroundPrimary,
            foregroundColor: AppColors.purple100,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CustomText(
                  text: 'Bắt đầu ngay',
                  style: AppTextStyle.buttonS,
                  color: AppColors.purple100,
                ),
                CustomImage.asset(
                  AppIcons.icActionArrowRight,
                  width: 16,
                  height: 16,
                  color: AppColors.purple100,
                  semanticLabel: 'Bắt đầu',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewChip() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.colorChipBg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          CustomText(
            text: '⚡ Ôn tập nhanh',
            style: AppTextStyle.bodyXSSemi,
            color: AppColors.contentPrimaryInvert,
          ),

          CustomText(
            text: '12 từ',
            style: AppTextStyle.bodyXSSemi,
            color: AppColors.contentPrimaryInvert,
          ),
        ],
      ),
    );
  }

  Widget _buildPracticeModeList() {
    return Column(
      spacing: 8,
      children: [
        _buildPracticeMode(
          title: 'Flashcard',
          description: 'Ôn tập qua thẻ ghi nhớ',
          icon: AppIcons.icQuiz,
          backgroundColor: AppColors.purple15,
          iconColor: AppColors.purple100,
        ),
        _buildPracticeMode(
          title: 'Luyện nghe',
          description: 'Cải thiện kỹ năng nghe hiểu',
          icon: AppIcons.icListen,
          backgroundColor: AppColors.blue5,
          iconColor: AppColors.blue100,
        ),
        _buildPracticeMode(
          title: 'Phát âm',
          description: 'Luyện nói chuẩn giọng Hàn',
          icon: AppIcons.icMicro,
          backgroundColor: AppColors.backgroundSecondaryLightOrange,
          iconColor: AppColors.orange600,
        ),
        _buildPracticeMode(
          title: 'Ghép từ',
          description: 'Trò chơi nối từ vựng',
          icon: AppIcons.icDictionary,
          backgroundColor: AppColors.green15,
          iconColor: AppColors.contentSecondaryGreen,
        ),
        _buildPracticeMode(
          title: 'Sắp xếp câu',
          description: 'Luyện tập ngữ pháp',
          icon: AppIcons.icLesson,
          backgroundColor: AppColors.yellow15,
          iconColor: AppColors.yellow600,
        ),
      ],
    );
  }

  Widget _buildPracticeMode({
    required String title,
    required String description,
    required String icon,
    required Color backgroundColor,
    required Color iconColor,
    VoidCallback? onTap,
  }) {
    return Material(
      color: AppColors.backgroundPrimary,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap ?? () {},
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: backgroundColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: CustomImage.asset(
                  icon,
                  width: 22,
                  height: 22,
                  color: iconColor,
                  semanticLabel: title,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomText(
                      text: title,
                      style: AppTextStyle.labelSmall,
                      color: AppColors.contentPrimary,
                    ),
                    const SizedBox(height: 2),
                    CustomText(
                      text: description,
                      style: AppTextStyle.bodyXSReg,
                      color: AppColors.contentSecondary,
                    ),
                  ],
                ),
              ),
              CustomImage.asset(
                AppIcons.icActionArrowRight,
                width: 16,
                height: 16,
                color: AppColors.contentTertiary,
                semanticLabel: 'Mở $title',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
