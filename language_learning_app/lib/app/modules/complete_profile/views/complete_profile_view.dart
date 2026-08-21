import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/complete_profile/controllers/complete_profile_controller.dart';
import 'package:language_learning_app/app/modules/complete_profile/widgets/complete_profile_avatar.dart';
import 'package:language_learning_app/app/modules/complete_profile/widgets/gender_selector.dart';

class CompleteProfileView extends GetView<CompleteProfileController> {
  const CompleteProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      showAppBar: true,
      title: 'Chỉnh sửa hồ sơ',
      appBarTextStyle: AppTextStyle.headingH7Bold.copyWith(
        color: AppColors.contentPrimary,
      ),
      appBarBackgroundColor: AppColors.backgroundPrimary,
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      canPop: false,
      onLeadingTap: controller.showProfileRequiredMessage,
      actions: [
        TextButton(
          onPressed: controller.saveProfile,
          child: CustomText(
            text: 'Lưu',
            style: AppTextStyle.labelXSmall,
            color: AppColors.purple100,
          ),
        ),
      ],
      body: Obx(() => _buildBody(context)),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: CustomButton.primary(
          title: 'Lưu thay đổi',
          showLoading: true,
          onPressed: controller.saveProfile,
          backgroundColor: AppColors.purple100,
          radius: 10,
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    if (controller.isLoading.value) {
      return Center(
        child: CircularProgressIndicator(color: AppColors.purple100),
      );
    }
    if (controller.errorMessage.value.isNotEmpty) {
      return _buildErrorState();
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final horizontalPadding = constraints.maxWidth >= 600 ? 40.0 : 16.0;
        return SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(
            horizontalPadding,
            20,
            horizontalPadding,
            24,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 680),
              child: Column(
                children: [
                  CompleteProfileAvatar(
                    avatarUrl: controller.avatarUrl.value,
                    onCameraTap: controller.showAvatarUploadUnavailable,
                  ),
                  const SizedBox(height: 22),
                  _buildAccountSection(),
                  const SizedBox(height: 16),
                  _buildPersonalSection(context),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CustomText(
              text: controller.errorMessage.value,
              style: AppTextStyle.bodySReg,
              color: AppColors.contentNegative,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            CustomButton.primary(
              title: 'Thử lại',
              width: 140,
              showLoading: true,
              onPressed: controller.loadProfile,
              backgroundColor: AppColors.purple100,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountSection() {
    return _buildCard(
      children: [
        CustomTextField(
          controller: controller.fullNameController,
          labelInput: 'Họ và tên',
          hintText: 'Nhập họ và tên',
          prefixWidget: CustomImage.asset(AppIcons.icAccount),
          isRequired: true,
        ),
        CustomTextField(
          controller: controller.displayNameController,
          labelInput: 'Tên hiển thị',
          hintText: 'Nhập tên hiển thị',
          prefixWidget: CustomImage.asset(AppIcons.icAccount),
          isRequired: true,
        ),
        CustomTextField(
          controller: controller.emailController,
          labelInput: 'Email',
          prefixWidget: CustomImage.asset(AppIcons.icMail),
          readOnly: true,
        ),
      ],
    );
  }

  Widget _buildPersonalSection(BuildContext context) {
    return _buildCard(
      children: [
        CustomTextField(
          controller: controller.dateOfBirthController,
          labelInput: 'Ngày sinh',
          hintText: 'Chọn ngày sinh',
          prefixWidget: CustomImage.asset(AppIcons.icCalendar),
          suffixWidget: CustomImage.asset(
            AppIcons.icActionArrowRight,
            width: 16,
            height: 16,
          ).marginAll(12),
          readOnly: true,
          actionFunction: () => controller.selectDateOfBirth(context),
          isRequired: true,
        ),
        Obx(
          () => GenderSelector(
            selectedGender: controller.selectedGender.value,
            onSelected: controller.selectGender,
          ),
        ),
      ],
    );
  }

  Widget _buildCard({required List<Widget> children}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: AppColors.elevationS1,
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(spacing: 12, children: children),
    );
  }
}
