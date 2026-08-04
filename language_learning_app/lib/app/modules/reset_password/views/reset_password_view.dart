import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_dialog.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/reset_password/controllers/reset_password_controller.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class ResetPasswordView extends GetView<ResetPasswordController> {
  const ResetPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      showAppBar: true,
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      appBarBackgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 40),
            _buildHeader(),
            const SizedBox(height: 24),
            _buildFormPass(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return SizedBox(
      width: double.infinity,
      child: Column(
        children: [
          CustomText(
            text: 'Tạo mật khẩu mới',
            textAlign: TextAlign.center,
            style: AppTextStyle.headingXSmall,
            color: AppColors.contentPrimary,
          ),
          const SizedBox(height: 8),
          CustomText(
            text:
                'Vui lòng tạo mật khẩu mới để hoàn tất quá trình khôi phục tài khoản.',
            textAlign: TextAlign.center,
            style: AppTextStyle.paragraphSmall,
            color: AppColors.contentSecondary,
          ).paddingSymmetric(horizontal: 18),
        ],
      ),
    );
  }

  Widget _buildFormPass() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildPasswordField(
            textController: controller.passwordController,
            hintText: 'Mật khẩu mới',
          ),
          const SizedBox(height: 8),
          _buildPasswordField(
            textController: controller.confirmPasswordController,
            hintText: 'Nhập lại mật khẩu mới',
          ),
          const SizedBox(height: 16),
          _buildPasswordRules(),
          const SizedBox(height: 16),
          CustomButton.primary(
            title: 'Xác nhận',
            backgroundColor: AppColors.backgroundPPAccent,
            radius: 14,
            onPressed: _showResetPasswordSuccessDialog,
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordField({
    required TextEditingController textController,
    required String hintText,
    // required RxBool hidePassword,
    // String? errorText,
    ValueChanged<String>? onChanged,
  }) {
    return CustomTextField(
      controller: textController,
      onChanged: onChanged,
      // errorText: errorText,
      // obscureText: hidePassword.value,
      hintText: hintText,

      prefixWidget: CustomImage.asset(AppIcons.icLock),
      maxLength: 100,
      suffixWidget: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {},
        child: CustomImage.asset(
          AppIcons.icEyeHide,
          width: 20,
          height: 20,
          margin: const EdgeInsets.all(12),
        ),
      ),
    );
  }

  Widget _buildPasswordRules() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomText(
          text: 'Mật khẩu phải:',
          style: AppTextStyle.labelMedSmall,
          color: AppColors.contentPrimary,
        ),
        const SizedBox(height: 6),
        _buildTextPass('Độ dài từ 9-16 ký tự'),
        _buildTextPass('Bao gồm ký tự số, chữ hoa, chữ thường'),
        _buildTextPass('Không trùng với tên đăng nhập'),
      ],
    );
  }

  Widget _buildTextPass(String text) {
    return Row(
      children: [
        CustomImage.asset(
          AppIcons.icCheckOutlined,
          color: AppColors.contentSecondaryGreen,
        ),
        const SizedBox(width: 4),
        Expanded(
          child: CustomText(
            text: text,
            style: AppTextStyle.paragraphXSmall,
            color: AppColors.contentPrimary,
          ),
        ),
      ],
    );
  }

  void _showResetPasswordSuccessDialog() {
    Get.dialog<void>(
      CustomDialog(
        dialogType: DialogType.FORCE_ACTION,
        imageWidget: _buildSuccessIcon(),
        title: 'Đổi mật khẩu thành công!',
        content: CustomText(
          text: 'Bạn có thể sử dụng mật khẩu mới để\nđăng nhập vào tài khoản.',
          textAlign: TextAlign.center,
          style: AppTextStyle.paragraphXSmall,
          color: AppColors.contentSecondary,
        ),
        primaryButtonLabel: 'Đăng nhập ngay →',
        primaryButtonColor: AppColors.green100,
        primaryButtonRadius: 14,
        primaryAction: () => Get.offNamed(Routes.LOGIN),
        showCloseButton: false,
        barrierDismissible: false,
        insetPadding: const EdgeInsets.symmetric(horizontal: 30),
      ),
      barrierDismissible: false,
    );
  }

  Widget _buildSuccessIcon() {
    return Container(
      width: 84,
      height: 84,
      decoration: BoxDecoration(
        color: AppColors.green15,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.green75,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: CustomImage.asset(
              AppIcons.icCheckCircleFilled,
              width: 23,
              height: 23,
              color: AppColors.green158,
              semanticLabel: 'Đổi mật khẩu thành công',
            ),
          ),
        ),
      ),
    );
  }
}
