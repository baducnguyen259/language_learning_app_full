import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/modules/profile/controllers/profile_controller.dart';
import 'package:language_learning_app/app/modules/profile/widgets/profile_content.dart';

class ProfileView extends GetView<ProfileController> {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: const SafeArea(bottom: false, child: ProfileContent()),
    );
  }
}
