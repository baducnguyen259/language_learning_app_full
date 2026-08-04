import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/vocabulary/controllers/vocabulary_controller.dart';

class VocabularyView extends GetView<VocabularyController> {
  const VocabularyView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      floatingActionButton: _buildAddButton(),
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: Column(
            spacing: 16,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              _buildSearchBar(),
              _buildProgressCard(),
              _buildFilterBar(),
              _buildVocabularyList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 56,

      decoration: BoxDecoration(
        color: AppColors.backgroundSecondaryLightPurple,
      ),
      child: Row(
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
          const SizedBox(width: 12),
          Expanded(
            child: CustomText(
              text: 'Từ vựng của tôi',
              style: AppTextStyle.labelSmall,
              color: AppColors.purple100,
            ),
          ),
          CustomButton(
            width: 44,
            radius: 12,
            backgroundColor: AppColors.white,
            onPressed: () {},
            child: CustomImage.asset(
              AppIcons.icBarChart,
              width: 24,
              height: 24,
              semanticLabel: 'Thống kê',
              color: AppColors.red100,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Row(
      children: [
        Expanded(
          child: CustomTextField(
            controller: controller.searchController,
            hintText: 'Tìm kiếm từ vựng...',
            hintStyle: AppTextStyle.bodyXSReg,
            semanticLabel: 'Tìm kiếm từ vựng',
            height: 44,
            radius: 14,
            fillColor: AppColors.backgroundPrimary,
            enabledBorderColor: AppColors.borderPrimaryLightGrayScale,
            focusedBorderColor: AppColors.purple100,
            showErrorText: false,
            prefixWidget: CustomImage.asset(
              AppIcons.icSearch,
              width: 22,
              height: 22,
              color: AppColors.contentSecondary,
              semanticLabel: 'Tìm kiếm',
            ),
          ),
        ),
        const SizedBox(width: 8),
        CustomButton(
          width: 44,
          radius: 12,
          buttonSize: ButtonSizeEnum.MEDIUM,
          backgroundColor: AppColors.backgroundPPLightAccent,
          foregroundColor: AppColors.purple100,
          onPressed: () {},
          child: CustomImage.asset(
            AppIcons.icTune,
            width: 20,
            height: 20,
            color: AppColors.purple100,
            semanticLabel: 'Bộ lọc từ vựng',
          ),
        ),
      ],
    );
  }

  Widget _buildProgressCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderPrimaryLightGrayScale),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomText(
                      text: 'Tiến độ của bạn',
                      style: AppTextStyle.bodyXSReg,
                      color: AppColors.contentSecondary,
                    ),
                    CustomText(
                      text: '126 từ đã học',
                      style: AppTextStyle.headingH6Bold,
                      color: AppColors.contentPrimary,
                    ),
                  ],
                ),
              ),
              CustomImage.asset(
                AppIcons.icBook,
                width: 22,
                height: 22,
                padding: const EdgeInsets.all(11),
                radius: 10,
                backgroundColor: AppColors.purple5,
                color: AppColors.purple100,
                semanticLabel: 'Số từ đã học',
              ),
            ],
          ),
          const SizedBox(height: 20),
          CustomButton.primary(
            onPressed: () {},
            radius: 14,
            buttonSize: ButtonSizeEnum.MEDIUM,
            backgroundColor: AppColors.purple100,
            title: 'Ôn tập ngay',
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Row(
      spacing: 8,
      children: [
        _buildFilterChip(label: 'Tất cả', isSelected: true),
        _buildFilterChip(label: 'Đang học'),
        _buildFilterChip(label: 'Đã nhớ'),
        _buildFilterChip(label: 'Yêu thích'),
      ],
    );
  }

  Widget _buildFilterChip({required String label, bool isSelected = false}) {
    return Expanded(
      child: Material(
        color: isSelected
            ? AppColors.purple100
            : AppColors.backgroundSecondaryLightPurple,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 7),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: isSelected
                  ? null
                  : Border.all(color: AppColors.borderPrimaryLightGrayScale),
            ),
            child: CustomText(
              text: label,
              textAlign: TextAlign.center,
              style: AppTextStyle.bodyXSReg,
              color: isSelected
                  ? AppColors.contentPrimaryInvert
                  : AppColors.contentSecondary,
              maxLines: 1,
              textOverflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildVocabularyList() {
    return Column(
      spacing: 8,
      children: [
        _buildVocabularyCard(
          korean: '안녕하세요',
          romanization: 'Annyeonghaseyo',
          meaning: 'Xin chào',
          isFavorite: true,
          statusColor: AppColors.green100,
        ),
        _buildVocabularyCard(
          korean: '감사합니다',
          romanization: 'Gamsahamnida',
          meaning: 'Cảm ơn',
          statusColor: AppColors.green100,
        ),
        _buildVocabularyCard(
          korean: '사랑',
          romanization: 'Sarang',
          meaning: 'Tình yêu',
          isFavorite: true,
          statusColor: AppColors.yellow600,
        ),
      ],
    );
  }

  Widget _buildVocabularyCard({
    required String korean,
    required String romanization,
    required String meaning,
    required Color statusColor,
    bool isFavorite = false,
  }) {
    return Material(
      color: AppColors.backgroundPrimary,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            spacing: 8,
            children: [
              Expanded(
                child: Row(
                  spacing: 12,
                  children: [
                    CustomImage.asset(
                      AppIcons.icVolumeUp,
                      width: 18,
                      height: 18,
                      padding: const EdgeInsets.all(9),
                      shape: BoxShape.circle,
                      backgroundColor: AppColors.purple15,
                      color: AppColors.purple100,
                      semanticLabel: 'Nghe phát âm $korean',
                    ),
                    Expanded(
                      child: Column(
                        spacing: 2,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            spacing: 6,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Flexible(
                                child: CustomText(
                                  text: korean,
                                  style: AppTextStyle.bodyMReg,
                                  color: AppColors.contentPrimary,
                                  maxLines: 2,
                                  textOverflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Flexible(
                                child: CustomText(
                                  text: romanization,
                                  style: AppTextStyle.bodyXSReg,
                                  color: AppColors.contentTertiary,
                                  maxLines: 1,
                                  textOverflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          CustomText(
                            text: meaning,
                            style: AppTextStyle.bodyXSReg,
                            color: AppColors.contentSecondary,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                spacing: 8,
                children: [
                  CustomImage.asset(
                    AppIcons.icFavorite,
                    width: 24,
                    height: 24,
                    color: isFavorite
                        ? AppColors.red100
                        : AppColors.contentTertiary,
                    semanticLabel: isFavorite
                        ? 'Bỏ khỏi danh sách yêu thích'
                        : 'Thêm vào danh sách yêu thích',
                  ),
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: statusColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddButton() {
    return CustomButton(
      width: 48,
      radius: 24,
      buttonSize: ButtonSizeEnum.LARGE,
      backgroundColor: AppColors.green100,
      foregroundColor: AppColors.contentPrimaryInvert,
      onPressed: () {},
      child: CustomImage.asset(
        AppIcons.icAddCircle,
        width: 24,
        height: 24,
        color: AppColors.contentPrimaryInvert,
        semanticLabel: 'Thêm từ vựng',
      ),
    );
  }
}
