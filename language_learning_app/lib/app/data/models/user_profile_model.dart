enum UserGender {
  male(apiValue: 'MALE', label: 'Nam'),
  female(apiValue: 'FEMALE', label: 'Nữ'),
  other(apiValue: 'OTHER', label: 'Khác');

  const UserGender({required this.apiValue, required this.label});

  final String apiValue;
  final String label;

  static UserGender fromApi(String value) {
    return UserGender.values.firstWhere(
      (gender) => gender.apiValue == value,
      orElse: () => throw FormatException('Giới tính không hợp lệ: $value'),
    );
  }
}

final class UserProfileModel {
  const UserProfileModel({
    required this.id,
    required this.name,
    required this.displayName,
    required this.email,
    required this.avatarUrl,
    required this.dateOfBirth,
    required this.gender,
    required this.requiresProfileSetup,
  });

  final String id;
  final String name;
  final String? displayName;
  final String email;
  final String? avatarUrl;
  final DateTime? dateOfBirth;
  final UserGender? gender;
  final bool requiresProfileSetup;

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    final dateOfBirth = json['dateOfBirth'] as String?;
    final gender = json['gender'] as String?;

    return UserProfileModel(
      id: json['id'] as String,
      name: json['name'] as String,
      displayName: json['displayName'] as String?,
      email: json['email'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      dateOfBirth: dateOfBirth == null ? null : DateTime.parse(dateOfBirth),
      gender: gender == null ? null : UserGender.fromApi(gender),
      requiresProfileSetup: json['requiresProfileSetup'] as bool,
    );
  }
}
