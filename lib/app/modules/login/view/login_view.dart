import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      showAppBar: true,
      leadingIcon: AppIcons.icBack,
      title: 'App Language',
      appBarTextStyle: AppTextStyle.headingH7Bold.copyWith(
        color: HexColor('#1C1B23'),
      ),
      appBarBackgroundColor: AppColors.white1,
      backgroundColor: AppColors.white1,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildLogo(),
              const SizedBox(height: 16),
              _buildAppTitle(),
              _buildFormLogin(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Center();
  }

  Widget _buildAppTitle() {
    return Column(
      children: [
        CustomText(
          text: 'Chào mừng bạn quay lại!',
          textAlign: TextAlign.center,
          color: HexColor('#1C1B23'),
        ),
        CustomText(
          text: 'Đăng nhập để tiếp tục hành trình học của bạn.',
          style: AppTextStyle.labelXSmall,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildFormLogin() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CustomTextField(
          controller: controller.emailcontroller,
          labelInput: 'Email',
          labelStyle: AppTextStyle.labelMedSmall,
          prefixWidget: CustomImage.asset(AppIcons.icMail),
          hintText: 'Nhập địa chỉ email',
          hintStyle: AppTextStyle.labelSmall,
        ),
      ],
    );
  }
}
