import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/forgot_password/controllers/forgot_password_controller.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class ForgotPasswordView extends GetView<ForgotPasswordController> {
  const ForgotPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      showAppBar: true,
      bottomNavigationBar: _buildSupportContact(),
      body: SingleChildScrollView(
        child: Column(
          spacing: 24,
          children: [_buildTextHeader(), _buildFormMail()],
        ),
      ),
    );
  }

  Widget _buildTextHeader() {
    return Column(
      children: [
        CustomText(
          text: 'Quên mật khẩu?',
          textAlign: TextAlign.center,
          style: AppTextStyle.headingH7Bold,
        ),
        CustomText(
          text: 'Nhập email đã đăng ký để xác thực .',
          style: AppTextStyle.capXSmall,
        ),
      ],
    );
  }

  Widget _buildFormMail() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      spacing: 24,
      children: [
        CustomTextField(
          controller: controller.emailController,
          labelInput: 'Email',
          prefixWidget: CustomImage.asset(AppIcons.icMail),
          hintText: 'Nhập địa chỉ email',
          keyboardType: TextInputType.text,
        ),
        CustomButton.primary(
          title: 'Gửi mã xác thực',
          backgroundColor: AppColors.nvBrand500,
          // onPressed: controller.sendVerificationCode,
          onPressed: () {
            Get.toNamed(Routes.RESET_PASSWORD);
          },
          showLoading: true,
          style: AppTextStyle.labelMedMedium.copyWith(
            color: HexColor('#FFFFFF'),
          ),
        ),
      ],
    ).paddingAll(14);
  }

  Widget _buildSupportContact() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CustomText(
          text: 'Nếu cần hỗ trợ vui lòng liên hệ:',
          style: AppTextStyle.paragraphSmall,
          color: AppColors.contentGreen,
          textAlign: TextAlign.center,
        ),
        CustomText(
          text: '@1900 1900',
          style: AppTextStyle.labelSmall,
          color: AppColors.red100,
        ),
      ],
    ).paddingAll(12);
  }
}
