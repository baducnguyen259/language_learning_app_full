import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/data/exceptions/api_exception.dart';
import 'package:language_learning_app/app/data/models/user_profile_model.dart';
import 'package:language_learning_app/app/data/services/user_profile_service.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class CompleteProfileController extends GetxController {
  CompleteProfileController(this._profileService);

  final UserProfileService _profileService;

  final fullNameController = TextEditingController();
  final displayNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneNumberController = TextEditingController();
  final dateOfBirthController = TextEditingController();

  final RxBool isLoading = true.obs;
  final RxBool isSaving = false.obs;
  final RxString errorMessage = ''.obs;
  final Rx<UserGender?> selectedGender = Rx<UserGender?>(null);
  final Rx<DateTime?> selectedDateOfBirth = Rx<DateTime?>(null);
  final Rx<String?> avatarUrl = Rx<String?>(null);

  String _formatDisplayDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }

  String _formatApiDate(DateTime date) {
    final month = date.month.toString().padLeft(2, '0');
    final day = date.day.toString().padLeft(2, '0');
    return '${date.year}-$month-$day';
  }

  void _showError(String message) {
    Get.snackbar('Không thể lưu hồ sơ', message);
  }

  String? _validationMessage() {
    final fullName = fullNameController.text.trim();
    final displayName = displayNameController.text.trim();
    final phoneNumber = phoneNumberController.text.trim();

    if (fullName.length < 2) {
      return 'Họ và tên phải có ít nhất 2 ký tự';
    }
    if (displayName.length < 2) {
      return 'Tên hiển thị phải có ít nhất 2 ký tự';
    }
    if (!RegExp(r'^\+?[0-9]{9,15}$').hasMatch(phoneNumber)) {
      return 'Số điện thoại không hợp lệ';
    }
    if (selectedDateOfBirth.value == null) {
      return 'Vui lòng chọn ngày sinh';
    }
    if (selectedGender.value == null) {
      return 'Vui lòng chọn giới tính';
    }
    return null;
  }

  void _populateForm(UserProfileModel profile) {
    fullNameController.text = profile.name;
    displayNameController.text = profile.displayName ?? '';
    emailController.text = profile.email;
    phoneNumberController.text = profile.phoneNumber ?? '';
    avatarUrl.value = profile.avatarUrl;
    selectedGender.value = profile.gender;
    selectedDateOfBirth.value = profile.dateOfBirth;
    final dateOfBirth = profile.dateOfBirth;
    dateOfBirthController.text = dateOfBirth == null
        ? ''
        : _formatDisplayDate(dateOfBirth.toLocal());
  }

  @override
  void onInit() {
    super.onInit();
    unawaited(loadProfile());
  }

  Future<void> loadProfile() async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      final profile = await _profileService.getMyProfile();
      _populateForm(profile);
    } on ApiException catch (error) {
      errorMessage.value = error.message;
    } catch (_) {
      errorMessage.value = 'Không thể tải hồ sơ. Vui lòng thử lại';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> selectDateOfBirth(BuildContext context) async {
    final now = DateTime.now();
    final selectedDate = await showDatePicker(
      context: context,
      initialDate:
          selectedDateOfBirth.value ??
          DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(1900),
      lastDate: now,
      helpText: 'Chọn ngày sinh',
      cancelText: 'Hủy',
      confirmText: 'Chọn',
    );
    if (selectedDate == null) return;

    selectedDateOfBirth.value = selectedDate;
    dateOfBirthController.text = _formatDisplayDate(selectedDate);
  }

  void selectGender(UserGender gender) {
    selectedGender.value = gender;
  }

  void showAvatarUploadUnavailable() {
    Get.snackbar(
      'Ảnh đại diện',
      'Chức năng tải ảnh sẽ được bổ sung khi hoàn thiện Media Upload',
    );
  }

  void showProfileRequiredMessage() {
    Get.snackbar(
      'Hoàn thiện hồ sơ',
      'Vui lòng lưu thông tin cá nhân để tiếp tục',
    );
  }

  Future<void> saveProfile() async {
    if (isLoading.value || isSaving.value || errorMessage.value.isNotEmpty) {
      return;
    }
    final validationMessage = _validationMessage();
    if (validationMessage != null) {
      _showError(validationMessage);
      return;
    }

    final dateOfBirth = selectedDateOfBirth.value!;
    final gender = selectedGender.value!;
    isSaving.value = true;
    try {
      await _profileService.updateMyProfile(
        name: fullNameController.text.trim(),
        displayName: displayNameController.text.trim(),
        phoneNumber: phoneNumberController.text.trim(),
        dateOfBirth: _formatApiDate(dateOfBirth),
        gender: gender,
      );
      await Get.offAllNamed<void>(AppRoutes.main);
    } on ApiException catch (error) {
      _showError(error.message);
    } catch (_) {
      _showError('Đã xảy ra lỗi khi lưu hồ sơ. Vui lòng thử lại');
    } finally {
      isSaving.value = false;
    }
  }

  @override
  void onClose() {
    fullNameController.dispose();
    displayNameController.dispose();
    emailController.dispose();
    phoneNumberController.dispose();
    dateOfBirthController.dispose();
    super.onClose();
  }
}
