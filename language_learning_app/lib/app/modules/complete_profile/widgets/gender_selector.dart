import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/data/models/user_profile_model.dart';

class GenderSelector extends StatelessWidget {
  const GenderSelector({
    super.key,
    required this.selectedGender,
    required this.onSelected,
  });

  final UserGender? selectedGender;
  final ValueChanged<UserGender> onSelected;

  Widget _buildOption(UserGender gender) {
    final isSelected = selectedGender == gender;
    return Expanded(
      child: Material(
        color: isSelected
            ? AppColors.backgroundPPLightAccent
            : AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          onTap: () => onSelected(gender),
          borderRadius: BorderRadius.circular(10),
          child: Container(
            height: 44,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected
                    ? AppColors.purple100
                    : AppColors.borderPrimaryLightGrayScale,
              ),
            ),
            child: CustomText(
              text: gender.label,
              style: AppTextStyle.labelMedSmall,
              color: isSelected
                  ? AppColors.purple100
                  : AppColors.contentSecondary,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomText(
          text: 'Giới tính',
          style: AppTextStyle.labelMedSmall,
          color: AppColors.contentPrimary,
        ),
        const SizedBox(height: 8),
        Row(spacing: 8, children: UserGender.values.map(_buildOption).toList()),
      ],
    );
  }
}
