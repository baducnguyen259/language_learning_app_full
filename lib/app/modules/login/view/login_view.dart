import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';

/// UI shell Material 3 cho tính năng đăng nhập.
///
/// Mở màn hình qua `Routes.LOGIN` để route binding cung cấp [LoginController]:
/// ```dart
/// Get.toNamed<void>(Routes.LOGIN);
/// ```
/// Các trường nhập và hành động xác thực sẽ được bổ sung khi triển khai tính
/// năng, không nằm trong shell hiện tại.
class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return BaseScaffold(
      showAppBar: true,
      leadingIcon: AppIcons.icActionArrowLeft,
      backgroundColor: colorScheme.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildAppBar(context),
              const SizedBox(height: 8),
              _buildLogo(context),
              const SizedBox(height: 16),
              _buildAppTitle(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    final navigator = Navigator.of(context);

    return Align(
      alignment: Alignment.centerLeft,
      child: navigator.canPop()
          ? IconButton(
              onPressed: navigator.maybePop,
              tooltip: MaterialLocalizations.of(context).backButtonTooltip,
              icon: const Icon(Icons.arrow_back),
            )
          : const SizedBox(height: kMinInteractiveDimension),
    );
  }

  Widget _buildLogo(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Center(
      child: Semantics(
        image: true,
        label: 'Biểu tượng ứng dụng học ngôn ngữ',
        child: CircleAvatar(
          radius: 36,
          backgroundColor: colorScheme.primaryContainer,
          foregroundColor: colorScheme.onPrimaryContainer,
          child: const Icon(Icons.language, size: 36),
        ),
      ),
    );
  }

  Widget _buildAppTitle(BuildContext context) {
    return Text(
      'Đăng nhập',
      style: Theme.of(context).textTheme.headlineSmall,
      textAlign: TextAlign.center,
    );
  }
}
