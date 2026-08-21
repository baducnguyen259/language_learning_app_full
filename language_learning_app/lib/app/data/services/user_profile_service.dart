import 'package:language_learning_app/app/data/models/user_profile_model.dart';
import 'package:language_learning_app/app/data/providers/user_profile_provider.dart';

final class UserProfileService {
  const UserProfileService(this._provider);

  final UserProfileProvider _provider;

  Future<UserProfileModel> getMyProfile() {
    return _provider.getMyProfile();
  }

  Future<UserProfileModel> updateMyProfile({
    required String name,
    required String displayName,
    required String phoneNumber,
    required String dateOfBirth,
    required UserGender gender,
  }) {
    return _provider.updateMyProfile(
      name: name,
      displayName: displayName,
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      gender: gender,
    );
  }
}
